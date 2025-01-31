import { inject, injectable, multiInject, optional } from "@mainsail/container";
import { Contracts, Identifiers } from "@mainsail/contracts";
// TODO: Move enums to contracts
import { Enums, Utils } from "@mainsail/kernel";

@injectable()
export class BlockProcessor implements Contracts.Processor.BlockProcessor {
	@inject(Identifiers.Application.Instance)
	private readonly app!: Contracts.Kernel.Application;

	@inject(Identifiers.State.Service)
	private readonly stateService!: Contracts.State.Service;

	@inject(Identifiers.State.State)
	private readonly state!: Contracts.State.State;

	@inject(Identifiers.Cryptography.Configuration)
	private readonly configuration!: Contracts.Crypto.Configuration;

	@inject(Identifiers.Database.Service)
	private readonly databaseService!: Contracts.Database.DatabaseService;

	@inject(Identifiers.TransactionPool.Service)
	private readonly transactionPool!: Contracts.TransactionPool.Service;

	@inject(Identifiers.Processor.TransactionProcessor)
	private readonly transactionProcessor!: Contracts.Processor.TransactionProcessor;

	@inject(Identifiers.Transaction.Handler.Registry)
	private handlerRegistry!: Contracts.Transactions.TransactionHandlerRegistry;

	@inject(Identifiers.Proposer.Selector)
	private readonly proposerSelector!: Contracts.Proposer.Selector;

	@inject(Identifiers.Services.EventDispatcher.Service)
	private readonly events!: Contracts.Kernel.EventDispatcher;

	@inject(Identifiers.Services.Log.Service)
	private readonly logger!: Contracts.Kernel.Logger;

	@inject(Identifiers.ValidatorSet.Service)
	private readonly validatorSet!: Contracts.ValidatorSet.Service;

	@inject(Identifiers.Processor.BlockVerifier)
	private readonly verifier!: Contracts.Processor.Verifier;

	@multiInject(Identifiers.State.ValidatorMutator)
	private readonly validatorMutators!: Contracts.State.ValidatorMutator[];

	@inject(Identifiers.ApiSync.Service)
	@optional()
	private readonly apiSync?: Contracts.ApiSync.Service;

	public async process(unit: Contracts.Processor.ProcessableUnit): Promise<boolean> {
		try {
			if (!(await this.verifier.verify(unit))) {
				return false;
			}

			for (const transaction of unit.getBlock().transactions) {
				await this.transactionProcessor.process(unit.store.walletRepository, transaction);
			}

			await this.#applyBlockToForger(unit);

			return true;
		} catch (error) {
			console.log(error);
			this.logger.error(`Cannot process block, because: ${error.message}`);
		}

		return false;
	}

	public async commit(unit: Contracts.Processor.ProcessableUnit): Promise<void> {
		if (this.apiSync) {
			await this.apiSync.beforeCommit();
		}

		const commit = await unit.getCommit();

		if (!this.state.isBootstrap()) {
			this.databaseService.addCommit(commit);

			if (unit.persist) {
				await this.databaseService.persist();
			}
		}

		this.#setConfigurationHeight(unit);
		await unit.store.onCommit(unit);
		await this.validatorSet.onCommit(unit);
		await this.proposerSelector.onCommit(unit);
		await this.stateService.onCommit(unit);

		if (this.apiSync) {
			await this.apiSync.onCommit(unit);
		}

		for (const transaction of unit.getBlock().transactions) {
			await this.transactionPool.removeForgedTransaction(transaction);
			await this.#emitTransactionEvents(transaction);
		}

		this.#logBlockCommitted(unit);
		this.#logNewRound(unit);

		void this.events.dispatch(Enums.BlockEvent.Applied, commit);
	}

	#logBlockCommitted(unit: Contracts.Processor.ProcessableUnit): void {
		const block = unit.getBlock();
		const height = block.data.height;
		const totalTransactions = block.data.numberOfTransactions;

		if (!this.state.isBootstrap()) {
			this.logger.info(
				`Block ${height.toLocaleString()} with ${totalTransactions.toLocaleString()} tx(s) committed`,
			);
		}
	}

	#logNewRound(unit: Contracts.Processor.ProcessableUnit): void {
		const height = unit.getBlock().data.height;
		if (Utils.roundCalculator.isNewRound(height + 1, this.configuration)) {
			const roundInfo = Utils.roundCalculator.calculateRound(height + 1, this.configuration);

			if (!this.state.isBootstrap()) {
				this.logger.debug(
					`Starting validator round ${roundInfo.round} at height ${roundInfo.roundHeight} with ${roundInfo.maxValidators} validators`,
				);
			}
		}
	}

	#setConfigurationHeight(unit: Contracts.Processor.ProcessableUnit): void {
		// NOTE: The configuration is always set to the next height. To height which is going to be proposed.
		this.configuration.setHeight(unit.height + 1);

		if (this.configuration.isNewMilestone()) {
			this.logger.notice(`Milestone change: ${JSON.stringify(this.configuration.getMilestoneDiff())}`);

			void this.app
				.get<Contracts.Kernel.EventDispatcher>(Identifiers.Services.EventDispatcher.Service)
				.dispatch(Enums.CryptoEvent.MilestoneChanged);
		}
	}

	async #emitTransactionEvents(transaction: Contracts.Crypto.Transaction): Promise<void> {
		void this.events.dispatch(Enums.TransactionEvent.Applied, transaction.data);
		const handler = await this.handlerRegistry.getActivatedHandlerForData(transaction.data);
		// TODO: ! no reason to pass this.emitter
		handler.emitEvents(transaction, this.events);
	}

	async #applyBlockToForger(unit: Contracts.Processor.ProcessableUnit) {
		const block = unit.getBlock();
		const walletRepository = unit.store.walletRepository;

		const forgerWallet = await walletRepository.findByPublicKey(unit.getBlock().data.generatorPublicKey);

		for (const validatorMutator of this.validatorMutators) {
			await validatorMutator.apply(walletRepository, forgerWallet, block.data);
		}
	}
}

import { inject, injectable } from "@mainsail/container";
import { Contracts, Exceptions, Identifiers } from "@mainsail/contracts";
import { Utils } from "@mainsail/kernel";

@injectable()
export class ValidatorSet implements Contracts.ValidatorSet.Service {
	@inject(Identifiers.Cryptography.Configuration)
	private readonly configuration!: Contracts.Crypto.Configuration;

	@inject(Identifiers.State.ValidatorWallet.Factory)
	private readonly validatorWalletFactory!: Contracts.State.ValidatorWalletFactory;

	#validators: Contracts.State.ValidatorWallet[] = [];
	#indexByPublicKey: Map<string, number> = new Map();

	public restore(store: Contracts.State.Store): void {
		const activeValidators = store.getAttribute<string>("activeValidators").split(",");

		this.#validators = activeValidators.map((address, index) => {
			const wallet = this.validatorWalletFactory(store.walletRepository.findByAddress(address)!);
			this.#indexByPublicKey.set(wallet.getWalletPublicKey(), index);
			return wallet;
		});
	}

	public async onCommit(unit: Contracts.Processor.ProcessableUnit): Promise<void> {
		if (Utils.roundCalculator.isNewRound(unit.height + 1, this.configuration)) {
			this.buildValidatorRanking(unit.store);
		}
	}

	public getActiveValidators(): Contracts.State.ValidatorWallet[] {
		const { activeValidators } = this.configuration.getMilestone();

		if (this.#validators.length !== activeValidators) {
			throw new Exceptions.NotEnoughActiveValidatorsError(this.#validators.length, activeValidators);
		}

		return this.#validators.slice(0, activeValidators);
	}

	public getValidator(index: number): Contracts.State.ValidatorWallet {
		return this.#validators[index];
	}

	public getValidatorIndexByWalletPublicKey(walletPublicKey: string): number {
		const result = this.#indexByPublicKey.get(walletPublicKey);

		if (result === undefined) {
			throw new Error(`Validator ${walletPublicKey} not found.`);
		}

		return result;
	}

	public buildValidatorRanking(store: Contracts.State.Store): void {
		this.#validators = [];
		this.#indexByPublicKey = new Map();

		for (const wallet of store.walletRepository.allValidators()) {
			const validator = this.validatorWalletFactory(wallet);
			if (validator.isResigned()) {
				validator.unsetRank();
				validator.unsetApproval();
			} else {
				this.#validators.push(validator);
			}
		}

		this.#validators.sort((a, b) => {
			const voteBalanceA: Utils.BigNumber = a.getVoteBalance();
			const voteBalanceB: Utils.BigNumber = b.getVoteBalance();

			const diff = voteBalanceB.comparedTo(voteBalanceA);

			if (diff === 0) {
				Utils.assert.defined<string>(a.getWalletPublicKey());
				Utils.assert.defined<string>(b.getWalletPublicKey());

				if (a.getWalletPublicKey() === b.getWalletPublicKey()) {
					throw new Error(
						`The balance and public key of both validators are identical! ` +
							`Validator "${a.getWalletPublicKey()}" appears twice in the list.`,
					);
				}

				return a.getWalletPublicKey()!.localeCompare(b.getWalletPublicKey()!, "en");
			}

			return diff;
		});

		const totalSupply = Utils.supplyCalculator.calculateSupply(store.getLastHeight(), this.configuration);

		for (let index = 0; index < this.#validators.length; index++) {
			const validator = this.#validators[index];

			validator.setRank(index + 1);
			validator.setApproval(Utils.validatorCalculator.calculateApproval(validator.getVoteBalance(), totalSupply));

			const walletPublicKey = validator.getWalletPublicKey();
			Utils.assert.defined<string>(walletPublicKey);
			this.#indexByPublicKey.set(walletPublicKey, index);
		}

		store.setAttribute("activeValidators", this.#validators.map((v) => v.getWallet().getAddress()).join(","));
	}
}

import { IBlock, IKeyPair, IPrecommit, IPrevote, IProposal } from "./crypto";
import { WalletRepositoryClone } from "./state";

export interface IRoundState {
	getWalletRepository(): WalletRepositoryClone;
	getProposal(): IProposal | undefined;
	setProposal(proposal: IProposal): void;
	setProcessorResult(processorResult: boolean): void;
	getProcessorResult(): boolean;
}

export interface IConsensusService {
	run(): Promise<void>;
	onProposal(roudnState: IRoundState): Promise<void>;
	onMajorityPrevote(roundState: IRoundState): Promise<void>;
	onMajorityPrecommit(roundState: IRoundState): Promise<void>;
	onTimeoutPropose(height: number, round: number): Promise<void>;
	onTimeoutPrevote(height: number, round: number): Promise<void>;
	onTimeoutPrecommit(height: number, round: number): Promise<void>;
}

export interface IValidator {
	configure(publicKey: string, keyPair: IKeyPair): IValidator;
	getConsensusPublicKey(): string;
	prepareBlock(height: number, round: number): Promise<IBlock>;
	propose(height: number, round: number, block: IBlock, validRound: number | undefined): Promise<IProposal>;
	prevote(height: number, round: number, blockId: string | undefined): Promise<IPrevote>;
	precommit(height: number, round: number, blockId: string | undefined): Promise<IPrecommit>;
}

export interface IValidatorRepository {
	getValidator(publicKey: string): IValidator;
	getValidators(publicKeys: string[]): IValidator[];
}

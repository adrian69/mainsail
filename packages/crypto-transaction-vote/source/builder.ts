import { injectable, postConstruct } from "@mainsail/container";
import { Contracts } from "@mainsail/contracts";
import { TransactionBuilder } from "@mainsail/crypto-transaction";
import { BigNumber } from "@mainsail/utils";

import { VoteTransaction } from "./versions/1";

@injectable()
export class VoteBuilder extends TransactionBuilder<VoteBuilder> {
	@postConstruct()
	public postConstruct() {
		this.initializeData();

		this.data.type = VoteTransaction.type;
		this.data.typeGroup = VoteTransaction.typeGroup;
		this.data.amount = BigNumber.ZERO;
		this.data.recipientId = undefined;
		this.data.senderPublicKey = "";
		this.data.asset = { unvotes: [], votes: [] };

		this.signWithSenderAsRecipient = true;
	}

	public votesAsset(votes: string[]): VoteBuilder {
		if (this.data.asset && this.data.asset.votes) {
			this.data.asset.votes = votes;
		}

		return this;
	}

	public unvotesAsset(unvotes: string[]): VoteBuilder {
		if (this.data.asset && this.data.asset.unvotes) {
			this.data.asset.unvotes = unvotes;
		}

		return this;
	}

	public async getStruct(): Promise<Contracts.Crypto.TransactionData> {
		const struct: Contracts.Crypto.TransactionData = await super.getStruct();
		struct.amount = this.data.amount;
		struct.recipientId = this.data.recipientId;
		struct.asset = this.data.asset;
		return struct;
	}

	protected instance(): VoteBuilder {
		return this;
	}
}

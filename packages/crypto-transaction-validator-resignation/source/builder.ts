import { injectable, postConstruct } from "@mainsail/container";
import { Contracts } from "@mainsail/contracts";
import { TransactionBuilder } from "@mainsail/crypto-transaction";
import { BigNumber } from "@mainsail/utils";

import { ValidatorResignationTransaction } from "./versions/1";

@injectable()
export class ValidatorResignationBuilder extends TransactionBuilder<ValidatorResignationBuilder> {
	@postConstruct()
	public postConstruct() {
		this.initializeData();

		this.data.type = ValidatorResignationTransaction.type;
		this.data.typeGroup = ValidatorResignationTransaction.typeGroup;
		this.data.amount = BigNumber.ZERO;
		this.data.senderPublicKey = "";
	}

	public async getStruct(): Promise<Contracts.Crypto.TransactionData> {
		const struct: Contracts.Crypto.TransactionData = await super.getStruct();
		struct.amount = this.data.amount;
		return struct;
	}

	protected instance(): ValidatorResignationBuilder {
		return this;
	}
}

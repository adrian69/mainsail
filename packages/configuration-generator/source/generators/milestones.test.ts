import { describe } from "../../../test-framework";
import { MilestonesGenerator } from "./milestones";

describe<{
	dataPath: string;
	generator: MilestonesGenerator;
}>("MilestonesGenerator", ({ it, assert, beforeEach }) => {
	beforeEach((context) => {
		context.generator = new MilestonesGenerator();
	});

	it("#generate - should return empty data", ({ generator }) => {
		assert.equal(generator.generate(), []);
	});

	it("#setInitial - should set initial milestone", ({ generator }) => {
		const date = new Date();

		assert.equal(
			generator
				.setInitial({
					blockTime: 8000,
					epoch: date,
					maxBlockPayload: 2000,
					maxTxPerBlock: 100,
					validators: 53,
					vendorFieldLength: 255,
					address: {
						bech32m: "ark",
					},
				})
				.generate(),
			[
				{
					activeValidators: 0,
					address: {
						bech32m: "ark",
					},
					block: {
						maxPayload: 2000,
						maxTransactions: 100,
						version: 1,
					},
					blockTime: 8000,
					epoch: date.toISOString().slice(0, 11) + "00:00:00.000Z",
					height: 0,
					multiPaymentLimit: 256,
					reward: "0",
					satoshi: {
						decimals: 8,
						denomination: 1e8,
					},
					stageTimeout: 2000,
					stageTimeoutIncrease: 2000,
					vendorFieldLength: 255,
				},
				{
					activeValidators: 53,
					height: 1,
				},
			],
		);
	});

	it("#setReward - should set reward", ({ generator }) => {
		assert.equal(generator.setReward(3, "200").generate(), [
			{
				height: 3,
				reward: "200",
			},
		]);
	});
});

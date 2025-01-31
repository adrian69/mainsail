import { Contracts, Identifiers } from "@mainsail/contracts";

import { describeSkip, Factories } from "../../../test-framework";
import { setUp } from "../../test/setup";
import { Wallets } from "..";
import { WalletIndex } from ".";

describeSkip<{
	factory: Factories.FactoryBuilder;
	wallet: Contracts.State.Wallet;
	walletIndex: WalletIndex;
	app: Contracts.Kernel.Application;
}>("WalletIndex", ({ it, beforeAll, beforeEach, assert }) => {
	beforeAll(async (context) => {
		const environment = await setUp();

		context.factory = environment.factory;
		context.app = environment.app;
	});

	beforeEach(async (context) => {
		context.wallet = new Wallets.Wallet(
			"address",
			context.app.get(Identifiers.State.Wallet.Attributes),
			context.app.getTagged(Identifiers.WalletRepository, "state", "blockchain"),
		);

		context.walletIndex = new WalletIndex();
	});

	it("should return entries", (context) => {
		context.walletIndex.set(context.wallet.getAddress(), context.wallet);
		const entries = context.walletIndex.entries();

		assert.equal(entries.length, 1);
		assert.equal(entries[0][0], entries[0][1].getAddress());
		assert.equal(entries[0][0], context.wallet.getAddress());
	});

	it("should return keys", (context) => {
		context.walletIndex.set(context.wallet.getAddress(), context.wallet);

		assert.true(context.walletIndex.keys().includes(context.wallet.getAddress()));
	});

	it("set - should set and get addresses", (context) => {
		assert.false(context.walletIndex.has(context.wallet.getAddress()));

		context.walletIndex.set(context.wallet.getAddress(), context.wallet);

		assert.equal(context.walletIndex.get(context.wallet.getAddress()), context.wallet);
		assert.true(context.walletIndex.has(context.wallet.getAddress()));

		assert.true(context.walletIndex.values().includes(context.wallet));

		context.walletIndex.clear();
		assert.false(context.walletIndex.has(context.wallet.getAddress()));
	});

	it("set - should override key with new wallet", async (context) => {
		const anotherWallet = new Wallets.Wallet(
			"address2",
			context.app.get(Identifiers.State.Wallet.Attributes),
			context.app.getTagged(Identifiers.WalletRepository, "state", "blockchain"),
		);

		context.walletIndex.set("key1", context.wallet);
		context.walletIndex.set("key1", anotherWallet);

		assert.equal(context.walletIndex.get("key1"), anotherWallet);

		const entries = context.walletIndex.entries();

		assert.equal(entries.length, 1);
	});

	it("forget - should index and forget wallets", (context) => {
		assert.false(context.walletIndex.has(context.wallet.getAddress()));

		context.walletIndex.set(context.wallet.getAddress(), context.wallet);
		assert.true(context.walletIndex.has(context.wallet.getAddress()));

		context.walletIndex.forget(context.wallet.getAddress());
		assert.false(context.walletIndex.has(context.wallet.getAddress()));
	});

	it("forget - should not throw if key is not indexed", (context) => {
		context.walletIndex.forget(context.wallet.getAddress());
	});
});

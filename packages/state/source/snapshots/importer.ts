import { inject, injectable } from "@mainsail/container";
import { Contracts, Identifiers } from "@mainsail/contracts";
import { Utils } from "@mainsail/kernel";
import { createReadStream, ensureDirSync, readdirSync } from "fs-extra";
import { join } from "path";
import Pumpify from "pumpify";
import readline, { Interface } from "readline";
import { createGunzip } from "zlib";

@injectable()
export class Importer implements Contracts.State.Importer {
	@inject(Identifiers.Application.Instance)
	private readonly app!: Contracts.Kernel.Application;

	@inject(Identifiers.Services.Log.Service)
	private readonly logger!: Contracts.Kernel.Logger;

	async import(maxHeight: number, store: Contracts.State.Store): Promise<void> {
		// ...
		const fileName = await this.#findImportFile(maxHeight);
		if (!fileName) {
			this.logger.info("No state snapshot found to import");
			return;
		}

		this.logger.info(`Importing state snapshot: ${fileName}`);

		await this.#readFile(fileName, store);
	}

	async #findImportFile(maxHeigh: number): Promise<string | undefined> {
		const path = this.#getImportPath();
		ensureDirSync(path);

		const regexPattern = /^\d+\.gz$/;
		const heights = readdirSync(path)
			.filter((item) => regexPattern.test(item))
			.map((item) => +item.split(".")[0])
			.filter((item) => item <= maxHeigh)
			.sort((a, b) => b - a);

		if (heights.length > 0) {
			return `${heights[0]}.gz`;
		}
		return undefined;
	}

	async #readFile(fileName: string, store: Contracts.State.Store): Promise<void> {
		const readStream = createReadStream(this.app.dataPath(join("state-export", fileName)));
		const importStream = new Pumpify(readStream, createGunzip());
		const reader = readline.createInterface({
			crlfDelay: Number.POSITIVE_INFINITY,
			input: importStream,
		});

		await this.#readVersion(reader);
		await this.#readState(reader, store);
		await this.#readWallets(reader, store.walletRepository);
		await this.#readIndexes(reader, store.walletRepository);
	}

	async #readVersion(reader: Interface): Promise<void> {
		const version = (await reader[Symbol.asyncIterator]().next()).value;
		if (version !== "1") {
			throw new Error(`Invalid snapshot version: ${version}`);
		}

		await reader[Symbol.asyncIterator]().next(); // App version
		await reader[Symbol.asyncIterator]().next(); // Empty Line
	}

	async #readState(reader: Interface, store: Contracts.State.Store): Promise<void> {
		const state = (await reader[Symbol.asyncIterator]().next()).value; // State height
		await reader[Symbol.asyncIterator]().next(); // Empty Line

		store.fromJson(JSON.parse(state));
	}

	async #readWallets(reader: Interface, walletRepository: Contracts.State.WalletRepository): Promise<void> {
		// eslint-disable-next-line no-constant-condition
		while (true) {
			const { value, done } = await reader[Symbol.asyncIterator]().next();
			if (done || value === "") {
				break;
			}

			const data = JSON.parse(value);

			Utils.assert.defined<string>(data.address);
			const wallet = walletRepository.findByAddress(data.address);
			wallet.fromJson(data);
		}
	}

	async #readIndexes(reader: Interface, walletRepository: Contracts.State.WalletRepository): Promise<void> {
		// eslint-disable-next-line no-constant-condition
		while (true) {
			const { value, done } = await reader[Symbol.asyncIterator]().next();
			if (done || value === "") {
				break;
			}

			await this.#readIndex(reader, walletRepository, value);
		}
	}

	async #readIndex(
		reader: Interface,
		walletRepository: Contracts.State.WalletRepository,
		indexName: string,
	): Promise<void> {
		// eslint-disable-next-line no-constant-condition
		while (true) {
			const { value, done } = await reader[Symbol.asyncIterator]().next();
			if (done || value === "") {
				break;
			}

			const [key, address] = value.split(":");
			Utils.assert.defined<string>(key);
			Utils.assert.defined<string>(address);

			if (!walletRepository.hasByAddress(address)) {
				throw new Error(`Wallet ${address} not found`);
			}

			walletRepository.setOnIndex(indexName, key, walletRepository.findByAddress(address));
		}
	}

	#getImportPath(): string {
		return this.app.dataPath("state-export");
	}
}

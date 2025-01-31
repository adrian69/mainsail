import { notFound } from "@hapi/boom";
import Hapi from "@hapi/hapi";
import { inject, injectable } from "@mainsail/container";
import { Contracts, Identifiers } from "@mainsail/contracts";

import { BlockResource, TransactionResource } from "../resources";
import { Controller } from "./controller";

@injectable()
export class BlocksController extends Controller {
	@inject(Identifiers.Database.Service)
	private readonly database!: Contracts.Database.DatabaseService;

	public async index(request: Hapi.Request) {
		const lastBlock = this.stateService.getStore().getLastBlock();

		const pagination = this.getQueryPagination(request.query);

		const blocks = await this.database.findBlocks(
			lastBlock.data.height - pagination.offset - pagination.limit + 1,
			lastBlock.data.height - pagination.offset,
		);
		blocks.reverse();

		if (request.query.transform) {
			return this.toPagination(
				{
					results: blocks,
					totalCount: lastBlock.data.height,
				},
				BlockResource,
				true,
			);
		} else {
			return this.toPagination(
				{
					results: blocks.map((block) => block.data),
					totalCount: lastBlock.data.height,
				},
				BlockResource,
				false,
			);
		}
	}

	public async first(request: Hapi.Request) {
		const commit = this.stateService.getStore().getGenesisCommit();

		if (request.query.transform) {
			return this.respondWithResource(commit.block, BlockResource, true);
		} else {
			return this.respondWithResource(commit.block.data, BlockResource, false);
		}
	}

	public async last(request: Hapi.Request) {
		const block = this.stateService.getStore().getLastBlock();
		if (request.query.transform) {
			return this.respondWithResource(block, BlockResource, true);
		} else {
			return this.respondWithResource(block.data, BlockResource, false);
		}
	}

	public async show(request: Hapi.Request) {
		const block = await this.getBlock(request.params.id);

		if (!block) {
			return notFound("Block not found");
		}

		if (request.query.transform) {
			return this.respondWithResource(block, BlockResource, true);
		} else {
			return this.respondWithResource(block.data, BlockResource, false);
		}
	}

	public async transactions(request: Hapi.Request) {
		const block = await this.getBlock(request.params.id);

		if (!block) {
			return notFound("Block not found");
		}

		const transactions = block.transactions.map((tx) => tx.data);

		const pagination = this.getQueryPagination(request.query);

		return this.toPagination(
			{
				results: transactions.slice(pagination.offset, pagination.offset + pagination.limit),
				totalCount: block.transactions.length,
			},
			TransactionResource,
			request.query.transform,
		);
	}

	// TODO: Support height only
	private async getBlock(idOrHeight: string): Promise<Contracts.Crypto.Block | undefined> {
		return this.database.getBlock(Number.parseInt(idOrHeight));
	}
}

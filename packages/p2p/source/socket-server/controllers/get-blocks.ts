import Hapi from "@hapi/hapi";
import { inject, injectable } from "@mainsail/container";
import { Contracts, Identifiers } from "@mainsail/contracts";
import { Utils } from "@mainsail/kernel";

import { constants } from "../../constants";
import { mapAddr } from "../utils/map-addr";

@injectable()
export class GetBlocksController implements Contracts.P2P.Controller {
	@inject(Identifiers.Services.Log.Service)
	private readonly logger!: Contracts.Kernel.Logger;

	@inject(Identifiers.State.Service)
	private readonly stateService!: Contracts.State.Service;

	@inject(Identifiers.Database.Service)
	private readonly database!: Contracts.Database.DatabaseService;

	public async handle(
		request: Contracts.P2P.GetBlocksRequest,
		h: Hapi.ResponseToolkit,
	): Promise<Contracts.P2P.GetBlocksResponse> {
		const requestBlockHeight: number = request.payload.fromHeight;
		const requestBlockLimit: number = request.payload.limit;

		const lastHeight: number = this.stateService.getStore().getLastHeight();
		if (requestBlockHeight > lastHeight) {
			return { blocks: [] };
		}

		const commits: Buffer[] = await this.database.findCommitBuffers(
			requestBlockHeight,
			requestBlockHeight + requestBlockLimit - 1,
		);

		// Only return the blocks fetched while we are below the p2p maxPayload limit
		const blocksToReturn: Buffer[] = [];
		const maxPayload = constants.MAX_PAYLOAD_CLIENT;
		let totalSize = 0;

		for (const commit of commits) {
			totalSize += commit.length;
			if (totalSize > maxPayload) {
				break;
			}

			blocksToReturn.push(commit);
		}

		this.logger.info(
			`${mapAddr(request.info.remoteAddress)} has downloaded ${Utils.pluralize(
				"block",
				blocksToReturn.length,
				true,
			)} from height ${requestBlockHeight.toLocaleString()}`,
		);

		return { blocks: blocksToReturn };
	}
}

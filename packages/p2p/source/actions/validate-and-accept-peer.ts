import { Contracts, Identifiers } from "@mainsail/contracts";
import { Services, Types } from "@mainsail/kernel";

import { PeerProcessor } from "../peer-processor";

export class ValidateAndAcceptPeerAction extends Services.Triggers.Action {
	#app: Contracts.Kernel.Application;

	public constructor(app: Contracts.Kernel.Application) {
		super();
		this.#app = app;
	}

	public async execute(arguments_: Types.ActionArguments): Promise<void> {
		const ip: string = arguments_.ip;
		const options: Contracts.P2P.AcceptNewPeerOptions = arguments_.options;

		return this.#app.get<PeerProcessor>(Identifiers.P2P.Peer.Processor).validateAndAcceptPeer(ip, options);
	}
}

import { Contracts, Identifiers } from "@mainsail/contracts";
import { Providers } from "@mainsail/kernel";

import { Configuration } from "./configuration";

export class ServiceProvider extends Providers.ServiceProvider {
	public async register(): Promise<void> {
		try {
			this.app.bind(Identifiers.Cryptography.Configuration).to(Configuration).inSingletonScope();

			const config: Contracts.Crypto.NetworkConfigPartial = this.#fromConfigRepository();

			this.app.get<Contracts.Crypto.Configuration>(Identifiers.Cryptography.Configuration).setConfig(config);
		} catch {}
	}

	public requiredByWorker(): boolean {
		return true;
	}

	#fromConfigRepository(): Contracts.Crypto.NetworkConfigPartial {
		const configRepository = this.app.get<Contracts.Kernel.Repository>(Identifiers.Config.Repository);

		return {
			genesisBlock: configRepository.get<Contracts.Crypto.CommitJson>("crypto.genesisBlock")!,
			milestones: configRepository.get<Contracts.Crypto.MilestonePartial[]>("crypto.milestones")!,
			network: configRepository.get<Contracts.Crypto.Network>("crypto.network")!,
		};
	}
}

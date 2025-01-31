import { inject, injectable } from "@mainsail/container";
import { yellow } from "kleur";

import { Identifiers } from "../ioc";
import type { Logger } from "../services";

@injectable()
export class Title {
	@inject(Identifiers.Logger)
	private readonly logger!: Logger;

	public async render(title: string): Promise<void> {
		this.logger.log(yellow(title));
		this.logger.log(yellow("=".repeat(title.length)));
	}
}

import { inject, injectable } from "@mainsail/container";

import { Application } from "../application";
import { Spinner } from "../components";
import { Identifiers } from "../ioc";
import { ProcessManager } from "../services";

@injectable()
export class RestartProcess {
	@inject(Identifiers.Application.Instance)
	private readonly app!: Application;

	@inject(Identifiers.ProcessManager)
	private readonly processManager!: ProcessManager;

	public execute(processName: string): void {
		let spinner;
		try {
			spinner = this.app.get<Spinner>(Identifiers.Spinner).render(`Restarting ${processName}`);

			this.processManager.restart(processName);
		} catch (error) {
			throw new Error(error.stderr ? `${error.message}: ${error.stderr}` : error.message);
		} finally {
			spinner.stop();
		}
	}
}

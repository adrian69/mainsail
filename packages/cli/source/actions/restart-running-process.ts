import { inject, injectable } from "@mainsail/container";

import { Application } from "../application";
import { Identifiers } from "../ioc";
import { ProcessManager } from "../services";
import { RestartProcess } from "./restart-process";

@injectable()
export class RestartRunningProcess {
	@inject(Identifiers.Application.Instance)
	private readonly app!: Application;

	@inject(Identifiers.ProcessManager)
	private readonly processManager!: ProcessManager;

	public execute(processName: string): void {
		if (this.processManager.isOnline(processName)) {
			this.app.get<RestartProcess>(Identifiers.RestartProcess).execute(processName);
		}
	}
}

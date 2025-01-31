import { Identifiers, Services } from "@mainsail/cli";
import { Console, describe } from "@mainsail/test-framework";

import { Command } from "./api-stop";

describe<{
	cli: Console;
	processManager: Services.ProcessManager;
}>("ApiStopCommand", ({ beforeEach, it, assert, stub }) => {
	beforeEach((context) => {
		context.cli = new Console();
		context.processManager = context.cli.app.get(Identifiers.ProcessManager);
	});

	it("should throw if the process does not exist", async ({ processManager, cli }) => {
		const missing = stub(processManager, "missing").returnValue(true);
		const isUnknown = stub(processManager, "isUnknown").returnValue(false);
		const isStopped = stub(processManager, "isStopped").returnValue(false);

		await assert.rejects(() => cli.execute(Command), 'The "mainsail-api" process does not exist.');
	});

	it("should throw if the process entered an unknown state", async ({ processManager, cli }) => {
		const missing = stub(processManager, "missing").returnValue(false);
		const isUnknown = stub(processManager, "isUnknown").returnValue(true);
		const isStopped = stub(processManager, "isStopped").returnValue(false);

		await assert.rejects(() => cli.execute(Command), 'The "mainsail-api" process has entered an unknown state.');
	});

	it("should throw if the process is stopped", async ({ processManager, cli }) => {
		const missing = stub(processManager, "missing").returnValue(false);
		const isUnknown = stub(processManager, "isUnknown").returnValue(false);
		const isStopped = stub(processManager, "isStopped").returnValue(true);

		await assert.rejects(() => cli.execute(Command), 'The "mainsail-api" process is not running.');
	});

	it("should stop the process if the [--daemon] flag is not present", async ({ processManager, cli }) => {
		const missing = stub(processManager, "missing").returnValue(false);
		const isUnknown = stub(processManager, "isUnknown").returnValue(false);
		const isStopped = stub(processManager, "isStopped").returnValue(false);
		const deleteSpy = stub(processManager, "delete");

		await cli.withFlags({ daemon: true }).execute(Command);

		deleteSpy.calledOnce();
	});

	it("should delete the process if the [--daemon] flag is present", async ({ processManager, cli }) => {
		const missing = stub(processManager, "missing").returnValue(false);
		const isUnknown = stub(processManager, "isUnknown").returnValue(false);
		const isStopped = stub(processManager, "isStopped").returnValue(false);
		const stop = stub(processManager, "stop");

		await cli.execute(Command);

		stop.calledOnce();
	});
});

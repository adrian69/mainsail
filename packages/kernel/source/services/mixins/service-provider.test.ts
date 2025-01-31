import { Container } from "@mainsail/container";
import { Identifiers } from "@mainsail/contracts";

import { describe } from "../../../../test-framework";
import { Application } from "../../application";
import { MixinService } from "./mixins";
import { ServiceProvider } from "./service-provider";

describe<{
	app: Application;
}>("MixinServiceProvider", ({ assert, beforeEach, it }) => {
	beforeEach((context) => {
		context.app = new Application(new Container());
	});
	it(".register", async (context) => {
		assert.false(context.app.isBound(Identifiers.Services.Mixin.Service));

		await context.app.resolve<ServiceProvider>(ServiceProvider).register();

		assert.true(context.app.isBound(Identifiers.Services.Mixin.Service));
		assert.instance(context.app.get(Identifiers.Services.Mixin.Service), MixinService);
	});
});

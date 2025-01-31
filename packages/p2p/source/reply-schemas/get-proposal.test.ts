import { Validator } from "@mainsail/validation/source/validator";

import { describe, Sandbox } from "../../../test-framework/distribution";
import { headers } from "../../test/fixtures/responses/headers";
import { getProposal } from "./get-proposal";
import { prepareValidatorContext } from "../../test/helpers/prepare-validator-context";

type Context = {
	sandbox: Sandbox;
	validator: Validator;
};

describe<Context>("GetProposal Schema", ({ it, assert, beforeEach, each }) => {
	let data;

	beforeEach((context) => {
		data = {
			headers,
			proposal: Buffer.alloc(0),
		};

		context.sandbox = new Sandbox();

		context.validator = context.sandbox.app.resolve(Validator);

		prepareValidatorContext(context);
	});

	it("should pass validation", ({ validator }) => {
		const result = validator.validate(getProposal, data);
		assert.undefined(result.error);
	});

	it("should not pass if proposal is not buffer", ({ validator }) => {
		const result = validator.validate(getProposal, {
			...data,
			proposal: 1,
		});

		assert.defined(result.error);
	});

	each(
		"should not pass if required property is not defined",
		({ context, dataset }) => {
			delete data[dataset];
			const result = context.validator.validate(getProposal, data);

			assert.defined(result.error);
		},
		["proposal", "headers"],
	);
});

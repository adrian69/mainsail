import Ajv, { AnySchemaObject, ErrorObject, FormatDefinition, KeywordDefinition, Schema } from "ajv";

export interface SchemaValidationResult<T = any> {
	value: T;
	error: any;
	errors?: ErrorObject[] | undefined;
}

export interface Validator {
	validate<T = any>(schemaKeyReference: string | Schema, data: T): SchemaValidationResult<T>;

	addFormat(name: string, format: FormatDefinition<string> | FormatDefinition<number>): void;

	addKeyword(definition: KeywordDefinition): void;

	addSchema(schema: AnySchemaObject): void;

	removeKeyword(keyword: string): void;

	removeSchema(schemaKeyReference: string): void;

	extend(callback: (ajv: Ajv) => void): void;
}

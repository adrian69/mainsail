import { filter } from "./filter";
import { FunctionReturning } from "./internal";

export const omitBy = <T extends {}>(iterable: T, iteratee: FunctionReturning): T =>
	filter(iterable, (value) => !iteratee(value)) as T;

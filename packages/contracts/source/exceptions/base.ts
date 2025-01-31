export class Exception extends Error {
	public constructor(message: string, code?: string) {
		super(message);

		Object.defineProperty(this, "message", {
			enumerable: false,
			value: code ? `${code}: ${message}` : message,
		});

		Object.defineProperty(this, "name", {
			enumerable: false,
			value: this.constructor.name,
		});

		Error.captureStackTrace(this, this.constructor);
	}
}

export class UnexpectedError extends Exception {
	public constructor(
		public readonly error: Error,
		public readonly path: string[],
	) {
		super(
			path.length > 0
				? `Unexpected error '${error.message}' (${error.constructor.name}) at '${path.join(".")}'`
				: `Unexpected error '${error.message}' (${error.constructor.name})`,
		);
	}
}

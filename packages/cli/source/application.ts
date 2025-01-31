import { interfaces } from "@mainsail/container";
import { tmpdir } from "os";
// eslint-disable-next-line unicorn/import-style
import { resolve } from "path";

import { Paths } from "./env-paths";
import { Identifiers } from "./ioc";

export class Application {
	public constructor(private readonly container: interfaces.Container) {
		this.container.bind(Identifiers.Application.Instance).toConstantValue(this);
	}

	public bind<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): interfaces.BindingToSyntax<T> {
		return this.container.bind(serviceIdentifier);
	}

	public rebind<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): interfaces.BindingToSyntax<T> {
		if (this.container.isBound(serviceIdentifier)) {
			this.container.unbind(serviceIdentifier);
		}

		return this.container.bind(serviceIdentifier);
	}

	public unbind<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): void {
		return this.container.unbind(serviceIdentifier);
	}

	public get<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T {
		return this.container.get(serviceIdentifier);
	}

	public isBound<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): boolean {
		return this.container.isBound(serviceIdentifier);
	}

	public resolve<T>(constructorFunction: interfaces.Newable<T>): T {
		return this.container.resolve(constructorFunction);
	}

	public getCorePath(type: string, file?: string): string {
		const path: string = this.get<Paths>(Identifiers.ApplicationPaths)[type];

		return resolve(file ? `${path}/${file}` : path);
	}

	public getConsolePath(type: string, file?: string): string {
		const path: string = this.get<Paths>(Identifiers.ConsolePaths)[type];

		return resolve(file ? `${path}/${file}` : path);
	}

	public dataPath(): string {
		return tmpdir();
	}
}

import { Schema } from '@produck/mold';
import { RequestListener } from 'http';

interface Meta {
	level: string;
	time: Date;
	label: string;
}

export class Logger {
	log(meta: Meta, messageObject: any): Promise<string>;
}

export type Appender = (message: string) => Promise<void> | void;
export type Format<T = any> = (meta: Meta, messageObject: T) => string;
export type Assert = (messageObject: any) => void;

export namespace Options {
	interface Options {
		strict?: boolean;
		format?: Format;
		assert?: Assert;
		appenders?: Array<Appender>
	}

	export const Schema: Schema<Options>;
	export function normalize(options: Options): Options;
}

export namespace Appender {
	export function ConsoleAppender(): Appender;
	export function StdoutAppender(): Appender;
	export function StderrAppender(): Appender;

	interface RollingFileOptions {
		pathname: string;
		size?: number;
		number?: number;
		encoding?: 'utf-8' | string;
		mode?: number;
		flags?: 'a' | string;
		keepFileExt?: boolean;
		compress?: boolean;
	}

	export function RollingFileAppender(options: RollingFileOptions): Appender;

	export {
		ConsoleAppender as Console,
		StdoutAppender as Stdout,
		StderrAppender as Stderr,
		RollingFileAppender as RollingFile,
	};
}

export namespace Format {
	export namespace General {
		export const format: Format<string>;
		export const assert: Assert;
	}

	export namespace Error {
		export const format: Format<Error>;
		export const assert: Assert;
	}

	export namespace JSON {
		export const format: Format<any>;
		export const assert: Assert;
	}

	export namespace Apache {
		type Dash = '-';

		export class LogObject {
			a(underlying?: boolean): string;
			A(): string;
			B(): number;
			b(): number | Dash;
			C(varname: string): string;
			D(): number;
			e(varname: string): string | Dash;
			f(): string;
			h(underlying?: boolean): string;
			H(): 'http' | 'https';
			i(varname: string): string | Dash;
			k(): number;
			l(): string | Dash;
			L(): string | Dash;
			m(): string;
			n(varname: string): string;
			o(varname: string): string;
			p(format: 'canonical' | 'local' | 'remote'): number;
			P(format: 'pid' | 'tid' | 'hextid'): number | string;
			q(): string;
			r(): string;
			R(): string;
			s(final?: boolean): number;
			t(format?: string): string;
			T(unit?: 'ns' | 'us' | 'ms' | 's'): string;
			u(): string | Dash;
			U(): string;
			v(): string | Dash;
			V(): string | Dash;
			x(): 'X' | '+' | '-';
			I(): number;
			O(): number;
			S(): number;
		}

		export const assert: Assert;

		export function Http11ServerLogAdapter(
			requestListener: RequestListener,
			callback: (message: LogObject) => void
		): RequestListener;

		export { Http11ServerLogAdapter as HttpAdapter }

		export namespace Preset {
			export const CLF: Format<LogObject>;
			export const Combined: Format<LogObject>;
		}
	}
}

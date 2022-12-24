export function ConsoleAppender() {
	const consoleLog = console.log.bind(console);

	return message => consoleLog(message);
}

export function StdoutAppender() {
	return message => process.stdout.write(message);
}

export function StderrAppender() {
	return message => process.stderr.write(message);
}

import os from 'node:os';
import { createRequire } from 'node:module';
import { Normalizer, P, S } from '@produck/mold';

const { RollingFileStream } = createRequire(import.meta.url)('streamroller');
const EOL = os.EOL || '\n';

const FileAppenderSchema = S.Object({
	pathname: P.String(),
	size: P.Integer(64 * 1024),
	number: P.NumberRange([1])(1),
	encoding: P.Enum(['utf-8'], 0),
	mode: P.Integer(0o600),
	flags: P.Enum(['a'], 0),
	keepFileExt: P.Boolean(false),
	compress: P.Boolean(false),
});

const normalizeFileAppenderOptions = Normalizer(FileAppenderSchema);

export function RollingFileAppender(options) {
	const {
		pathname, size, number,
		encoding, mode, flags, keepFileExt, compress,
	} = normalizeFileAppenderOptions(options);

	const stream = new RollingFileStream(pathname, size, number, {
		encoding, mode, flags, compress, keepFileExt,
	});

	return message => stream.write(message + EOL);
}

export {
	ConsoleAppender as Console,
	StdoutAppender as Stdout,
	StderrAppender as Stderr,
	RollingFileAppender as RollingFile,
};

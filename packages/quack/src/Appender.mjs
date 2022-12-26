import { EOL } from 'node:os';

export function ConsoleAppender() {
	const consoleLog = console.log.bind(console);

	return message => consoleLog(message);
}

export function StdoutAppender() {
	return message => process.stdout.write(message + EOL);
}

export function StderrAppender() {
	return message => process.stderr.write(message + EOL);
}

import Streamroller from 'streamroller';
import { Normalizer, P, S } from '@produck/mold';

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

	const stream = new Streamroller.RollingFileStream(pathname, size, number, {
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

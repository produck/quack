import { Normalizer, P, S } from '@produck/mold';

import * as Options from './Options.mjs';

const MetaSchema = S.Object({
	level: P.String(),
	time: P.Instance(Date),
	label: P.String(),
}, 'meta object');

const normalizeMeta = Normalizer(MetaSchema);

export class Logger {
	constructor(options = {}) {
		const finalOptions = Options.normalize(options);

		this.strict = finalOptions.strict;
		this.format = finalOptions.format;
		this.assert = finalOptions.assert;
		this.appenders = finalOptions.appenders;
	}

	async log(meta, messageObject) {
		if (this.strict) {
			normalizeMeta(meta);
			this.assert(messageObject);
		}

		const message = this.format(meta, messageObject);
		const append = appender => appender(message);

		await Promise.all(this.appenders.map(append));

		return message;
	}
}

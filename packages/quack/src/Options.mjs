import { Normalizer, P, S } from '@produck/mold';
import * as Format from './Preset/index.mjs';
import * as Appender from './Appender.mjs';

export const Schema = S.Object({
	strict: P.Boolean(true),
	format: P.Function(Format.General.format),
	assert: P.Function(Format.General.assert),
	appenders: S.Array({
		items: P.Function(),
	}, () => [Appender.Console()]),
});

export const normalize = Normalizer(Schema);

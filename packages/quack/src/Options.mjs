import { Normalizer, P, S } from '@produck/mold';
import * as Format from './Format/index.mjs';

export const Schema = S.Object({
	strict: P.Boolean(true),
	format: P.Function(Format.General.format),
	assert: P.Function(Format.General.assert),
	appenders: S.Array({ items: P.Function() }),
});

export const normalize = Normalizer(Schema);

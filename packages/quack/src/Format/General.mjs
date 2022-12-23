import { T, U } from '@produck/mold';

export const assert = any => {
	if (!T.Native.String(any)) {
		U.throwError('message', 'string');
	}
};

export const format = ({ time, level, label }, message) => {
	return `[${time.toISOString()}] [${level.toUpperCase()}] [${label}]: ${message}`;
};

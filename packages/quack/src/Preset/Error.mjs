import { T, U } from '@produck/mold';

export const assert = any => {
	if (!T.Helper.Error(any)) {
		U.throwError('message', 'error');
	}
};

export const format = ({ time, level, label }, error) => {
	return `[${time.toISOString()}] [${level.toUpperCase()}] [${label}]: ${error.message}`;
};

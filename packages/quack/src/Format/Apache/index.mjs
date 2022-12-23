import { U } from '@produck/mold';
import { LogObject } from './LogObject.mjs';

export const assert = any => {
	if (!(any instanceof LogObject)) {
		U.throwError('message', 'string');
	}
};

export * as Format from './Format/index.mjs';
export { Http11ServerLogAdapter as HttpAdapter } from './Adapter.mjs';

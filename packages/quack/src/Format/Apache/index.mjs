import { U } from '@produck/mold';
import { LogObject } from './LogObject.mjs';

export const assert = any => {
	if (!(any instanceof LogObject)) {
		U.throwError('message', 'string');
	}
};

export * as Preset from './Preset.mjs';

const noop = () => {};

export const Http11ServerLogAdapter = (requestListener, callback = noop) => {
	return function requestListenerWithLog(req, res) {
		const logObject = new LogObject(req, res);

		res.once('finish', () => callback(logObject));

		return requestListener(req, res);
	};
};

export { Http11ServerLogAdapter as HttpAdapter };

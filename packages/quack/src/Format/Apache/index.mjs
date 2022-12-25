import { T, U } from '@produck/mold';
import { LogObject } from './LogObject.mjs';

export const assert = any => {
	if (!(any instanceof LogObject)) {
		U.throwError('message', 'apache log object');
	}
};

export * as Preset from './Preset.mjs';

export const Http11ServerLogAdapter = (requestListener, callback) => {
	if (!T.Native.Function(callback)) {
		U.throwError('callback', 'function');
	}

	return function requestListenerWithLog(req, res) {
		const logObject = new LogObject(req, res);

		res.once('finish', () => callback(logObject));

		return requestListener(req, res);
	};
};

export {
	LogObject,
	Http11ServerLogAdapter as HttpAdapter,
};

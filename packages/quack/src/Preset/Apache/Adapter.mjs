import { LogObject } from './LogObject.mjs';

const noop = () => {};

export const Http11ServerLogAdapter = (requestListener, callback = noop) => {
	return function requestListenerWithLog(req, res) {
		const logObject = new LogObject(req, res);

		res.once('finish', () => callback(logObject));

		return requestListener(req, res);
	};
};

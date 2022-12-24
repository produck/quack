import dateFormat from 'dateformat';
import { hrtime, pid, env } from 'node:process';
import { threadId } from 'node:worker_threads';

const TIME_TAKEN = {
	ns: t => t,
	us: t => Math.trunc(t / 1000),
	ms: t => Math.trunc(t / 1000000),
	s: t => Math.trunc(t / 1000000000),
};

const PROCESS_ID = {
	pid: () => pid,
	tid: () => threadId,
	hextid: () => PROCESS_ID.tid().toString(16),
};

const TODO = () => {
	throw new Error('Not supported');
};

const OR_DASH = any => any ? any : '-';

/**
 * SEE ALSO: https://httpd.apache.org/docs/2.4/mod/mod_log_config.html#formats
 */
export class LogObject {
	constructor(req, res) {
		this.req = req;
		this.res = res;
		this.timeTaken = 0;

		const startedAt = hrtime.bigint();

		res.once('finish', () => this.timeTaken = hrtime.bigint() - startedAt);
	}

	a(underlying = false) {
		// (underlying = false):
		// Client IP address of the request.

		// (underlying = true):
		// Underlying peer IP address of the connection.

		const address = this.req.socket.remoteAddress;

		if (underlying === false) {
			return address;
		}

		return TODO();
	}

	A() {
		// Local IP-address.

		return this.req.socket.localAddress;
	}

	B() {
		// Size of response in bytes, excluding HTTP headers.

		return this.res.socket.writableLength;
	}

	b() {
		// Size of response in bytes, excluding HTTP headers. In CLF format,
		// i.e. a '-' rather than a 0 when no bytes are sent.

		return OR_DASH(this.B());
	}

	C(varname) {
		// The contents of cookie VARNAME in the request sent to the server.
		// Only version 0 cookies are fully supported.

		TODO();
	}

	D() {
		// The time taken to serve the request, in microseconds.

		return this.t('us');
	}

	e(varname) {
		// The contents of the environment variable VARNAME.

		return OR_DASH(env[varname]);
	}

	f() {
		// Filename.

		return '';
	}

	h(underlying = false) {
		// Remote hostname. Will log the IP address if HostnameLookups is set to Off,
		// which is the default. If it logs the hostname for only a few hosts,
		// you probably have access control directives mentioning them by name.
		// See https://httpd.apache.org/docs/2.4/mod/mod_authz_host.html#reqhost

		// Like %h, but always reports on the hostname of the underlying TCP connection
		// and not any modifications to the remote hostname by modules like mod_remoteip.

		const address = this.req.socket.remoteAddress;

		if (underlying === true) {
			return address;
		}

		TODO();
	}

	H() {
		// The request protocol.

		TODO();
	}

	i(varname) {
		// The contents of VARNAME: header line(s) in the request sent to the server.
		// Changes made by other modules (e.g. mod_headers) affect this. If you're
		// interested in what the request header was prior to when most modules would
		// have modified it, use mod_setenvif to copy the header into an internal
		// environment variable and log that value with the %{VARNAME}e described above.

		return OR_DASH(this.req.headers[varname.toLowerCase()]);
	}

	k() {
		// Number of keepalive requests handled on this connection. Interesting if
		// KeepAlive is being used, so that, for example, a '1' means the first
		// keepalive request after the initial one, '2' the second, etc...; otherwise
		// this is always 0 (indicating the initial request).

		return 0;
	}

	l() {
		// Remote logname (from identd, if supplied). This will return a dash unless
		// mod_ident is present and IdentityCheck is set On.

		return OR_DASH();
	}

	L() {
		// The request log ID from the error log (or '-' if nothing has been logged
		// to the error log for this request). Look for the matching error log line
		// to see what request caused what error.

		return OR_DASH();
	}

	m() {
		// The request method.

		return this.req.method;
	}

	n(varname) {
		// The contents of note VARNAME from another module.

		TODO();
	}

	o(varname) {
		// The contents of VARNAME: header line(s) in the reply.

		TODO();
	}

	p(format = 'local') {
		// (format = 'local')
		// The canonical port of the server serving the request.

		// (format = 'canonical' / 'local' / 'remote')
		// The canonical port of the server serving the request, or the server's
		// actual port, or the client's actual port. Valid formats are canonical,
		// local, or remote.

		return this.req.socket.localPort;
	}

	P(format = 'pid') {
		// (format = 'pid')
		// The process ID of the child that serviced the request.

		// (format = 'pid' / 'tid' / 'hextid')
		// The process ID or thread ID of the child that serviced the request.
		// Valid formats are pid, tid, and hextid.

		return PROCESS_ID[format]();
	}

	q() {
		// The query string (prepended with a ? if a query string exists, otherwise
		// an empty string).

		return new URL(this.req.url, 'http://a').search;
	}

	r() {
		// First line of request.

		return `${this.req.method} ${this.req.url} HTTP/${this.req.httpVersion}`;
	}

	R() {
		// The handler generating the response (if any).

		TODO();
	}

	s(final = true) {
		// Status. For requests that have been internally redirected, this is the
		// status of the original request. Use %>s for the final status.

		const code = this.res.statusCode;

		if (!final) {
			return code;
		}

		TODO();
	}

	t(format = 'dd/mmm/yyyy:HH:MM:ss o') {
		// (format = 'dd/mmm/yyyy:HH:MM:ss o')
		// Time the request was received, in the format [18/Sep/2011:19:18:28 -0400].
		// The last number indicates the timezone offset from GMT

		return dateFormat(new Date(), format);
	}

	T(unit = 's') {
		// (unit = 's')
		// The time taken to serve the request, in seconds.

		// (unit = 'ms' / 's' / 'us' / 'ns')
		// The time taken to serve the request, in a time unit given by UNIT. Valid
		// units are ms for milliseconds, us for microseconds, and s for seconds.
		// Using s gives the same result as %T without any format; using us gives
		// the same result as %D. Combining %T with a unit is available in 2.4.13
		// and later.

		return TIME_TAKEN[unit](this.timeTaken);
	}

	u() {
		// Remote user if the request was authenticated. May be bogus if return
		// status (%s) is 401 (unauthorized).

		return OR_DASH();
	}

	U() {
		// The URL path requested, not including any query string.

		return new URL(this.req.url, 'http://a').pathname;
	}

	v() {
		// The canonical ServerName of the server serving the request.

		TODO();
	}

	V() {
		// The server name according to the UseCanonicalName setting.

		TODO();
	}

	X() {
		// Connection status when response is completed:
		// X = Connection aborted before the response completed.
		// + = Connection may be kept alive after the response is sent.
		// - = Connection will be closed after the response is sent.

		TODO();
	}

	I() {
		// Bytes received, including request and headers. Cannot be zero. You need
		// to enable mod_logio to use this.

		TODO();
	}

	O() {
		// Bytes sent, including headers. May be zero in rare cases such as when a
		// request is aborted before a response is sent. You need to enable mod_logio
		// to use this.

		TODO();
	}

	S() {
		// Bytes transferred (received and sent), including request and headers,
		// cannot be zero. This is the combination of %I and %O. You need to enable
		// mod_logio to use this.

		return this.I() + this.O();
	}
}

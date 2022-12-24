export const CLF = (_meta, _) => {
	// "%h %l %u %t \"%r\" %>s %b"
	return `${_.h()} ${_.l()} ${_.u()} ${_.t()()} "${_.r()}" ${_.s()} ${_.b()}`;
};

export const Combined = (_meta, _) => {
	// %h %l %u %t "%r" %>s %b "%{Referer}i" "%{User-agent}i"
	return `${_.h()} ${_.l()} ${_.u()} ${_.t()} "${_.r()}" ${_.s()} ${_.b()}` +
		`"${_.i('Referer')}" "${_.i('User-agent')}"`;
};

export const VCLF = (_meta, _) => {
	// "%h %l %u %t \"%r\" %>s %b"
	return `${_.v()} ${_.h()} ${_.l()} ${_.u()} ${_.t()} "${_.r()}" ${_.s()} ${_.b()}`;
};

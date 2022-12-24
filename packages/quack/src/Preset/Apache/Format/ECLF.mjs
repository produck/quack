export const format = (_meta, _) => {
	// %h %l %u %t "%r" %>s %b "%{Referer}i" "%{User-agent}i"
	return `${_.h()} ${_.l()} ${_.u()} ${_.t()} "${_.r()}" ${_.s()} ${_.b()}` +
		`"${_.i('Referer')}" "${_.i('User-agent')}"`;
};

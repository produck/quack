export const format = (_meta, _) => {
	// "%h %l %u %t \"%r\" %>s %b"
	return `${_.h()} ${_.l()} ${_.u()} ${_.t()()} "${_.r()}" ${_.s()} ${_.b()}`;
};

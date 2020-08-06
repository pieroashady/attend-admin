export const handleConvert = (key) => {
	switch (key) {
		case 0:
			return 'Rejected';
		case 1:
			return 'Approved';
		case 3:
			return 'All';
		default:
			break;
	}
};

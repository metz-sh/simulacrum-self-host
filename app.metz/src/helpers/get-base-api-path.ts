export function getBaseAPIPath() {
	const path = process.env.NEXT_PUBLIC_BASE_API_PATH;
	if (!path) {
		throw new Error('base api path not set!');
	}
	return path;
}

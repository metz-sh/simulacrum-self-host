export class AuthenticationError extends Error {
	constructor(message?: string) {
		super();
		if (message) {
			this.message = message;
		}
	}
}

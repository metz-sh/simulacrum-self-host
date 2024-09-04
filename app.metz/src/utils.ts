export function parseTextToSlug(text: string) {
	return text.replaceAll(' ', '_').toLowerCase();
}

export function parseSlugToText(slug: string) {
	//Copied from ChatGPT
	const words = slug.split('_');
	const titleWords = words.map(
		(word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
	);
	return titleWords.join(' ');
}

export async function postJSON<T extends Record<string, any>>(url: string, data: T) {
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	const result = await response.json();
	return result;
}

export async function sendDeleteRequest<T extends Record<string, any>>(url: string) {
	const response = await fetch(url, {
		method: 'DELETE',
	});

	const result = await response.json();
	return result;
}

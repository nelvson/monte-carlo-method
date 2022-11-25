const BASE_API = 'http://localhost:4000';

type Request = {
	requestInit?: RequestInit;
	body?: ObjectKey;
	token?: string,
};

const fetchAPI = async (path: string, request: Request = {}) => {
	let { requestInit, body } = request;
	let url = `${BASE_API}${path}`;

	let response = await fetch(url, {
		...requestInit,
		body: body && JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json',
		}
	});

	if (!response.ok || response.status % 100 === 4) {
		// TODO: properly handle status response 4xx
		throw await response.json()
	}
	if (response.headers.get('Content-Type')?.includes('application/json')) {
		return response.json();
	}
	return response;
};

export default fetchAPI;
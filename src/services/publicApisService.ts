import { PublicApisResponse } from '../models/PublicApisResponse';

const BASE_URL = 'https://api.publicapis.org';

export const fetchApis = async (title?: string, signal?: AbortSignal) => {
	const filters = !title ? '' : `?title=${title}`;

	const resp = await fetch(`${BASE_URL}/entries${filters}`, {
		signal,
	});

	return (await resp.json()) as PublicApisResponse;
};

export default function appendUrlQuery<T>(baseUrl: string, queries: Record<string, T>) {
	let ret = baseUrl
	Object.keys(queries).forEach((key, idx) => ret += (`${idx === 0 ? '?' : '&'}${key}=${queries[key]}`))

	return ret;
}
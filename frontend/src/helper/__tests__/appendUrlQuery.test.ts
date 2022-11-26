import appendUrlQuery from "../appendUrlQuery";

describe('appendUrlQuery', () => {
	it('should append url /foobar?john=123', () => {
		let url = '/foobar';
		let query = {john: 123};

		let res = appendUrlQuery(url, query);

		expect(res).toEqual('/foobar?john=123');
	});
});

export type OpenProjectElement = {
	id: number;
	identifier: string;
	name: string;
	active?: boolean;
	[key: string]: unknown;
};

export type OpenProjectCollection = {
	total: number;
	count: number;
	pageSize: number;
	offset: number;
	_embedded?: {
		elements?: OpenProjectElement[];
	};
};
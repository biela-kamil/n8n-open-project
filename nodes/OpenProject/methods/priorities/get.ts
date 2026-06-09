import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { openProjectRequest } from '../../utils/request';
import type { OpenProjectStatusesCollection } from '../../utils/types';

export async function searchPriorities(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const response = (await openProjectRequest.call(
		this,
		'GET',
		'/priorities',
	)) as OpenProjectStatusesCollection;

	const elements = response._embedded?.elements ?? [];

	let results: INodeListSearchItems[] = elements.map((el) => ({
		name: el.name,
		value: el.id,
	}));

	if (filter) {
		const lower = filter.toLowerCase();
		results = results.filter((el) => el.name.toLowerCase().includes(lower));
	}

	return { results };
}

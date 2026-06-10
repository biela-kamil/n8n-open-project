import type {
	IDataObject,
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { openProjectRequest } from '../../utils/request';
import { OpenProjectCollection, OpenProjectProject } from '../../utils/types';
import { buildProjectFilters } from '../../utils/filters';

export async function getProjects(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	const page = paginationToken ? +paginationToken : 1;
	const pageSize = 100;

	const qs: IDataObject = { offset: page, pageSize };
	const filters = buildProjectFilters({ nameAndIdentifier: filter });
	if (filters) {
		qs.filters = filters;
	}

	const response = (await openProjectRequest.call(
		this,
		'GET',
		'/projects',
		qs,
	)) as OpenProjectCollection<OpenProjectProject>;
	const elements = response._embedded?.elements ?? [];

	const results: INodeListSearchItems[] = elements.map((el) => ({
		name: el.name,
		value: el.id,
	}));

	const nextPaginationToken = page * pageSize < response.total ? page + 1 : undefined;
	return { results, paginationToken: nextPaginationToken };
}

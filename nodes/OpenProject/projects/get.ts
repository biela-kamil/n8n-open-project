import type {
	IDataObject,
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from "n8n-workflow";
import { openProjectRequest } from "../utils/request";
import type { OpenProjectCollection } from "../utils/types";

export async function getProjects(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	const page = paginationToken ? +paginationToken : 1;
	const pageSize = 100;

	const qs: IDataObject = { offset: page, pageSize };
	if (filter) {
		qs.filters = JSON.stringify([
			{ name_and_identifier: { operator: '~', values: [filter] } },
		]);
	}

	const response = (await openProjectRequest.call(
		this,
		'GET',
		'/projects',
		qs,
	)) as OpenProjectCollection;
	const elements = response._embedded?.elements ?? [];

	const results: INodeListSearchItems[] = elements.map((el) => ({
		name: el.name,
		value: el.id,
	}));

	const nextPaginationToken = page * pageSize < response.total ? page + 1 : undefined;
	return { results, paginationToken: nextPaginationToken };
}
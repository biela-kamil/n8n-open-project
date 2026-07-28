import {
	type IDataObject,
	ILoadOptionsFunctions,
	type INodeListSearchItems,
	type INodeListSearchResult,
} from 'n8n-workflow';
import { openProjectRequest } from '../../utils/request';
import { OpenProjectUsersCollection } from '../../utils/types';

export async function getUsers(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	const page = paginationToken ? +paginationToken : 1;
	const pageSize = 100;

	const qs: IDataObject = { offset: page, pageSize };
	const response = (await openProjectRequest.call(
		this,
		'GET',
		`/users`,
		qs,
	)) as OpenProjectUsersCollection;

	const elements = response._embedded?.elements ?? [];

	const results: INodeListSearchItems[] = elements.map((el) => ({
		name: el.name,
		value: el.id,
	}));

	const nextPaginationToken =
		page * pageSize < response.total ? String(page + 1) : undefined;
	return { results, paginationToken: nextPaginationToken };
}

import type { IDataObject, IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
import { openProjectRequest } from "../../utils/request";
import type { OpenProjectCollection, OpenProjectElement } from "../../utils/types";

function buildFilters(filters: IDataObject): string | undefined {
	const filterArray: IDataObject[] = [];

	if (filters.active && filters.active !== 'any') {
		filterArray.push({
			active: { operator: '=', values: [filters.active === 'active' ? 't' : 'f'] },
		});
	}

	if (filters.nameAndIdentifier) {
		filterArray.push({
			name_and_identifier: { operator: '~', values: [filters.nameAndIdentifier as string] },
		});
	}

	return filterArray.length > 0 ? JSON.stringify(filterArray) : undefined;
}

export async function getAll(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', itemIndex, false) as boolean;
	const limit = returnAll
		? Number.POSITIVE_INFINITY
		: (this.getNodeParameter('limit', itemIndex, 50) as number);

	const filters = buildFilters(this.getNodeParameter('filters', itemIndex, {}) as IDataObject);
	const pageSize = 100;
	let offset = 1;

	const collected: OpenProjectElement[] = [];

	while (collected.length < limit) {
		const qs: IDataObject = { offset, pageSize };
		if (filters) {
			qs.filters = filters;
		}

		const response = (await openProjectRequest.call(
			this,
			'GET',
			'/projects',
			qs,
		)) as OpenProjectCollection;
		const elements = response._embedded?.elements ?? [];
		collected.push(...elements);

		if (elements.length === 0 || collected.length >= response.total) {
			break;
		}
		offset += 1;
	}

	const limited = returnAll ? collected : collected.slice(0, limit);
	return limited.map((element) => ({ json: element as IDataObject }));
}
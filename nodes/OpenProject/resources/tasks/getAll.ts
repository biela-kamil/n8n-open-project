import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { openProjectRequest } from '../../utils/request';
import { OpenProjectCollection, OpenProjectTask } from '../../utils/types';
import { buildTaskFilters, type TaskFilterInput } from '../../utils/filters';
import { parseTask } from '../../utils/task';

export async function getTasks(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', itemIndex, false);
	const limit = returnAll
		? Number.POSITIVE_INFINITY
		: this.getNodeParameter('limit', itemIndex, 50);
	const collected: OpenProjectTask[] = [];

	const project = this.getNodeParameter('project', itemIndex, undefined, {
		extractValue: true,
	}) as string;

	const filters = this.getNodeParameter('filters', itemIndex, {}) as TaskFilterInput;

	const filterString = buildTaskFilters(filters);

	const sortBy = this.getNodeParameter('sortBy', itemIndex, '') as string;
	const sortOrder = this.getNodeParameter('sortOrder', itemIndex, 'asc') as string;
	const sortByString = sortBy ? JSON.stringify([[sortBy, sortOrder]]) : undefined;

	const pageSize = returnAll ? 100 : Math.min(100, limit);
	let offset = 1;

	while (collected.length < limit) {
		const qs: IDataObject = { offset, pageSize };
		if (filterString) {
			qs.filters = filterString;
		}
		if (sortByString) {
			qs.sortBy = sortByString;
		}

		const response = (await openProjectRequest.call(
			this,
			'GET',
			`/projects/${project}/work_packages`,
			qs,
		)) as OpenProjectCollection<OpenProjectTask>;

		const elements = response._embedded?.elements ?? [];
		collected.push(...elements);

		if (elements.length === 0 || collected.length >= response.total) {
			break;
		}
		offset += 1;
	}

	const limited = returnAll ? collected : collected.slice(0, limit);

	return limited.map((element) => ({
		json: parseTask(element),
	}));
}

import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { openProjectRequest } from '../../utils/request';
import { OpenProjectCollection, OpenProjectTask } from '../../utils/types';
import { buildTaskFilters, type TaskFilterInput } from '../../utils/filters';

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

	const qs: IDataObject = {};
	const filterString = buildTaskFilters(filters);
	if (filterString) {
		qs.filters = filterString;
	}

	const response = (await openProjectRequest.call(
		this,
		'GET',
		`/projects/${project}/work_packages`,
		qs,
	)) as OpenProjectCollection<OpenProjectTask>;

	const elements = response._embedded?.elements ?? [];
	collected.push(...elements);

	const limited = returnAll ? collected : collected.slice(0, limit);

	return limited.map((element) => ({
		json: {
			id: element.id,
			subject: element.subject,
			description: element.description.raw,
			project: element['_links'].project.title,
			type: element['_links'].type.title,
			priority: element['_links'].priority.title,
			status: element['_links'].status.title,
			author: element['_links'].author.title,
		},
	}));
}

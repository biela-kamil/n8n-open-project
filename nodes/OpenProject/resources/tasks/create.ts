import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { openProjectRequest } from '../../utils/request';
import { parseTask } from '../../utils/task';
import { OpenProjectTask } from '../../utils/types';

export async function createTask(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const subject = this.getNodeParameter('subject', itemIndex) as string;
	const type = this.getNodeParameter('type', itemIndex, undefined, {
		extractValue: true,
	}) as string;

	const project = this.getNodeParameter('project', itemIndex, undefined, {
		extractValue: true,
	}) as string;

	const priority = this.getNodeParameter('priority', itemIndex, undefined, {
		extractValue: true,
	}) as string;

	const description = this.getNodeParameter('taskDescription', itemIndex, '');

	const parentTaskId = this.getNodeParameter('parentTaskId', itemIndex, null) as string | null;

	const links: IDataObject = {
		project: { href: `/api/v3/projects/${project}` },
		type: { href: `/api/v3/types/${type}` },
		priority: { href: `/api/v3/priorities/${priority}` },
	};

	if (parentTaskId) {
		links.parent = { href: `/api/v3/work_packages/${parentTaskId}` };
	}

	const data = {
		subject,
		_links: links,
		description: {
			format: 'markdown',
			raw: description,
		},
	};
	const response = (await openProjectRequest.call(
		this,
		'POST',
		'/work_packages',
		{},
		data,
	)) as OpenProjectTask;

	const task = parseTask(response);

	return [
		{
			json: task,
		},
	];
}

import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { openProjectRequest } from '../../utils/request';
import { parseTask } from '../../utils/task';
import { OpenProjectTask } from '../../utils/types';

export async function updateTask(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const id = this.getNodeParameter('id', itemIndex) as string;
	const subject = this.getNodeParameter('updateSubject', itemIndex, '') as string;
	const description = this.getNodeParameter('updateDescription', itemIndex, '') as string;
	const status = this.getNodeParameter('updateStatus', itemIndex, '', {
		extractValue: true,
	}) as string;
	const priority = this.getNodeParameter('priority', itemIndex, undefined, {
		extractValue: true,
	}) as string;

	const current = (await openProjectRequest.call(
		this,
		'GET',
		`/work_packages/${id}`,
		{},
		{},
	)) as OpenProjectTask;
	const lockVersion = current.lockVersion;

	const links: IDataObject = {};
	const body: IDataObject = { lockVersion, _links: links };

	if (subject !== '') {
		body.subject = subject;
	}

	if (description !== '') {
		body.description = {
			format: 'markdown',
			raw: description,
		};
	}

	const parentTaskId = this.getNodeParameter('parentTaskId', itemIndex, null) as string | null;

	if (parentTaskId) {
		links.parent = { href: `/api/v3/work_packages/${parentTaskId}` };
	}

	if (status !== '') {
		links.status = { href: `/api/v3/statuses/${status}` };
	}

	if (priority !== '') {
		links.priority = { href: `/api/v3/priorities/${priority}` };
	}

	const response = (await openProjectRequest.call(
		this,
		'PATCH',
		`/work_packages/${id}`,
		{},
		body,
	)) as OpenProjectTask;

	const task = parseTask(response);

	return [
		{
			json: task,
		},
	];
}

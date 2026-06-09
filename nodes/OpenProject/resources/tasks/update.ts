import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { openProjectRequest } from '../../utils/request';

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

	const current = await openProjectRequest.call(this, 'GET', `/work_packages/${id}`, {}, {});
	const lockVersion = current.lockVersion;

	const body: IDataObject = { lockVersion };

	if (subject !== '') {
		body.subject = subject;
	}

	if (description !== '') {
		body.description = {
			format: 'markdown',
			raw: description,
		};
	}

	if (status !== '') {
		body._links = {
			status: { href: `/api/v3/statuses/${status}` },
		};
	}

	if (priority !== '') {
		body._links = {
			priority: { href: `/api/v3/priorities/${priority}` },
		};
	}

	const response = await openProjectRequest.call(this, 'PATCH', `/work_packages/${id}`, {}, body);

	const json = {
		id: response.id,
		subject: response.subject,
		description: response.description.raw,
		project: response['_links'].project.title,
		type: response['_links'].type.title,
		priority: response['_links'].priority.title,
		status: response['_links'].status.title,
		author: response['_links'].author.title,
	};

	return [
		{
			json,
		},
	];
}

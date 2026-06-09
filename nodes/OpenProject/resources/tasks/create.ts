import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { openProjectRequest } from '../../utils/request';

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

	const description = this.getNodeParameter('taskDescription', itemIndex, '');

	const response = await openProjectRequest.call(
		this,
		'POST',
		'/work_packages',
		{},
		{
			subject,
			_links: {
				project: { href: `/api/v3/projects/${project}` },
				type: { href: `/api/v3/types/${type}` },
			},
			description: {
				format: 'markdown',
				raw: description,
			},
		},
	);

	return [
		{
			json: response as IDataObject,
		},
	];
}

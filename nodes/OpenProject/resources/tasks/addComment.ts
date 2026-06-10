import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { openProjectRequest } from '../../utils/request';

export async function addComment(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const id = this.getNodeParameter('id', itemIndex) as string;
	const description = this.getNodeParameter('taskDescription', itemIndex, '');

	const response = await openProjectRequest.call(
		this,
		'POST',
		`/work_packages/${id}/activities`,
		{},
		{
			comment: {
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

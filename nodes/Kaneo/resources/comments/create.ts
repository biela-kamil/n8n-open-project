import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { kaneoRequest } from '../../utils/request';
import { KaneoActivity } from '../../utils/types';

export async function createComment(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const taskId = this.getNodeParameter('taskId', itemIndex) as string;
	const content = this.getNodeParameter('content', itemIndex) as string;

	// Write endpoints return the activity row (no author object) rather than the comment shape
	const activity = (await kaneoRequest.call(
		this,
		'POST',
		`comment/${taskId}`,
		{},
		{ content },
	)) as KaneoActivity;

	return [
		{
			json: activity as unknown as IDataObject,
			pairedItem: { item: itemIndex },
		},
	];
}

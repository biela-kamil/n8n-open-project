import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { kaneoRequest } from '../../utils/request';
import { KaneoActivity } from '../../utils/types';

export async function updateComment(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const commentId = this.getNodeParameter('commentId', itemIndex) as string;
	const content = this.getNodeParameter('content', itemIndex) as string;

	const activity = (await kaneoRequest.call(
		this,
		'PUT',
		`comment/${commentId}`,
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

import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { kaneoRequest } from '../../utils/request';
import { KaneoComment } from '../../utils/types';

export async function getComments(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const taskId = this.getNodeParameter('taskId', itemIndex) as string;
	const comments = (await kaneoRequest.call(
		this,
		'GET',
		`comment/${taskId}`,
	)) as KaneoComment[];

	return comments.map((comment) => ({
		json: comment as unknown as IDataObject,
		pairedItem: { item: itemIndex },
	}));
}

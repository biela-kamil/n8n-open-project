import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { kaneoRequest } from '../../utils/request';
import { KaneoTask } from '../../utils/types';

export async function getTask(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const taskId = this.getNodeParameter('taskId', itemIndex) as string;
	const task = (await kaneoRequest.call(this, 'GET', `task/${taskId}`)) as KaneoTask;

	return [
		{
			json: task as unknown as IDataObject,
			pairedItem: { item: itemIndex },
		},
	];
}

import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { kaneoRequest } from '../../utils/request';
import { KaneoTask } from '../../utils/types';

export async function deleteTask(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const taskId = this.getNodeParameter('taskId', itemIndex) as string;
	// The API returns the deleted task (comments, labels and time entries are removed with it)
	const task = (await kaneoRequest.call(this, 'DELETE', `task/${taskId}`)) as KaneoTask;

	return [
		{
			json: task as unknown as IDataObject,
			pairedItem: { item: itemIndex },
		},
	];
}

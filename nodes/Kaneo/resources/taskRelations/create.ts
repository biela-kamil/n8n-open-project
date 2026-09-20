import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { kaneoRequest } from '../../utils/request';
import { KaneoTaskRelation } from '../../utils/types';

export async function createTaskRelation(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const sourceTaskId = this.getNodeParameter('taskId', itemIndex) as string;
	const targetTaskId = this.getNodeParameter('targetTaskId', itemIndex) as string;
	const relationType = this.getNodeParameter('relationType', itemIndex) as string;

	const relation = (await kaneoRequest.call(
		this,
		'POST',
		'task-relation',
		{},
		{ sourceTaskId, targetTaskId, relationType },
	)) as KaneoTaskRelation;

	return [
		{
			json: relation as unknown as IDataObject,
			pairedItem: { item: itemIndex },
		},
	];
}

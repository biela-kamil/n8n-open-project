import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { kaneoRequest } from '../../utils/request';
import { KaneoTaskRelationWithTasks } from '../../utils/types';

export async function getTaskRelations(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const taskId = this.getNodeParameter('taskId', itemIndex) as string;
	const relations = (await kaneoRequest.call(
		this,
		'GET',
		`task-relation/${taskId}`,
	)) as KaneoTaskRelationWithTasks[];

	return relations.map((relation) => ({
		json: relation as unknown as IDataObject,
		pairedItem: { item: itemIndex },
	}));
}

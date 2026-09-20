import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { kaneoRequest } from '../../utils/request';
import { KaneoTaskRelation } from '../../utils/types';

export async function deleteTaskRelation(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const relationId = this.getNodeParameter('relationId', itemIndex) as string;
	const relation = (await kaneoRequest.call(
		this,
		'DELETE',
		`task-relation/${relationId}`,
	)) as KaneoTaskRelation;

	return [
		{
			json: relation as unknown as IDataObject,
			pairedItem: { item: itemIndex },
		},
	];
}

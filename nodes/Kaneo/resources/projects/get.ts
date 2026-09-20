import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { kaneoRequest } from '../../utils/request';
import { KaneoProjectDetail } from '../../utils/types';

export async function getProject(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const projectId = this.getNodeParameter('projectId', itemIndex, '', {
		extractValue: true,
	}) as string;
	const project = (await kaneoRequest.call(
		this,
		'GET',
		`project/${projectId}`,
	)) as KaneoProjectDetail;

	return [
		{
			json: project as unknown as IDataObject,
			pairedItem: { item: itemIndex },
		},
	];
}

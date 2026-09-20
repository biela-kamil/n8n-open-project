import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { kaneoRequest } from '../../utils/request';
import { KaneoColumn } from '../../utils/types';

export async function getStatuses(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const projectId = this.getNodeParameter('projectId', itemIndex, '', {
		extractValue: true,
	}) as string;
	const columns = (await kaneoRequest.call(this, 'GET', `column/${projectId}`)) as KaneoColumn[];

	return columns.map((column) => ({
		json: column as unknown as IDataObject,
		pairedItem: { item: itemIndex },
	}));
}

import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { kaneoRequest } from '../../utils/request';
import { KaneoLabel } from '../../utils/types';

export async function getLabel(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const labelId = this.getNodeParameter('labelId', itemIndex) as string;
	const label = (await kaneoRequest.call(this, 'GET', `label/${labelId}`)) as KaneoLabel;

	return [
		{
			json: label as unknown as IDataObject,
			pairedItem: { item: itemIndex },
		},
	];
}

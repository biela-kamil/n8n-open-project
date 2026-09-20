import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { kaneoRequest } from '../../utils/request';
import { KaneoLabel } from '../../utils/types';

export async function updateLabel(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const labelId = this.getNodeParameter('labelId', itemIndex) as string;
	const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

	// PUT /label/{id} requires both name and color, so fill the missing one from the current label
	const existing = (await kaneoRequest.call(this, 'GET', `label/${labelId}`)) as KaneoLabel;
	const body: IDataObject = {
		name: updateFields.name || existing.name,
		color: updateFields.color || existing.color,
	};

	const label = (await kaneoRequest.call(
		this,
		'PUT',
		`label/${labelId}`,
		{},
		body,
	)) as KaneoLabel;

	return [
		{
			json: label as unknown as IDataObject,
			pairedItem: { item: itemIndex },
		},
	];
}

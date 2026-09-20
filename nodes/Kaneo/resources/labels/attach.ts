import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { kaneoRequest } from '../../utils/request';
import { KaneoLabel } from '../../utils/types';

export async function attachLabel(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const labelId = this.getNodeParameter('labelId', itemIndex) as string;
	const taskId = this.getNodeParameter('taskId', itemIndex) as string;

	// Attaching a workspace-level label creates a per-task copy; the returned label is that copy
	// (with its own ID), which is what Detach expects
	const label = (await kaneoRequest.call(
		this,
		'PUT',
		`label/${labelId}/task`,
		{},
		{ taskId },
	)) as KaneoLabel;

	return [
		{
			json: label as unknown as IDataObject,
			pairedItem: { item: itemIndex },
		},
	];
}

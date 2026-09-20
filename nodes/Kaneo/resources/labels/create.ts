import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { kaneoRequest } from '../../utils/request';
import { KaneoLabel } from '../../utils/types';

export async function createLabel(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const { workspaceId } = await this.getCredentials('kaneoApi');
	const name = this.getNodeParameter('name', itemIndex) as string;
	const color = this.getNodeParameter('color', itemIndex) as string;
	const taskId = this.getNodeParameter('taskId', itemIndex, '') as string;

	// With taskId the label is created directly on that task; without it, it is a workspace-level label
	const body: IDataObject = { name, color, workspaceId };
	if (taskId !== '') {
		body.taskId = taskId;
	}

	const label = (await kaneoRequest.call(this, 'POST', 'label', {}, body)) as KaneoLabel;

	return [
		{
			json: label as unknown as IDataObject,
			pairedItem: { item: itemIndex },
		},
	];
}

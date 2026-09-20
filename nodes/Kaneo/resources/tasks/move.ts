import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { kaneoRequest } from '../../utils/request';
import { KaneoMoveTaskResponse } from '../../utils/types';

export async function moveTask(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const taskId = this.getNodeParameter('taskId', itemIndex) as string;
	const destinationProjectId = this.getNodeParameter('projectId', itemIndex, '', {
		extractValue: true,
	}) as string;
	const destinationStatus = this.getNodeParameter('destinationStatus', itemIndex, '') as string;

	// destinationStatus defaults to the destination project's first column when omitted
	const body: IDataObject = { destinationProjectId };
	if (destinationStatus !== '') {
		body.destinationStatus = destinationStatus;
	}

	const { task, sourceProjectId } = (await kaneoRequest.call(
		this,
		'PUT',
		`task/move/${taskId}`,
		{},
		body,
	)) as KaneoMoveTaskResponse;

	return [
		{
			json: { ...(task as unknown as IDataObject), sourceProjectId },
			pairedItem: { item: itemIndex },
		},
	];
}

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { openProjectRequest } from '../../utils/request';
import type { OpenProjectStatus } from '../../utils/types';

export async function getStatusesByTaskId(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const id = this.getNodeParameter('id', itemIndex) as string;

	const response = await openProjectRequest.call(this, 'POST', `/work_packages/${id}/form`, {}, {});

	const statuses = response['_embedded'].schema.status['_embedded'].allowedValues.map(
		(status: OpenProjectStatus) => ({
			id: status.id,
			name: status.name,
		}),
	);

	return [
		{
			json: statuses,
		},
	];
}

import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { kaneoRequest } from '../../utils/request';
import { KaneoLabel } from '../../utils/types';

export async function getLabels(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const scope = this.getNodeParameter('scope', itemIndex) as 'workspace' | 'task';

	let labels: KaneoLabel[];
	if (scope === 'task') {
		const taskId = this.getNodeParameter('taskId', itemIndex) as string;
		labels = (await kaneoRequest.call(this, 'GET', `label/task/${taskId}`)) as KaneoLabel[];
	} else {
		const { workspaceId } = await this.getCredentials('kaneoApi');
		const { unassignedOnly } = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
		labels = (await kaneoRequest.call(
			this,
			'GET',
			`label/workspace/${workspaceId}`,
		)) as KaneoLabel[];
		// The workspace endpoint also returns the per-task copies created on attach; the
		// workspace-level definitions are the rows without a taskId
		if (unassignedOnly) {
			labels = labels.filter((label) => label.taskId === null);
		}
	}

	return labels.map((label) => ({
		json: label as unknown as IDataObject,
		pairedItem: { item: itemIndex },
	}));
}

import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { kaneoRequest } from '../../utils/request';
import { KaneoSearchResponse } from '../../utils/types';

export async function search(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const { workspaceId } = await this.getCredentials('kaneoApi');
	const query = this.getNodeParameter('query', itemIndex) as string;
	const type = this.getNodeParameter('type', itemIndex, 'all') as string;
	const limit = this.getNodeParameter('limit', itemIndex, 50) as number;
	const projectId = this.getNodeParameter('projectId', itemIndex, '', {
		extractValue: true,
	}) as string;

	const qs: IDataObject = { q: query, type, workspaceId, limit };
	if (projectId !== '') {
		qs.projectId = projectId;
	}

	const response = (await kaneoRequest.call(this, 'GET', 'search', qs)) as KaneoSearchResponse;

	// totalCount is repeated on every item so a caller can tell that more matches exist beyond the limit
	return response.results.map((result) => ({
		json: { ...(result as unknown as IDataObject), totalCount: response.totalCount },
		pairedItem: { item: itemIndex },
	}));
}

import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { kaneoRequest } from '../../utils/request';
import { KaneoProject } from '../../utils/types';

export async function getProjects(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const { workspaceId } = await this.getCredentials('kaneoApi');
	const projects = (await kaneoRequest.call(this, 'GET', 'project', {
		workspaceId,
	})) as KaneoProject[];

	return projects.map((project) => ({
		json: project as unknown as IDataObject,
		pairedItem: { item: itemIndex },
	}));
}

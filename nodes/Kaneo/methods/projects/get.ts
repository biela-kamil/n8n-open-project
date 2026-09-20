import type { ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';
import { kaneoRequest } from '../../utils/request';
import { KaneoProject } from '../../utils/types';

export async function getProjects(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const { workspaceId } = await this.getCredentials('kaneoApi');
	const response = (await kaneoRequest.call(this, 'GET', 'project', {
		workspaceId,
	})) as KaneoProject[];
	const needle = filter?.toLowerCase();
	const projects = response
		.filter((project) => !needle || project.name.toLowerCase().includes(needle))
		.map((project) => ({
			name: project.name,
			value: project.id,
		}));

	return { results: projects };
}

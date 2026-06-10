import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { openProjectRequest } from '../../utils/request';
import { OpenProjectPrioritiesCollection, OpenProjectPriority } from '../../utils/types';

export async function getPriorities(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const response = (await openProjectRequest.call(
		this,
		'GET',
		`/priorities`,
	)) as OpenProjectPrioritiesCollection;
	const elements: OpenProjectPriority[] = response._embedded?.elements ?? [];

	return elements.map((element) => ({
		json: {
			id: element.id,
			name: element.name,
			position: element.position,
		},
	}));
}

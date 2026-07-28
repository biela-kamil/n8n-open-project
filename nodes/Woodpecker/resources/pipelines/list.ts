import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { woodpeckerRequest } from '../../utils/request';

function parsePipeline(pipeline: IDataObject): IDataObject {
	return {
		id: pipeline.id,
		status: pipeline.status,
		created: pipeline.created,
		started: pipeline.started,
		finished: pipeline.finished,
		commit: pipeline.commit,
		branch: pipeline.branch,
		message: pipeline.message,
	};
}

export async function listRepositories(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const limit = this.getNodeParameter('limit', itemIndex, 50) as number;
	const repo_id = this.getNodeParameter('repo_id', itemIndex, null) as string;

	if (!repo_id) {
		throw new Error('No repository found.');
	}

	const collected: IDataObject[] = [];
	let page = 1;

	while (collected.length < limit) {
		const response = (await woodpeckerRequest.call(this, 'GET', `/repos/${repo_id}/pipelines`, {
			page,
		})) as IDataObject[];

		if (response.length === 0) {
			break;
		}

		const data = response.map((pipeline) => parsePipeline(pipeline));

		collected.push(...data);
		page += 1;
	}

	return collected.slice(0, limit).map((element) => ({ json: element }));
}

import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { woodpeckerRequest } from '../../utils/request';

export async function getPipeline(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const repo_id = this.getNodeParameter('repo_id', itemIndex, null) as string;
	const pipeline_number = this.getNodeParameter('pipeline_number', itemIndex, null) as string;

	if (!repo_id) {
		throw new Error('No repository found.');
	}

	if (!pipeline_number) {
		throw new Error('No pipeline number found.');
	}

	const pipeline = (await woodpeckerRequest.call(
		this,
		'GET',
		`/repos/${repo_id}/pipelines/${pipeline_number}`,
		{},
	)) as IDataObject & { workflows: (IDataObject & { children: IDataObject[] })[] };

	return [
		{
			json: {
				id: pipeline.id,
				status: pipeline.status,
				created: pipeline.created,
				started: pipeline.started,
				finished: pipeline.finished,
				commit: pipeline.commit,
				branch: pipeline.branch,
				message: pipeline.message,
				workflows: pipeline.workflows?.map((workflow) => ({
					id: workflow.id,
					name: workflow.name,
					state: workflow.state,
					started: workflow.started,
					finished: workflow.finished,
					steps: workflow.children?.map((step) => ({
						step_id: step.id,
						name: step.name,
						state: step.state,
						started: step.started,
						finished: step.finished,
						type: step.type,
					})),
				})),
			},
		},
	];
}

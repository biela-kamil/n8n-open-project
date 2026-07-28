import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { woodpeckerRequest } from '../../utils/request';

function parseLogEntry(entry: IDataObject): IDataObject {
	const data = entry.data as string | undefined;

	return {
		step_id: entry.step_id,
		time: entry.time,
		line: entry.line,
		type: entry.type,
		message: data ? Buffer.from(data, 'base64').toString('utf8') : undefined,
	};
}

export async function getPipelineStepLog(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const repo_id = this.getNodeParameter('repo_id', itemIndex, null) as string;
	const pipeline_number = this.getNodeParameter('pipeline_number', itemIndex, null) as string;
	const step_id = this.getNodeParameter('step_id', itemIndex, null) as string;

	if (!repo_id) {
		throw new Error('No repository found.');
	}

	if (!pipeline_number) {
		throw new Error('No pipeline number found.');
	}

	if (!step_id) {
		throw new Error('No step ID found.');
	}

	const log = (await woodpeckerRequest.call(
		this,
		'GET',
		`/repos/${repo_id}/logs/${pipeline_number}/${step_id}`,
		{},
	)) as IDataObject[];

	return log.map((entry) => ({ json: parseLogEntry(entry) }));
}
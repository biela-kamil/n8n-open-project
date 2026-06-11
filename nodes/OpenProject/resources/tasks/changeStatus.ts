import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { openProjectRequest } from '../../utils/request';
import { parseTask } from '../../utils/task';
import { OpenProjectTask } from '../../utils/types';

export async function changeTaskStatus(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const id = this.getNodeParameter('id', itemIndex) as string;
	const status = this.getNodeParameter('updateStatus', itemIndex, '', {
		extractValue: true,
	}) as string;
	const comment = this.getNodeParameter('taskDescription', itemIndex, '') as string;

	const current = (await openProjectRequest.call(
		this,
		'GET',
		`/work_packages/${id}`,
		{},
		{},
	)) as OpenProjectTask;

	const body: IDataObject = {
		lockVersion: current.lockVersion,
		_links: {
			status: { href: `/api/v3/statuses/${status}` },
		},
	};

	const response = (await openProjectRequest.call(
		this,
		'PATCH',
		`/work_packages/${id}`,
		{},
		body,
	)) as OpenProjectTask;

	// Comments are a separate entity in OpenProject and cannot be set via the work
	// package PATCH (the `comment` field there is ignored). Post it to the activities
	// endpoint right after the status change so both land in the same activity entry
	// (OpenProject aggregates same-user journal entries within a short time window).
	if (comment !== '') {
		await openProjectRequest.call(this, 'POST', `/work_packages/${id}/activities`, {}, {
			comment: { raw: comment },
		});
	}

	return [
		{
			json: parseTask(response),
		},
	];
}

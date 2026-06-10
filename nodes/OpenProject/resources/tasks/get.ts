import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { openProjectRequest } from '../../utils/request';
import { OpenProjectActivitiesCollection, OpenProjectTask } from '../../utils/types';
import { parseTask } from '../../utils/task';

export async function getTaskById(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const id = this.getNodeParameter('id', itemIndex) as string;

	const [taskData, resActivities] = (await Promise.all([
		openProjectRequest.call(this, 'GET', `/work_packages/${id}`, {}),
		openProjectRequest.call(this, 'GET', `/work_packages/${id}/activities`, {}),
	])) as [OpenProjectTask, OpenProjectActivitiesCollection];

	const comments = (resActivities._embedded?.elements ?? [])
		.filter((com) => com['_type'] === 'Activity::Comment')
		.map((comment) => ({
			id: comment.id,
			createdAt: comment.createdAt,
			content: comment.comment.raw,
		}));

	const task = parseTask(taskData);

	return [
		{
			json: {
				task,
				comments: comments,
			},
		},
	];
}

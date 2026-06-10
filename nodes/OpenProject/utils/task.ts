import { OpenProjectTask } from './types';
import { IDataObject } from 'n8n-workflow';

export function parseTask(taskData: OpenProjectTask): IDataObject {
	const parentTaskData = taskData['_embedded']?.parent || null;

	const parentTask = parentTaskData ? parseTask(parentTaskData) : null;
	return {
		id: taskData.id,
		subject: taskData.subject,
		description: taskData.description.raw,
		project: taskData['_links'].project.title,
		type: taskData['_links'].type.title,
		priority: taskData['_links'].priority.title,
		status: taskData['_links'].status.title,
		author: taskData['_links'].author.title,
		parentTask: parentTask ?? undefined,
	};
}

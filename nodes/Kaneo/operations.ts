import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { getProject } from './resources/projects/get';
import { getProjects } from './resources/projects/getAll';
import { getStatuses } from './resources/statuses/getAll';
import { createTask } from './resources/tasks/create';
import { deleteTask } from './resources/tasks/delete';
import { getTask } from './resources/tasks/get';
import { getTasks } from './resources/tasks/getAll';
import { moveTask } from './resources/tasks/move';
import { updateTask } from './resources/tasks/update';

type OperationFn = (this: IExecuteFunctions, itemIndex: number) => Promise<INodeExecutionData[]>;

export const operations: Record<string, OperationFn> = {
	'project.get': getProject,
	'project.getAll': getProjects,
	'status.getAll': getStatuses,
	'task.create': createTask,
	'task.delete': deleteTask,
	'task.get': getTask,
	'task.getAll': getTasks,
	'task.move': moveTask,
	'task.update': updateTask,
};

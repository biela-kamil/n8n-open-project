import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { getTasks } from './resources/tasks/getAll';
import { getTaskById } from './resources/tasks/get';
import { updateTask } from './resources/tasks/update';
import { getTypes } from './resources/types/getAll';

import { getProjects as resourceGetProjects } from './resources/projects/getAll';
import { createTask } from './resources/tasks/create';
import { getUsers } from './resources/users/getAll';

type OperationFn = (this: IExecuteFunctions, itemIndex: number) => Promise<INodeExecutionData[]>;

export const operations: Record<string, OperationFn> = {
	'project.getAll': resourceGetProjects,
	'task.create': createTask,
	'task.getAll': getTasks,
	'task.getOne': getTaskById,
	'task.update': updateTask,
	'type.getAll': getTypes,
	'user.getAll': getUsers,
};

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { getProject } from './resources/projects/get';
import { getProjects } from './resources/projects/getAll';
import { getTask } from './resources/tasks/get';
import { getTasks } from './resources/tasks/getAll';

type OperationFn = (this: IExecuteFunctions, itemIndex: number) => Promise<INodeExecutionData[]>;

export const operations: Record<string, OperationFn> = {
	'project.get': getProject,
	'project.getAll': getProjects,
	'task.get': getTask,
	'task.getAll': getTasks,
};

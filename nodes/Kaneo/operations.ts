import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { attachLabel } from './resources/labels/attach';
import { createLabel } from './resources/labels/create';
import { deleteLabel } from './resources/labels/delete';
import { detachLabel } from './resources/labels/detach';
import { getLabel } from './resources/labels/get';
import { getLabels } from './resources/labels/getAll';
import { updateLabel } from './resources/labels/update';
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
	'label.attach': attachLabel,
	'label.create': createLabel,
	'label.delete': deleteLabel,
	'label.detach': detachLabel,
	'label.get': getLabel,
	'label.getAll': getLabels,
	'label.update': updateLabel,
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

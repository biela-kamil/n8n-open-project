import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { getProject } from './resources/projects/get';
import { getProjects } from './resources/projects/getAll';

type OperationFn = (this: IExecuteFunctions, itemIndex: number) => Promise<INodeExecutionData[]>;

export const operations: Record<string, OperationFn> = {
	'project.get': getProject,
	'project.getAll': getProjects,
};

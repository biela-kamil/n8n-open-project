import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { listRepositories } from './resources/pipelines/list';
import { getPipeline } from './resources/pipelines/get';

type OperationFn = (this: IExecuteFunctions, itemIndex: number) => Promise<INodeExecutionData[]>;

export const operations: Record<string, OperationFn> = {
	'pipelines.list': listRepositories,
	'pipelines.get': getPipeline,
};
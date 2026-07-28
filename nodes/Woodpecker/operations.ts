import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { listRepositories } from './resources/pipelines/list';

type OperationFn = (this: IExecuteFunctions, itemIndex: number) => Promise<INodeExecutionData[]>;

export const operations: Record<string, OperationFn> = {
	'pipelines.list': listRepositories,
};
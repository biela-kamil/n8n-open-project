import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { listPipelines } from './resources/pipelines/list';
import { getPipeline } from './resources/pipelines/get';
import { getPipelineStepLog } from './resources/pipelines/log';

type OperationFn = (this: IExecuteFunctions, itemIndex: number) => Promise<INodeExecutionData[]>;

export const operations: Record<string, OperationFn> = {
	'pipelines.list': listPipelines,
	'pipelines.get': getPipeline,
	'pipelines.getLog': getPipelineStepLog,
};
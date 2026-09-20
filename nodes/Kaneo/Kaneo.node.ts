import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';
import { getProjects } from './methods/projects/get';
import { operations } from './operations';
import { commentsDescription } from './resources/comments';
import { labelsDescription } from './resources/labels';
import { projectsDescription } from './resources/projects';
import { searchDescription } from './resources/search';
import { statusesDescription } from './resources/statuses';
import { taskRelationsDescription } from './resources/taskRelations';
import { tasksDescription } from './resources/tasks';

export class Kaneo implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Kaneo',
		name: 'kaneo',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Kaneo Node',
		icon: {
			light: 'file:../../icons/kaneo.png',
			dark: 'file:../../icons/kaneo.dark.png',
		},
		defaults: {
			name: 'Kaneo',
		},
		credentials: [
			{
				name: 'kaneoApi',
				required: true,
			},
		],
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Comment', value: 'comment' },
					{ name: 'Label', value: 'label' },
					{ name: 'Project', value: 'project' },
					{ name: 'Search', value: 'search' },
					{ name: 'Status', value: 'status' },
					{ name: 'Task', value: 'task' },
					{ name: 'Task Relation', value: 'taskRelation' },
				],
				default: 'project',
			},
			...commentsDescription,
			...labelsDescription,
			...projectsDescription,
			...searchDescription,
			...statusesDescription,
			...taskRelationsDescription,
			...tasksDescription,
		],
		usableAsTool: true,
	};

	methods = {
		listSearch: {
			getProjects,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		const handler = operations[`${resource}.${operation}`];
		if (!handler) {
			throw new NodeOperationError(
				this.getNode(),
				`Unsupported operation: ${resource} / ${operation}`,
			);
		}

		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				returnData.push(...(await handler.call(this, i)));
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: i });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}

import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';
import { projectsDescription } from './resources/projects';
import { getProjects } from './methods/projects/get';

import { tasksDescription } from './resources/tasks';

import { typesDescription } from './resources/types';
import { getTypes as methodGetTypes, getAllTypes } from './methods/types/get';
import { getStatuses, searchStatuses } from './methods/statuses/get';
import { getUsers } from './methods/users/get';
import { usersDescription } from './resources/users';
import { operations } from './operations';
import { prioritiesDescription } from './resources/priorities';
import { searchPriorities } from './methods/priorities/get';

export class OpenProject implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Open Project',
		name: 'openProject',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Open Project Node',
		icon: {
			light: 'file:../../icons/openproject.svg',
			dark: 'file:../../icons/openproject.dark.svg',
		},
		defaults: {
			name: 'Open Project',
		},
		credentials: [
			{
				name: 'openProjectApi',
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
					{ name: 'Priority', value: 'priority' },
					{ name: 'Project', value: 'project' },
					{ name: 'Task', value: 'task' },
					{ name: 'Type', value: 'type' },
					{ name: 'User', value: 'user' },
				],
				default: 'project',
			},
			...projectsDescription,
			...tasksDescription,
			...typesDescription,
			...usersDescription,
			...prioritiesDescription,
		],
		usableAsTool: true,
	};

	methods = {
		listSearch: {
			getProjects,
			getTypes: methodGetTypes,
			getAllTypes,
			getUsers,
			searchStatuses,
			searchPriorities,
		},
		loadOptions: {
			getStatuses,
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

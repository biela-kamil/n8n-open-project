import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
	NodeOperationError,
} from "n8n-workflow";
import { projectsDescription } from './resources/projects';
import { getProjects } from "./methods/projects/get";
import { getProjects as resourceGetProjects } from "./resources/projects/getAll";
import {createTask} from "./resources/tasks/create";
import {tasksDescription} from "./resources/tasks";
import {getTasks} from "./resources/tasks/getAll";
import {getTaskById} from "./resources/tasks/get";
import {updateTask} from "./resources/tasks/update";
import {typesDescription} from "./resources/types";
import {getTypes as methodGetTypes } from "./methods/types/get";
import {getStatuses} from "./methods/statuses/get";
import {getTypes} from "./resources/types/getAll";

type OperationFn = (this: IExecuteFunctions, itemIndex: number) => Promise<INodeExecutionData[]>;

const operations: Record<string, OperationFn> = {
	'project.getAll': resourceGetProjects,
	'task.create': createTask,
	'task.getAll': getTasks,
	'task.getOne': getTaskById,
	'task.update': updateTask,
	'type.getAll': getTypes
};

export class OpenProject implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Open Project',
		name: 'openProject',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Open Project Node',
		icon: { light: 'file:../../icons/openproject.svg', dark: 'file:../../icons/openproject.dark.svg' },
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
					{ name: 'Project', value: 'project' },
					{ name: 'Task', value: 'task' },
					{ name: 'Type', value: 'type' },
				],
				default: 'project',
			},
			...projectsDescription,
			...tasksDescription,
			...typesDescription
		],
		usableAsTool: true,
	};

	methods = {
		listSearch: {
			getProjects,
			getTypes: methodGetTypes,
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
import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
	NodeOperationError,
} from "n8n-workflow";
import { projectsDescription } from './resources/projects';
import { getProjects } from "./projects/get";
import { getAll } from "./resources/projects/getAll";

export class OpenProject implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Open Project',
		name: 'open-project',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Open Project Node',
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
				],
				default: 'project',
			},
			...projectsDescription,
		],
	};

	methods = {
		listSearch: {
			getProjects,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			if (resource === 'project' && operation === 'getAll') {
				const projects = await getAll.call(this, i);
				returnData.push(...projects);
			} else {
				throw new NodeOperationError(
					this.getNode(),
					`Unsupported operation: ${resource} / ${operation}`,
					{ itemIndex: i },
				);
			}
		}

		return [returnData];
	}
}
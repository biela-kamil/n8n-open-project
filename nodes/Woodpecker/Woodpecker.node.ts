import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';
import { operations } from './operations';
import { pipelinesDescription } from './resources/pipelines';

export class Woodpecker implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Woodpecker',
		name: 'woodpecker',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Woodpecker Node',
		icon: {
			light: 'file:../../icons/woodpecker-ci.svg',
			dark: 'file:../../icons/woodpecker-ci.dark.svg',
		},
		defaults: {
			name: 'Woodpecker',
		},
		credentials: [
			{
				name: 'woodpecker-apiApi',
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
				options: [{ name: 'Pipeline', value: 'pipelines' }],
				default: 'pipelines',
			},
			...pipelinesDescription,
		],
		usableAsTool: true,
	};

	methods = {
		listSearch: {},
		loadOptions: {},
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

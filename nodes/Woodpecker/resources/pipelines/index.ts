import { INodeProperties } from 'n8n-workflow';

const showOnlyForPipelines = {
	resource: ['pipelines'],
};

const showOnlyForPipelinesList = {
	resource: ['pipelines'],
	operation: ['list'],
};

export const pipelinesDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForPipelines },
		default: 'list',
		options: [
			{
				name: 'List',
				value: 'list',
				action: 'List pipelines',
				description: 'List pipelines for a repository',
			},
		],
	},
	{
		displayName: 'Repository ID',
		name: 'repo_id',
		type: 'string',
		required: true,
		displayOptions: { show: showOnlyForPipelinesList },
		default: '',
		description: 'ID of the Woodpecker repository',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: showOnlyForPipelinesList },
		typeOptions: { minValue: 1 },
		default: 50,
		description: 'Max number of results to return',
	},
];

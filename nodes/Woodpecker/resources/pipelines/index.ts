import { INodeProperties } from 'n8n-workflow';

const showOnlyForPipelines = {
	resource: ['pipelines'],
};

const showOnlyForPipelinesList = {
	resource: ['pipelines'],
	operation: ['list'],
};

const showOnlyForPipelinesGetLog = {
	resource: ['pipelines'],
	operation: ['getLog'],
};

const showOnlyForPipelinesListOrGet = {
	resource: ['pipelines'],
	operation: ['list', 'get', 'getLog'],
};

const showOnlyForPipelinesGetOrGetLog = {
	resource: ['pipelines'],
	operation: ['get', 'getLog'],
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
			{
				name: 'Get',
				value: 'get',
				action: 'Get a pipeline',
				description: 'Get a single pipeline by number',
			},
			{
				name: 'Get Log',
				value: 'getLog',
				action: 'Get a pipeline step log',
				description: 'Get the log lines for a pipeline step',
			},
		],
	},
	{
		displayName: 'Repository ID',
		name: 'repo_id',
		type: 'string',
		required: true,
		displayOptions: { show: showOnlyForPipelinesListOrGet },
		default: '',
		description: 'ID of the Woodpecker repository',
	},
	{
		displayName: 'Pipeline Number',
		name: 'pipeline_number',
		type: 'string',
		required: true,
		displayOptions: { show: showOnlyForPipelinesGetOrGetLog },
		default: '',
		description: 'Number of the pipeline to retrieve',
	},
	{
		displayName: 'Step ID',
		name: 'step_id',
		type: 'string',
		required: true,
		displayOptions: { show: showOnlyForPipelinesGetLog },
		default: '',
		description: 'ID of the pipeline step to retrieve the log for',
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

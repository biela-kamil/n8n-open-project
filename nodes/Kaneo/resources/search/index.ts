import { INodeProperties } from 'n8n-workflow';

const showOnlyForSearch = {
	resource: ['search'],
};

export const searchDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForSearch },
		default: 'search',
		options: [
			{
				name: 'Search',
				value: 'search',
				action: 'Search the workspace',
				description:
					'Search tasks, projects, comments and activities in the workspace, ranked by relevance',
			},
		],
	},
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. login bug',
		description: 'Text to search for. A task short ID such as PROJ-12 is matched too.',
		displayOptions: {
			show: { ...showOnlyForSearch, operation: ['search'] },
		},
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		default: 'all',
		description: 'Which kind of entities to search',
		displayOptions: {
			show: { ...showOnlyForSearch, operation: ['search'] },
		},
		options: [
			{ name: 'Activities', value: 'activities' },
			{ name: 'All', value: 'all' },
			{ name: 'Comments', value: 'comments' },
			{ name: 'Projects', value: 'projects' },
			{ name: 'Tasks', value: 'tasks' },
			{ name: 'Workspaces', value: 'workspaces' },
		],
	},
	{
		displayName: 'Project',
		name: 'projectId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		description: 'Limit the search to a single project',
		displayOptions: {
			show: { ...showOnlyForSearch, operation: ['search'] },
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a project...',
				typeOptions: {
					searchListMethod: 'getProjects',
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. 4e3b1c2a-...',
			},
		],
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1, maxValue: 50 },
		description: 'Max number of results to return',
		displayOptions: {
			show: { ...showOnlyForSearch, operation: ['search'] },
		},
	},
];

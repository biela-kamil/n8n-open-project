import { INodeProperties } from 'n8n-workflow';

const showOnlyForTasks = {
	resource: ['task'],
};

export const tasksDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForTasks },
		default: 'getAll',
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a task',
				description: 'Get a single task by ID',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many tasks',
				description: 'Get many tasks from a Kaneo project',
			},
		],
	},
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. 4e3b1c2a-...',
		description: 'ID of the task to get',
		displayOptions: {
			show: { ...showOnlyForTasks, operation: ['get'] },
		},
	},
	{
		displayName: 'Project',
		name: 'projectId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The project to list tasks from',
		displayOptions: {
			show: { ...showOnlyForTasks, operation: ['getAll'] },
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
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: { ...showOnlyForTasks, operation: ['getAll'] },
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: { ...showOnlyForTasks, operation: ['getAll'], returnAll: [false] },
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: { ...showOnlyForTasks, operation: ['getAll'] },
		},
		options: [
			{
				displayName: 'Assignee ID',
				name: 'assigneeId',
				type: 'string',
				default: '',
				description: 'Only return tasks assigned to this user',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'string',
				default: '',
				placeholder: 'e.g. high',
				description: 'Only return tasks with this priority',
			},
			{
				displayName: 'Sort By',
				name: 'sortBy',
				type: 'options',
				default: 'position',
				options: [
					{ name: 'Created At', value: 'createdAt' },
					{ name: 'Due Date', value: 'dueDate' },
					{ name: 'Number', value: 'number' },
					{ name: 'Position', value: 'position' },
					{ name: 'Priority', value: 'priority' },
					{ name: 'Title', value: 'title' },
				],
			},
			{
				displayName: 'Sort Order',
				name: 'sortOrder',
				type: 'options',
				default: 'asc',
				options: [
					{ name: 'Ascending', value: 'asc' },
					{ name: 'Descending', value: 'desc' },
				],
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'string',
				default: '',
				placeholder: 'e.g. in-progress',
				description: 'Only return tasks with this status (column slug)',
			},
		],
	},
];

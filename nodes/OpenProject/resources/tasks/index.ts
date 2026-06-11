import { INodeProperties } from 'n8n-workflow';

const showOnlyResource = { resource: ['task'] };

export const tasksDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		default: 'getAll',
		noDataExpression: true,
		options: [
			{
				name: 'Add Comment',
				value: 'addComment',
				action: 'Add comment',
			},
			{
				name: 'Change Status in Task',
				value: 'changeStatus',
				action: 'Change status in task',
			},
			{
				name: 'Create Task',
				value: 'create',
				action: 'Create task',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many tasks',
				description: 'Get many tasks',
			},
			{
				name: 'Get Task',
				value: 'getOne',
				action: 'Get task',
			},
			{
				name: 'Returns the Possible Statuses for the Task',
				value: 'statuses',
				action: 'Returns the possible statuses for the task',
			},
			{
				name: 'Search Tasks',
				value: 'search',
				action: 'Search tasks',
				description: 'Search tasks across projects with filters',
			},
			{
				name: 'Update Task',
				value: 'update',
				action: 'Update task',
			},
		],
		displayOptions: {
			show: { ...showOnlyResource },
		},
	},
	{
		displayName: 'Project',
		name: 'project',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The project to create the task in',
		displayOptions: {
			show: { ...showOnlyResource, operation: ['create', 'getAll', 'search'] },
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
		],
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The type of the task',
		displayOptions: {
			show: { ...showOnlyResource, operation: ['create'] },
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a project...',
				typeOptions: {
					searchListMethod: 'getTypes',
					searchable: true,
					searchFilterRequired: false,
				},
			},
		],
	},
	{
		displayName: 'ID',
		name: 'id',
		displayOptions: {
			show: {
				...showOnlyResource,
				operation: ['getOne', 'update', 'statuses', 'addComment', 'changeStatus'],
			},
		},
		type: 'string',
		default: '',
	},
	{
		displayName: 'Subject',
		type: 'string',
		name: 'subject',
		default: '',
		required: true,
		displayOptions: {
			show: { ...showOnlyResource, operation: ['create'] },
		},
	},

	{
		displayName: 'Users',
		name: 'user',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The user of the task',
		displayOptions: {
			show: { ...showOnlyResource, operation: ['create'] },
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a user...',
				typeOptions: {
					searchListMethod: 'getUsers',
					searchable: true,
					searchFilterRequired: false,
				},
			},
		],
	},
	{
		displayName: 'Description',
		name: 'taskDescription',
		type: 'string',
		default: '',
		displayOptions: {
			show: { ...showOnlyResource, operation: ['create', 'addComment', 'changeStatus'] },
		},
	},
	{
		displayName: 'Subject',
		name: 'updateSubject',
		type: 'string',
		default: '',
		description: 'New subject for the task. Leave empty to keep the current value.',
		displayOptions: {
			show: { ...showOnlyResource, operation: ['update'] },
		},
	},
	{
		displayName: 'Description',
		name: 'updateDescription',
		type: 'string',
		default: '',
		description: 'New description for the task. Leave empty to keep the current value.',
		displayOptions: {
			show: { ...showOnlyResource, operation: ['update'] },
		},
	},
	{
		displayName: 'Parent Task ID',
		name: 'parentTaskId',
		type: 'string',
		default: '',
		displayOptions: {
			show: { ...showOnlyResource, operation: ['update', 'create'] },
		},
	},
	{
		displayName: 'Status',
		name: 'updateStatus',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		description:
			'Status for the task. For Update, leave empty to keep the current value; for Change Status it is required.',
		displayOptions: {
			show: { ...showOnlyResource, operation: ['update', 'changeStatus'] },
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a status...',
				typeOptions: {
					searchListMethod: 'searchStatuses',
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. 7',
			},
		],
	},
	{
		displayName: 'Priority',
		name: 'priority',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		displayOptions: {
			show: { ...showOnlyResource, operation: ['update', 'create'] },
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a priority...',
				typeOptions: {
					searchListMethod: 'searchPriorities',
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. 7',
			},
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { ...showOnlyResource, operation: ['getAll', 'search'] } },
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: { ...showOnlyResource, operation: ['getAll', 'search'], returnAll: [false] },
		},
		typeOptions: { minValue: 1 },
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Sort By',
		name: 'sortBy',
		type: 'options',
		displayOptions: { show: { ...showOnlyResource, operation: ['getAll', 'search'] } },
		options: [
			{ name: 'Assignee', value: 'assignee' },
			{ name: 'Author', value: 'author' },
			{ name: 'Created At', value: 'createdAt' },
			{ name: 'Default', value: '' },
			{ name: 'Due Date', value: 'dueDate' },
			{ name: 'ID', value: 'id' },
			{ name: 'Priority', value: 'priority' },
			{ name: 'Start Date', value: 'startDate' },
			{ name: 'Status', value: 'status' },
			{ name: 'Subject', value: 'subject' },
			{ name: 'Type', value: 'type' },
			{ name: 'Updated At', value: 'updatedAt' },
		],
		default: '',
		description:
			'The column to sort the returned tasks by. Choose "Default" to keep OpenProject\'s default ordering.',
	},
	{
		displayName: 'Sort Order',
		name: 'sortOrder',
		type: 'options',
		displayOptions: {
			show: { ...showOnlyResource, operation: ['getAll', 'search'] },
			hide: { sortBy: [''] },
		},
		options: [
			{ name: 'Ascending', value: 'asc' },
			{ name: 'Descending', value: 'desc' },
		],
		default: 'asc',
		description: 'The direction to sort by when a "Sort By" column is selected',
	},
	{
		displayName: 'Search Text',
		name: 'searchText',
		type: 'string',
		default: '',
		displayOptions: { show: { ...showOnlyResource, operation: ['search'] } },
		description:
			'Full-text search across task subject, description, and comments. Leave empty to ignore.',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		default: {},
		displayOptions: { show: { ...showOnlyResource, operation: ['getAll'] } },
		options: [
			{
				displayName: 'Status Group',
				name: 'statusGroup',
				type: 'options',
				options: [
					{ name: 'Any', value: '' },
					{ name: 'Open', value: 'open' },
					{ name: 'Closed', value: 'closed' },
				],
				default: '',
				description:
					'Filter by all open or all closed statuses. Choose "Any" to filter by a specific status instead.',
			},
			{
				displayName: 'Status Name or ID',
				name: 'status',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getStatuses',
				},
				default: '',
				displayOptions: { hide: { statusGroup: ['open', 'closed'] } },
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
		],
	},
];

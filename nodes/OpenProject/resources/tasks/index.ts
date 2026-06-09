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
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many tasks',
				description: 'Get many tasks',
			},
			{
				name: 'Create Task',
				value: 'create',
				action: 'Create task',
			},
			{
				name: 'Get Task',
				value: 'getOne',
				action: 'Get task',
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
			show: { ...showOnlyResource, operation: ['create', 'getAll'] },
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
			show: { ...showOnlyResource, operation: ['getOne', 'update'] },
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
			show: { ...showOnlyResource, operation: ['create'] },
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
		displayName: 'Status',
		name: 'updateStatus',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		description: 'New status for the task. Leave empty to keep the current value.',
		displayOptions: {
			show: { ...showOnlyResource, operation: ['update'] },
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
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		default: {},
		displayOptions: { show: { ...showOnlyResource, operation: ['getAll'] } },
		options: [
			{
				displayName: 'Status Name or ID',
				name: 'status',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getStatuses',
				},
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
		],
	},
];

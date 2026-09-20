import { INodeProperties } from 'n8n-workflow';

const showOnlyForLabels = {
	resource: ['label'],
};

export const labelsDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForLabels },
		default: 'getAll',
		options: [
			{
				name: 'Attach to Task',
				value: 'attach',
				action: 'Attach a label to a task',
				description: 'Attach an existing label to a task',
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a label',
				description: 'Create a label in the workspace, optionally directly on a task',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a label',
				description: 'Delete a label by ID',
			},
			{
				name: 'Detach From Task',
				value: 'detach',
				action: 'Detach a label from a task',
				description: 'Detach a label from the task it is attached to',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a label',
				description: 'Get a single label by ID',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many labels',
				description: 'Get the labels of the workspace or of a task',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a label',
				description: 'Update the name or color of a label',
			},
		],
	},
	{
		displayName: 'Label ID',
		name: 'labelId',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. 4e3b1c2a-...',
		description: 'ID of the label',
		displayOptions: {
			show: { ...showOnlyForLabels, operation: ['get', 'update', 'delete', 'attach', 'detach'] },
		},
	},
	{
		displayName: 'Scope',
		name: 'scope',
		type: 'options',
		default: 'workspace',
		description: 'Whether to list the labels of the whole workspace or of a single task',
		displayOptions: {
			show: { ...showOnlyForLabels, operation: ['getAll'] },
		},
		options: [
			{ name: 'Workspace', value: 'workspace' },
			{ name: 'Task', value: 'task' },
		],
	},
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. 4e3b1c2a-...',
		description: 'ID of the task',
		displayOptions: {
			show: { ...showOnlyForLabels, operation: ['attach'] },
		},
	},
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. 4e3b1c2a-...',
		description: 'ID of the task to list labels from',
		displayOptions: {
			show: { ...showOnlyForLabels, operation: ['getAll'], scope: ['task'] },
		},
	},
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		default: '',
		placeholder: 'e.g. 4e3b1c2a-...',
		description:
			'If set, the label is created directly on this task instead of as a workspace-level label',
		displayOptions: {
			show: { ...showOnlyForLabels, operation: ['create'] },
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		description: 'Name of the label',
		displayOptions: {
			show: { ...showOnlyForLabels, operation: ['create'] },
		},
	},
	{
		displayName: 'Color',
		name: 'color',
		type: 'color',
		default: '',
		required: true,
		description: 'Hex color of the label, e.g. #3B82F6',
		displayOptions: {
			show: { ...showOnlyForLabels, operation: ['create'] },
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { ...showOnlyForLabels, operation: ['update'] },
		},
		options: [
			{
				displayName: 'Color',
				name: 'color',
				type: 'color',
				default: '',
				description: 'Hex color of the label, e.g. #3B82F6',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
			},
		],
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: { ...showOnlyForLabels, operation: ['getAll'], scope: ['workspace'] },
		},
		options: [
			{
				displayName: 'Unassigned Only',
				name: 'unassignedOnly',
				type: 'boolean',
				default: false,
				description:
					'Whether to return only workspace-level labels (not the per-task copies created when a label is attached to a task)',
			},
		],
	},
];

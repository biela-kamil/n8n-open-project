import { INodeProperties } from 'n8n-workflow';

const showOnlyForTaskRelations = {
	resource: ['taskRelation'],
};

export const taskRelationsDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForTaskRelations },
		default: 'getAll',
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a task relation',
				description: 'Link two tasks (subtask, blocks or related)',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a task relation',
				description: 'Remove a link between two tasks',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many task relations',
				description:
					'Get many task relations where the task is the source or the target, with a summary of both linked tasks',
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
		description: 'ID of the task to list relations of',
		displayOptions: {
			show: { ...showOnlyForTaskRelations, operation: ['getAll'] },
		},
	},
	{
		displayName: 'Source Task ID',
		name: 'taskId',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. 4e3b1c2a-...',
		description:
			'ID of the task the relation starts from (the parent for "subtask", the blocker for "blocks")',
		displayOptions: {
			show: { ...showOnlyForTaskRelations, operation: ['create'] },
		},
	},
	{
		displayName: 'Target Task ID',
		name: 'targetTaskId',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. 4e3b1c2a-...',
		description:
			'ID of the task the relation points to (the child for "subtask", the blocked task for "blocks")',
		displayOptions: {
			show: { ...showOnlyForTaskRelations, operation: ['create'] },
		},
	},
	{
		displayName: 'Relation Type',
		name: 'relationType',
		type: 'options',
		default: 'related',
		description: 'How the two tasks relate',
		displayOptions: {
			show: { ...showOnlyForTaskRelations, operation: ['create'] },
		},
		options: [
			{ name: 'Blocks', value: 'blocks', description: 'Source task blocks the target task' },
			{ name: 'Related', value: 'related', description: 'Tasks are related' },
			{ name: 'Subtask', value: 'subtask', description: 'Target task is a subtask of the source task' },
		],
	},
	{
		displayName: 'Relation ID',
		name: 'relationId',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. 4e3b1c2a-...',
		description: 'ID of the relation to delete',
		displayOptions: {
			show: { ...showOnlyForTaskRelations, operation: ['delete'] },
		},
	},
];

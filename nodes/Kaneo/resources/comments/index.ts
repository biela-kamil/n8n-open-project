import { INodeProperties } from 'n8n-workflow';

const showOnlyForComments = {
	resource: ['comment'],
};

export const commentsDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForComments },
		default: 'getAll',
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a comment',
				description: 'Add a comment to a task',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a comment',
				description: 'Delete a comment (only its author may do this)',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many comments',
				description: 'Get many comments of a task, oldest first',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a comment',
				description: 'Edit the content of a comment (only its author may do this)',
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
		description: 'ID of the task',
		displayOptions: {
			show: { ...showOnlyForComments, operation: ['getAll', 'create'] },
		},
	},
	{
		displayName: 'Comment ID',
		name: 'commentId',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'e.g. 4e3b1c2a-...',
		description: 'ID of the comment',
		displayOptions: {
			show: { ...showOnlyForComments, operation: ['update', 'delete'] },
		},
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		typeOptions: { rows: 4 },
		default: '',
		required: true,
		description: 'Text of the comment. Mentions notify the mentioned users.',
		displayOptions: {
			show: { ...showOnlyForComments, operation: ['create', 'update'] },
		},
	},
];

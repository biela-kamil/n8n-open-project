import { INodeProperties } from 'n8n-workflow';

const showOnlyForStatuses = {
	resource: ['status'],
};

export const statusesDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForStatuses },
		default: 'getAll',
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many statuses',
				description: 'Get the board columns (task statuses) of a Kaneo project',
			},
		],
	},
	{
		displayName: 'Project',
		name: 'projectId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The project to list statuses from',
		displayOptions: {
			show: { ...showOnlyForStatuses, operation: ['getAll'] },
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
];

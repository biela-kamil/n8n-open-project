import { INodeProperties } from 'n8n-workflow';

const showOnlyForProjects = {
	resource: ['project'],
};

export const projectsDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForProjects },
		default: 'getAll',
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a project',
				description: 'Get a single project by ID',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many projects',
				description: 'Get many projects from Kaneo',
			},
		],
	},
	{
		displayName: 'Project',
		name: 'projectId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The project to get',
		displayOptions: {
			show: { ...showOnlyForProjects, operation: ['get'] },
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

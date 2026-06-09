import { INodeProperties } from "n8n-workflow";

const showOnlyForProjects = {
	resource: ['project'],
};

const showOnlyForProjectsGetAll = {
	resource: ['project'],
	operation: ['getAll'],
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
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many projects',
				description: 'Get many projects from OpenProject',
			},
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: showOnlyForProjectsGetAll },
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: { ...showOnlyForProjectsGetAll, returnAll: [false] },
		},
		typeOptions: { minValue: 1 },

		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: { show: showOnlyForProjectsGetAll },
		default: {},
		options: [
			{
				displayName: 'Active',
				name: 'active',
				type: 'options',
				options: [
					{ name: 'Any', value: 'any' },
					{ name: 'Active Only', value: 'active' },
					{ name: 'Inactive', value: 'inactive' },
				],
				default: 'any',
				description: 'Filter projects by their active state',
			},
			{
				displayName: 'Name or Identifier',
				name: 'nameAndIdentifier',
				type: 'string',
				default: '',
				description: 'Return only projects whose name or identifier contains this text',
			},
		],
	},
];
import { INodeProperties } from 'n8n-workflow';

const showOnlyResource = { resource: ['user'] };

export const usersDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'getAll',
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
			},
		],
		displayOptions: { show: showOnlyResource },
	},
];

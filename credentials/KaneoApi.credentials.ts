import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class KaneoApi implements ICredentialType {
	name = 'kaneoApi';
	displayName = 'Kaneo API';
	documentationUrl = 'https://kaneo.app/docs/api-reference/';
	icon: Icon = {
		light: 'file:../icons/kaneo.png',
		dark: 'file:../icons/kaneo.dark.png',
	};

	properties: INodeProperties[] = [
		{
			displayName: 'URL',
			name: 'url',
			type: 'string',
			placeholder: 'https://kaneo.app',
			default: '',
			description: 'Base URL of your Kaneo instance, without a trailing slash',
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Your Kaneo API key',
		},
		{
			displayName: 'Workspace ID',
			name: 'workspaceId',
			type: 'string',
			required: true,
			default: '',
			description: 'ID of the Kaneo workspace this credential operates on',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.url}}',
			url: '/api/instance/status',
		},
	};
}

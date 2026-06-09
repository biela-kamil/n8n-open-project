import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	Icon,
	INodeProperties,
} from "n8n-workflow";

export class OpenProjectApi implements ICredentialType {
	name = 'openProjectApi';
	displayName = 'Open Project API';
	documentationUrl = 'https://www.openproject.org/docs/api/';
	icon: Icon = { light: 'file:../icons/openproject.svg', dark: 'file:../icons/openproject.dark.svg' };

	properties: INodeProperties[] = [
		{
			displayName: 'URL',
			name: 'url',
			type: 'string',
			placeholder: 'https://www.openproject.org',
			default: '',
			description: 'Base URL of your OpenProject instance, without a trailing slash',
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Your OpenProject API key',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: 'apikey',
				password: '={{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.url}}',
			url: '/api/v3/configuration',
		},
	};
}
import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class WoodpeckerCredentialsApi implements ICredentialType {
	name = 'woodpecker-apiApi';
	displayName = 'Woodpecker API';
	documentationUrl = 'https://woodpecker-ci.org/api';
	icon: Icon = {
		light: 'file:../icons/woodpecker-ci.svg',
		dark: 'file:../icons/woodpecker-ci.dark.svg',
	};

	properties: INodeProperties[] = [
		{
			displayName: 'URL',
			name: 'url',
			type: 'string',
			placeholder: 'https://woodpecker-ci.org',
			default: '',
			description: 'Base URL of your Woodpecker instance, without a trailing slash',
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Your Woodpecker API key',
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
			url: '/api/user',
		},
	};
}

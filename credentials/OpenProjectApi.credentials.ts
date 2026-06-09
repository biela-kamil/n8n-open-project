import type {ICredentialType, INodeProperties} from "n8n-workflow";

export class OpenProjectApi implements ICredentialType {
    name = 'openProjectApi';
    displayName =  'Open Project API';

    properties: INodeProperties[] = [
        {
            displayName: 'Access Token',
            name: 'accessToken',
            type: 'string',
            typeOptions: { password: true},
            default: ''
        },
        {
            displayName: 'Url',
            name: 'url',
            type: 'string',
            default: ''
        }
    ]

}
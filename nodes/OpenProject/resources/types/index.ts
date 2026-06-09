import {INodeProperties} from "n8n-workflow";


const showOnlyResource = { resource: ['type']}

export const typesDescription: INodeProperties[] = [
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
            }
        ],
        displayOptions: { show: showOnlyResource },
    },
    {
        displayName: 'Project',
        name: 'project',
        type: 'resourceLocator',
        default: { mode: 'list', value: '' },
        required: true,
        displayOptions: {
            show: { ...showOnlyResource, operation: ['create', 'getAll'] }
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
        ],
    },
]
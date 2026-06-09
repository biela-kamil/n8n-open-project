import {INodeProperties} from "n8n-workflow";

const showOnlyForProjects =  {
    resource: ['project']
}

export const projectsDescription: INodeProperties[] =  [
    {
        displayName: 'Operation',
        displayOptions: {
            show: showOnlyForProjects
        },
        name: 'operation',
        type: 'options',
        default: 'getAll',
        options: [
            {
                name: 'Get many',
                value: 'getAll',
                action: 'Get all projects',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/projects',
                    }
                }
            }
        ]
    }
]
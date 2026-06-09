import {INodeType, INodeTypeDescription, NodeConnectionTypes} from "n8n-workflow";
import { projectsDescription } from './resources/projects'
import {getProjects} from "./projects/get";

export class OpenProject implements INodeType {
    description: INodeTypeDescription =  {
        displayName: 'Open Project',
        name: 'open-project',
        group: ['input'],
        version: 1,
        description: 'Open Project Node',
        defaults: {
            name: 'Example'
        },
        credentials: [
            {
                name: 'openProjectApi',
                required: true,

            },
        ],
        inputs: [NodeConnectionTypes.Main],
        outputs: [NodeConnectionTypes.Main],
        properties:  [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Project',
                        value: 'project'
                    },
                    {
                        name: 'Task',
                        value: 'task'
                    },
                ],
                default: 'project'
            },
            ...projectsDescription
        ]
    }
    methods: {
        projects: {
            getProjects
        }
    }
}
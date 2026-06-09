import {IExecuteFunctions, INodeExecutionData} from "n8n-workflow";
import {openProjectRequest} from "../../utils/request";
import {OpenProjectType} from "../../utils/types";

export async function getTypes(
    this:  IExecuteFunctions,
    itemIndex: number,
): Promise<INodeExecutionData[]> {
    const project = this.getNodeParameter('project', itemIndex, undefined, {
        extractValue: true,
    }) as string;


    const response =  await openProjectRequest.call(this, 'GET', `/projects/${project}/types`)
    const elements: OpenProjectType[] = response._embedded?.elements ?? [];


    return elements.map(element => ({
        json: {
            id: element.id,
            name: element.name,
            position: element.position,
        }
    }))

}
import {IExecuteFunctions, INodeExecutionData} from "n8n-workflow";
import {openProjectRequest} from "../../utils/request";

export async function getTaskById(
    this: IExecuteFunctions,
    itemIndex: number,
): Promise<INodeExecutionData[]> {


    const id = this.getNodeParameter('id', itemIndex);

    const response = await openProjectRequest.call(this, 'GET', `/work_packages/${id}`, {});

    return [{
        json: {
            id: response.id,
            subject: response.subject,
            description: response.description.raw,
            project: response["_links"].project.title,
            type: response["_links"].type.title,
            priority: response["_links"].priority.title,
            status: response["_links"].status.title,
            author: response["_links"].author.title,

        }
    }]

}
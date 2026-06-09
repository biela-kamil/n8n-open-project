import {IDataObject, IExecuteFunctions, INodeExecutionData} from "n8n-workflow";
import {openProjectRequest} from "../../utils/request";


export async function updateTask(
    this: IExecuteFunctions,
    itemIndex: number,
): Promise<INodeExecutionData[]> {

    const id = this.getNodeParameter('id', itemIndex) as string;
    const updateFields = this.getNodeParameter('updateFields', itemIndex, {});

    const current = await openProjectRequest.call(this, 'GET', `/work_packages/${id}`, {}, {});
    const lockVersion = current.lockVersion;

    const body: IDataObject = {lockVersion};

    if ('subject' in updateFields) {
        body.subject = updateFields.subject;
    }

    if ('description' in updateFields) {
        body.description = {
            format: 'markdown',
            raw: updateFields.description,
        };
    }

    const  response = await openProjectRequest.call(this, 'PATCH', `/work_packages/${id}`, {}, body)


    const json = {
        id: response.id,
        subject: response.subject,
        description: response.description.raw,
        project: response["_links"].project.title,
        type: response["_links"].type.title,
        priority: response["_links"].priority.title,
        status: response["_links"].status.title,
        author: response["_links"].author.title,
    }

    return [{
        json,
    }]
}
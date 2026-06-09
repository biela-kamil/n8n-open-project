import type {
    IDataObject,
    IExecuteFunctions,
    IExecuteSingleFunctions,
    IHookFunctions,
    IHttpRequestMethods, IHttpRequestOptions,
    ILoadOptionsFunctions
} from "n8n-workflow";


export async function openProjectRequest(
    this: IHookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions,
    method: IHttpRequestMethods,
    resource: string,
    qs: IDataObject = {},
    body: IDataObject | undefined = undefined,
) {


    const authenticationMethod = this.getNodeParameter('authentication', 0);

    console.log(authenticationMethod);

    const options: IHttpRequestOptions = {
        method,
        qs,
        body,
        url: `https://backlog.centrumosk.pl${resource}`,
        json: true
    }

    return this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', options)


}
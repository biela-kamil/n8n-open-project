import type {
	IDataObject,
	IExecuteFunctions,
	IExecuteSingleFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
} from "n8n-workflow";

export async function openProjectRequest(
	this: IHookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	resource: string,
	qs: IDataObject = {},
	body: IDataObject | undefined = undefined,
) {
	const credentials = await this.getCredentials('openProjectApi');
	const baseUrl = (credentials.url as string).replace(/\/$/, '');

	const options: IHttpRequestOptions = {
		method,
		qs,
		url: `${baseUrl}/api/v3${resource}`,
		json: true,
	};

	if (body !== undefined) {
		options.body = body;
	}

	return this.helpers.httpRequestWithAuthentication.call(this, 'openProjectApi', options);
}
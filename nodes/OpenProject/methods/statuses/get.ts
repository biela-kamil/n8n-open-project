import type {
	ILoadOptionsFunctions,
	INodePropertyOptions,
} from "n8n-workflow";
import { openProjectRequest } from "../../utils/request";
import type { OpenProjectStatusesCollection } from "../../utils/types";

export async function getStatuses(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const response = (await openProjectRequest.call(
		this,
		'GET',
		'/statuses',
	)) as OpenProjectStatusesCollection;

	const elements = response._embedded?.elements ?? [];

	return elements.map((el) => ({
		name: el.name,
		value: el.id,
	}));
}
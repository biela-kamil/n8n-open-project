import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { openProjectRequest } from '../../utils/request';
import { OpenProjectCollection, OpenProjectUser } from '../../utils/types';

export async function getUsers(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
	const response = (await openProjectRequest.call(
		this,
		'GET',
		`/users`,
	)) as OpenProjectCollection<OpenProjectUser>;
	const elements: OpenProjectUser[] = response._embedded?.elements ?? [];

	return elements.map((element) => ({
		json: {
			id: element.id,
			name: element.name,
			login: element.login,
			firstName: element.firstName,
			lastName: element.lastName,
			email: element.email,
			isAdmin: element.admin,
			status: element.status,
			createdAt: element.createdAt,
			updatedAt: element.updatedAt,
		},
	}));
}

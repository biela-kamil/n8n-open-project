import type { IDataObject } from 'n8n-workflow';

export type ProjectFilterInput = {
	active?: string;
	nameAndIdentifier?: string;
};

export function buildProjectFilters(input: ProjectFilterInput): string | undefined {
	const filterArray: IDataObject[] = [];

	if (input.active && input.active !== 'any') {
		filterArray.push({
			active: { operator: '=', values: [input.active === 'active' ? 't' : 'f'] },
		});
	}

	if (input.nameAndIdentifier) {
		filterArray.push({
			name_and_identifier: { operator: '~', values: [input.nameAndIdentifier] },
		});
	}

	return filterArray.length > 0 ? JSON.stringify(filterArray) : undefined;
}

export type TaskFilterInput = {
	statusGroup?: string;
	status?: string;
	search?: string;
	type?: string;
	priority?: string;
	assignee?: string;
	project?: string;
};

export function buildTaskFilters(input: TaskFilterInput): string | undefined {
	const filterArray: IDataObject[] = [];

	if (input.statusGroup === 'open') {
		filterArray.push({
			status: { operator: 'o', values: [] },
		});
	} else if (input.statusGroup === 'closed') {
		filterArray.push({
			status: { operator: 'c', values: [] },
		});
	} else if (input.status) {
		filterArray.push({
			status: { operator: '=', values: [input.status] },
		});
	}

	if (input.search) {
		filterArray.push({
			search: { operator: '**', values: [input.search] },
		});
	}

	if (input.type) {
		filterArray.push({
			type: { operator: '=', values: [input.type] },
		});
	}

	if (input.priority) {
		filterArray.push({
			priority: { operator: '=', values: [input.priority] },
		});
	}

	if (input.assignee) {
		filterArray.push({
			assignee: { operator: '=', values: [input.assignee] },
		});
	}

	if (input.project) {
		filterArray.push({
			project: { operator: '=', values: [input.project] },
		});
	}

	return filterArray.length > 0 ? JSON.stringify(filterArray) : undefined;
}

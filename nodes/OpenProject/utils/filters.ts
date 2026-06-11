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

	return filterArray.length > 0 ? JSON.stringify(filterArray) : undefined;
}

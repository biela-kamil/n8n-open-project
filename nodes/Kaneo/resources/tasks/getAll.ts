import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { kaneoRequest } from '../../utils/request';
import { KaneoTask, KaneoTaskBoard, KaneoTaskBoardResponse } from '../../utils/types';

/** Maximum page size accepted by the Kaneo API */
const MAX_PAGE_SIZE = 100;

type TaskBucket = 'board' | 'archived' | 'planned';

function toItem(
	task: KaneoTask,
	bucket: TaskBucket,
	column: string | null,
	itemIndex: number,
): INodeExecutionData {
	return {
		json: { ...(task as unknown as IDataObject), column, bucket },
		pairedItem: { item: itemIndex },
	};
}

function flattenBoard(board: KaneoTaskBoard, itemIndex: number): INodeExecutionData[] {
	return [
		...board.columns.flatMap((col) =>
			col.tasks.map((task) => toItem(task, 'board', col.name, itemIndex)),
		),
		...board.archivedTasks.map((task) => toItem(task, 'archived', null, itemIndex)),
		...board.plannedTasks.map((task) => toItem(task, 'planned', null, itemIndex)),
	];
}

export async function getTasks(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const projectId = this.getNodeParameter('projectId', itemIndex, '', {
		extractValue: true,
	}) as string;
	const returnAll = this.getNodeParameter('returnAll', itemIndex, false) as boolean;
	const limit = returnAll
		? Infinity
		: (this.getNodeParameter('limit', itemIndex, 50) as number);
	const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;

	// Drop empty strings so we don't send `status=` etc. to the API
	const qs = Object.fromEntries(
		Object.entries(filters).filter(([, value]) => value !== '' && value !== undefined),
	);

	const results: INodeExecutionData[] = [];
	// Guards against duplicates if the API repeats archived/planned tasks on every page
	const seen = new Set<string>();
	let page = 1;
	let totalPages = 1;

	while (page <= totalPages && results.length < limit) {
		const response = (await kaneoRequest.call(this, 'GET', `task/tasks/${projectId}`, {
			...qs,
			page,
			limit: Math.min(limit - results.length, MAX_PAGE_SIZE),
		})) as KaneoTaskBoardResponse;

		for (const item of flattenBoard(response.data, itemIndex)) {
			const id = item.json.id as string;
			if (seen.has(id)) continue;
			seen.add(id);
			results.push(item);
		}
		totalPages = response.pagination.totalPages;
		page++;
	}

	return results.slice(0, limit);
}

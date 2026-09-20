interface KaneoProjectBase {
	id: string;
	workspaceId: string;
	slug: string;
	icon: string | null;
	name: string;
	description: string | null;
	createdAt: Date;
}

/** Shape returned by `GET /project` (list) */
export interface KaneoProject extends KaneoProjectBase {
	statistics: {
		completionPercentage: number;
		totalTasks: number;
		dueDate: Date | null;
	};
}

/** Shape returned by `GET /project/{id}` */
export interface KaneoProjectDetail extends KaneoProjectBase {
	isPublic: boolean;
	archivedAt: Date | null;
	lastTaskNumber: number;
	position: number;
	tasks: unknown[];
}

/** Task shape returned by `GET /task/{id}` and inside the board from `GET /task/tasks/{projectId}` */
export interface KaneoTask {
	id: string;
	projectId: string;
	number: number;
	title: string;
	description: string | null;
	status: string;
	priority: string | null;
	position: number;
	startDate: Date | null;
	dueDate: Date | null;
	createdAt: Date;
	userId: string | null;
	assigneeId: string | null;
	assigneeName: string | null;
	assigneeImage: string | null;
	labels: unknown[];
	externalLinks: unknown[];
}

/** Shape returned by `PUT /task/move/{id}` */
export interface KaneoMoveTaskResponse {
	task: KaneoTask;
	sourceProjectId: string;
	destinationProjectId: string;
}

/** Shape returned by `GET /task/tasks/{projectId}` */
export interface KaneoTaskBoardResponse {
	data: KaneoTaskBoard;
	pagination: {
		total: number;
		page: number;
		pageSize: number;
		totalPages: number;
	};
}

export interface KaneoTaskBoard {
	id: string;
	name: string;
	slug: string;
	icon: string | null;
	description: string | null;
	isPublic: boolean;
	workspaceId: string;
	columns: {
		id: string;
		slug: string;
		name: string;
		icon: string | null;
		isFinal: boolean;
		tasks: KaneoTask[];
	}[];
	archivedTasks: KaneoTask[];
	plannedTasks: KaneoTask[];
}

/** Board column returned by `GET /column/{projectId}`; `slug` is what tasks store as `status` */
export interface KaneoColumn {
	id: string;
	projectId: string;
	name: string;
	slug: string;
	position: number;
	icon: string | null;
	color: string | null;
	isFinal: boolean;
	createdAt: Date;
	updatedAt: Date;
}

/** Shape returned by the `/label` endpoints. A label with `taskId` is a per-task copy of a workspace label. */
export interface KaneoLabel {
	id: string;
	name: string;
	color: string;
	createdAt: Date;
	updatedAt: Date;
	taskId: string | null;
	workspaceId: string | null;
}

/** Shape returned by `GET /comment/{taskId}` */
export interface KaneoComment {
	id: string;
	taskId: string;
	userId: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
	user: { name: string; image: string | null };
}

/** Activity row returned by the comment write endpoints (and `GET /activity/{taskId}`) */
export interface KaneoActivity {
	id: string;
	taskId: string;
	type: string;
	createdAt: Date;
	updatedAt: Date;
	userId: string | null;
	content: string | null;
	eventData: unknown;
	externalUserName: string | null;
	externalUserAvatar: string | null;
	externalSource: string | null;
	externalUrl: string | null;
}

/** Shape returned by `POST /task-relation` and `DELETE /task-relation/{id}` */
export interface KaneoTaskRelation {
	id: string;
	sourceTaskId: string;
	targetTaskId: string;
	relationType: 'subtask' | 'blocks' | 'related';
	createdAt: Date;
}

export interface KaneoRelatedTask {
	id: string;
	title: string;
	status: string;
	priority: string | null;
	number: number | null;
	projectId: string;
	userId: string | null;
	assigneeName: string | null;
}

/** Shape returned by `GET /task-relation/{taskId}` */
export interface KaneoTaskRelationWithTasks extends KaneoTaskRelation {
	sourceTask: KaneoRelatedTask | null;
	targetTask: KaneoRelatedTask | null;
}

/** Single hit from `GET /search`; optional fields depend on `type` */
export interface KaneoSearchResult {
	id: string;
	type: 'task' | 'project' | 'workspace' | 'comment' | 'activity';
	title: string;
	description?: string;
	content?: string;
	projectId?: string;
	projectName?: string;
	projectSlug?: string;
	workspaceId?: string;
	workspaceName?: string;
	userId?: string;
	userName?: string;
	createdAt: Date;
	relevanceScore: number;
	taskNumber?: number;
	priority?: string;
	status?: string;
}

/** Shape returned by `GET /search` */
export interface KaneoSearchResponse {
	results: KaneoSearchResult[];
	totalCount: number;
	searchQuery: string;
}

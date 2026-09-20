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

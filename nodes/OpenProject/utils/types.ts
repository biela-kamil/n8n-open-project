export type OpenProjectElement = {
	id: number;
	identifier: string;
	name: string;
	active?: boolean;
	[key: string]: unknown;
};

export type OpenProjectTask = {
	id: number;
	subject: string;
	lockVersion: number;
	description: {
		raw: string;
		html: string;
	};
	_links: {
		project: {
			title: string;
		};
		type: {
			title: string;
		};
		priority: {
			title: string;
		};
		status: {
			title: string;
		};
		author: {
			title: string;
		};
	};
	_embedded: {
		parent?: OpenProjectTask;
	};
};

export type OpenProjectComment = {
	_type: 'Activity::Comment';
	id: number;
	createdAt: Date;
	comment: {
		raw: string;
	};
};

export type OpenProjectActivity = OpenProjectComment;

export type OpenProjectType = {
	id: string;
	name: string;
	position: number;
};

export type OpenProjectPriority = {
	id: string;
	name: string;
	position: number;
};

export type OpenProjectUser = {
	id: string;
	name: string;
	login: string;
	firstName: string;
	lastName: string;
	email: string;
	status: 'active' | 'registered' | 'locked' | 'invited';
	admin: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export type OpenProjectTypesCollection = {
	total: number;
	count: number;
	pageSize: number;
	offset: number;
	_embedded?: {
		elements?: OpenProjectType[];
	};
};

export type OpenProjectActivitiesCollection = {
	total: number;
	count: number;
	pageSize: number;
	offset: number;
	_embedded?: {
		elements?: OpenProjectActivity[];
	};
};

export type OpenProjectUsersCollection = {
	total: number;
	count: number;
	pageSize: number;
	offset: number;
	_embedded?: {
		elements?: OpenProjectUser[];
	};
};

export type OpenProjectStatus = {
	id: number;
	name: string;
};

export type OpenProjectStatusesCollection = {
	total: number;
	count: number;
	pageSize: number;
	offset: number;
	_embedded?: {
		elements?: OpenProjectStatus[];
	};
};

export type OpenProjectCollection = {
	total: number;
	count: number;
	pageSize: number;
	offset: number;
	_embedded?: {
		elements?: OpenProjectElement[];
	};
};

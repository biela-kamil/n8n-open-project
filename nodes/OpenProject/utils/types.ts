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
	description: {
		raw: string;
		html:string
	}
	"_links": {
		project: {
			title: string;
		}
		type: {
			title: string;
		}
		priority: {
			title: string;
		}
		status: {
			title: string;
		}
		author: {
			title: string;
		}
	}
}

export type OpenProjectType = {
	id: string
	name: string
	position: number
}
export type OpenProjectTypesCollection = {
	total: number;
	count: number;
	pageSize: number;
	offset: number;
	_embedded?: {
		elements?: OpenProjectType[];
	};
}

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
# OpenProject — Get Projects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add working "Get Many" projects operation (output) and a "select project" dropdown (listSearch) to the OpenProject n8n node, fetching from the OpenProject API.

**Architecture:** Fully programmatic. A shared transport (`openProjectRequest`) builds the request against the credential's base URL with Basic auth. The "Get Many" operation runs in the node's `execute()` method, paginating HAL+JSON collections (`_embedded.elements`) with Return All / Limit and optional filters. The dropdown reuses the same transport via `methods.listSearch.getProjects`.

**Tech Stack:** TypeScript, n8n-workflow, `@n8n/node-cli` (`n8n-node build`/`lint`). Node 22 via fnm (per project note — Node 26 breaks native builds).

---

## Notes for the implementer

- **No test framework exists in this repo.** Verification for every task = `npm run build` succeeds and `npm run lint` is clean. There is no `npm test`. Do not add a test framework — out of scope.
- **Node version:** run `fnm use` (project `.nvmrc` = 22) before any `npm` command if the shell defaults to a newer Node.
- **OpenProject API facts this plan relies on:**
  - Endpoint: `GET {url}/api/v3/projects`
  - Auth: Basic, username `apikey`, password = API token.
  - Response is a HAL Collection: `{ total, count, pageSize, offset, _embedded: { elements: [...] } }`.
  - Pagination params: `offset` (1-based page number) and `pageSize`.
  - Filter param: `filters` = JSON string, e.g. `[{"active":{"operator":"=","values":["t"]}}]`.

## File Structure

- Create: `nodes/OpenProject/utils/types.ts` — shared HAL response types.
- Create: `nodes/OpenProject/resources/projects/getAll.ts` — programmatic "Get Many" execution + filter builder.
- Modify: `credentials/OpenProjectApi.credentials.ts` — add `authenticate` (Basic) and `test`.
- Modify: `nodes/OpenProject/utils/request.ts` — base URL from credential, remove broken auth lookup + console.log.
- Modify: `nodes/OpenProject/projects/get.ts` — parse HAL, fix dropdown mapping + pagination.
- Modify: `nodes/OpenProject/resources/projects/index.ts` — operation without routing + `returnAll`/`limit`/`filters` properties.
- Modify: `nodes/OpenProject/OpenProject.node.ts` — add `execute()` dispatch, fix `methods.listSearch`.

---

## Task 0: Initialize git

The repo's `.git` is a broken 0-byte file, so commits fail. Fix it first so the rest of the plan can commit per task.

**Files:** none (repo-level)

- [ ] **Step 1: Remove the broken gitfile and init**

```bash
rm -f .git
git init
```

- [ ] **Step 2: Verify**

Run: `git status`
Expected: shows untracked files (no "invalid gitfile" error).

- [ ] **Step 3: Initial commit of current state**

```bash
git add -A
git commit -m "chore: initial commit of existing OpenProject node"
```

---

## Task 1: Shared HAL types

**Files:**
- Create: `nodes/OpenProject/utils/types.ts`

- [ ] **Step 1: Create the types file**

```typescript
export type OpenProjectElement = {
	id: number;
	identifier: string;
	name: string;
	active?: boolean;
	[key: string]: unknown;
};

export type OpenProjectCollection = {
	total: number;
	count: number;
	pageSize: number;
	offset: number;
	_embedded: {
		elements: OpenProjectElement[];
	};
};
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: PASS (no errors).

- [ ] **Step 3: Commit**

```bash
git add nodes/OpenProject/utils/types.ts
git commit -m "feat(openproject): add shared HAL collection types"
```

---

## Task 2: Wire credential authentication

**Files:**
- Modify: `credentials/OpenProjectApi.credentials.ts`

- [ ] **Step 1: Replace the whole file**

```typescript
import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from "n8n-workflow";

export class OpenProjectApi implements ICredentialType {
	name = 'openProjectApi';
	displayName = 'Open Project API';

	properties: INodeProperties[] = [
		{
			displayName: 'URL',
			name: 'url',
			type: 'string',
			placeholder: 'https://backlog.centrumosk.pl',
			default: '',
			description: 'Base URL of your OpenProject instance, without a trailing slash',
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Your OpenProject API key',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: 'apikey',
				password: '={{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.url}}',
			url: '/api/v3/configuration',
		},
	};
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add credentials/OpenProjectApi.credentials.ts
git commit -m "feat(openproject): add Basic auth and credential test"
```

---

## Task 3: Fix the transport helper

**Files:**
- Modify: `nodes/OpenProject/utils/request.ts`

- [ ] **Step 1: Replace the whole file**

```typescript
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
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add nodes/OpenProject/utils/request.ts
git commit -m "fix(openproject): build request URL from credential, drop dead auth lookup"
```

---

## Task 4: Fix the project dropdown (listSearch)

**Files:**
- Modify: `nodes/OpenProject/projects/get.ts`

- [ ] **Step 1: Replace the whole file**

```typescript
import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from "n8n-workflow";
import { openProjectRequest } from "../utils/request";
import type { OpenProjectCollection } from "../utils/types";

export async function getProjects(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	const page = paginationToken ? +paginationToken : 1;
	const pageSize = 100;

	const qs: Record<string, unknown> = { offset: page, pageSize };
	if (filter) {
		qs.filters = JSON.stringify([
			{ name_and_identifier: { operator: '~', values: [filter] } },
		]);
	}

	const response = (await openProjectRequest.call(
		this,
		'GET',
		'/projects',
		qs,
	)) as OpenProjectCollection;
	const elements = response._embedded?.elements ?? [];

	const results: INodeListSearchItems[] = elements.map((el) => ({
		name: el.name,
		value: el.id,
	}));

	const nextPaginationToken = page * pageSize < response.total ? page + 1 : undefined;
	return { results, paginationToken: nextPaginationToken };
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add nodes/OpenProject/projects/get.ts
git commit -m "fix(openproject): parse HAL elements in project dropdown"
```

---

## Task 5: Implement "Get Many" execution

**Files:**
- Create: `nodes/OpenProject/resources/projects/getAll.ts`

- [ ] **Step 1: Create the file**

```typescript
import type { IDataObject, IExecuteFunctions, INodeExecutionData } from "n8n-workflow";
import { openProjectRequest } from "../../utils/request";
import type { OpenProjectCollection, OpenProjectElement } from "../../utils/types";

function buildFilters(filters: IDataObject): string | undefined {
	const filterArray: IDataObject[] = [];

	if (filters.active && filters.active !== 'any') {
		filterArray.push({
			active: { operator: '=', values: [filters.active === 'active' ? 't' : 'f'] },
		});
	}

	if (filters.nameAndIdentifier) {
		filterArray.push({
			name_and_identifier: { operator: '~', values: [filters.nameAndIdentifier as string] },
		});
	}

	return filterArray.length > 0 ? JSON.stringify(filterArray) : undefined;
}

export async function getAll(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', itemIndex, false) as boolean;
	const limit = returnAll
		? Number.POSITIVE_INFINITY
		: (this.getNodeParameter('limit', itemIndex, 50) as number);

	const filters = buildFilters(this.getNodeParameter('filters', itemIndex, {}) as IDataObject);
	const pageSize = 100;
	let offset = 1;

	const collected: OpenProjectElement[] = [];

	while (collected.length < limit) {
		const qs: IDataObject = { offset, pageSize };
		if (filters) {
			qs.filters = filters;
		}

		const response = (await openProjectRequest.call(
			this,
			'GET',
			'/projects',
			qs,
		)) as OpenProjectCollection;
		const elements = response._embedded?.elements ?? [];
		collected.push(...elements);

		if (elements.length === 0 || collected.length >= response.total) {
			break;
		}
		offset += 1;
	}

	const limited = returnAll ? collected : collected.slice(0, limit);
	return limited.map((element) => ({ json: element as IDataObject }));
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: PASS. (The function is not yet referenced anywhere — that is fine; it is wired in Task 7.)

- [ ] **Step 3: Commit**

```bash
git add nodes/OpenProject/resources/projects/getAll.ts
git commit -m "feat(openproject): add paginated Get Many projects execution"
```

---

## Task 6: Update operation properties

**Files:**
- Modify: `nodes/OpenProject/resources/projects/index.ts`

- [ ] **Step 1: Replace the whole file**

```typescript
import { INodeProperties } from "n8n-workflow";

const showOnlyForProjects = {
	resource: ['project'],
};

const showOnlyForProjectsGetAll = {
	resource: ['project'],
	operation: ['getAll'],
};

export const projectsDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForProjects },
		default: 'getAll',
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many projects',
				description: 'Get many projects from OpenProject',
			},
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: showOnlyForProjectsGetAll },
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: { ...showOnlyForProjectsGetAll, returnAll: [false] },
		},
		typeOptions: { minValue: 1 },
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: { show: showOnlyForProjectsGetAll },
		default: {},
		options: [
			{
				displayName: 'Active',
				name: 'active',
				type: 'options',
				options: [
					{ name: 'Any', value: 'any' },
					{ name: 'Active Only', value: 'active' },
					{ name: 'Inactive', value: 'inactive' },
				],
				default: 'any',
				description: 'Filter projects by their active state',
			},
			{
				displayName: 'Name or Identifier',
				name: 'nameAndIdentifier',
				type: 'string',
				default: '',
				description: 'Return only projects whose name or identifier contains this text',
			},
		],
	},
];
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add nodes/OpenProject/resources/projects/index.ts
git commit -m "feat(openproject): add returnAll/limit/filters props to Get Many"
```

---

## Task 7: Wire execute() and listSearch into the node

**Files:**
- Modify: `nodes/OpenProject/OpenProject.node.ts`

- [ ] **Step 1: Replace the whole file**

```typescript
import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
	NodeOperationError,
} from "n8n-workflow";
import { projectsDescription } from './resources/projects';
import { getProjects } from "./projects/get";
import { getAll } from "./resources/projects/getAll";

export class OpenProject implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Open Project',
		name: 'open-project',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Open Project Node',
		defaults: {
			name: 'Open Project',
		},
		credentials: [
			{
				name: 'openProjectApi',
				required: true,
			},
		],
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Project', value: 'project' },
					{ name: 'Task', value: 'task' },
				],
				default: 'project',
			},
			...projectsDescription,
		],
	};

	methods = {
		listSearch: {
			getProjects,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			if (resource === 'project' && operation === 'getAll') {
				const projects = await getAll.call(this, i);
				returnData.push(...projects);
			} else {
				throw new NodeOperationError(
					this.getNode(),
					`Unsupported operation: ${resource} / ${operation}`,
					{ itemIndex: i },
				);
			}
		}

		return [returnData];
	}
}
```

- [ ] **Step 2: Verify build and lint**

Run: `npm run build && npm run lint`
Expected: PASS, clean lint.

- [ ] **Step 3: Commit**

```bash
git add nodes/OpenProject/OpenProject.node.ts
git commit -m "feat(openproject): wire Get Many execute and project listSearch"
```

---

## Task 8: Final verification

- [ ] **Step 1: Clean build + lint**

Run: `npm run build && npm run lint`
Expected: both PASS.

- [ ] **Step 2 (manual, optional): Smoke test in n8n**

If an n8n instance with this node is available:
1. Create an `Open Project API` credential (URL + API token), click **Test** → should succeed.
2. Add the node, Resource = Project, Operation = Get Many, Return All = on → run → returns all projects as items.
3. Turn Return All off, Limit = 5 → returns at most 5.
4. Add Filter → Active = Active Only → returns only active projects.
5. In a node that uses the project dropdown, confirm projects load and are searchable.

## Spec coverage check

- Credential auth wiring → Task 2.
- Transport base URL + cleanup → Task 3.
- Get Many output operation (Return All + Limit) → Tasks 5, 6, 7.
- HAL pagination → Tasks 4 (dropdown), 5 (Get Many).
- Dropdown listSearch fix + `id` value → Tasks 4, 7.
- Filters (Active, Name/Identifier) → Tasks 5, 6.
- Build-based verification (no test framework) → every task + Task 8.
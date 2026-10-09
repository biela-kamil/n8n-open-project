import spec from './fixtures/kaneo-openapi.json';

interface Schema {
	type?: string;
	enum?: unknown[];
	minimum?: number;
	maximum?: number;
	minLength?: number;
	maxLength?: number;
	maxItems?: number;
	required?: string[];
	properties?: Record<string, Schema>;
	items?: Schema;
}

interface Param {
	name: string;
	in: 'path' | 'query' | 'header';
	required?: boolean;
	schema: Schema;
}

type Operation = { parameters: Param[]; body?: Schema };

const paths = spec.paths as unknown as Record<string, Record<string, Operation>>;

/**
 * Picks the template for a request. Prefers templates that define the method (the spec has
 * `/comment/{taskId}` and `/comment/{id}` side by side) and then the most specific one, so
 * `/label/task/{taskId}` wins over `/label/{id}/task`.
 */
function matchPath(method: string, path: string): string | undefined {
	return Object.keys(paths)
		.filter((template) =>
			new RegExp('^' + template.replace(/\{[^}]+\}/g, '[^/]+') + '$').test(path),
		)
		.filter((template) => method in paths[template])
		.sort((a, b) => (a.match(/\{/g)?.length ?? 0) - (b.match(/\{/g)?.length ?? 0))[0];
}

function validateValue(label: string, value: unknown, schema: Schema, inQuery = false): string[] {
	const errors: string[] = [];
	const { type, enum: allowed, minimum, maximum, minLength, maxLength, maxItems } = schema;

	if (type === 'integer' && !Number.isInteger(Number(value))) {
		errors.push(`"${label}" must be an integer, got ${String(value)}`);
	}
	// Query values are serialised to strings on the wire, so any scalar is a valid string
	if (type === 'string' && !inQuery && typeof value !== 'string') {
		errors.push(`"${label}" must be a string, got ${JSON.stringify(value)}`);
	}
	if (type === 'array' && !Array.isArray(value)) {
		errors.push(`"${label}" must be an array, got ${JSON.stringify(value)}`);
	}
	if (allowed && !allowed.includes(value)) {
		errors.push(`"${label}" must be one of ${allowed.join(', ')}, got ${String(value)}`);
	}
	if (minimum !== undefined && Number(value) < minimum) {
		errors.push(`"${label}" must be >= ${minimum}, got ${String(value)}`);
	}
	if (maximum !== undefined && Number(value) > maximum) {
		errors.push(`"${label}" must be <= ${maximum}, got ${String(value)}`);
	}
	if (typeof value === 'string') {
		if (minLength !== undefined && value.length < minLength) {
			errors.push(`"${label}" must be at least ${minLength} characters`);
		}
		if (maxLength !== undefined && value.length > maxLength) {
			errors.push(`"${label}" must be at most ${maxLength} characters`);
		}
	}
	if (Array.isArray(value) && maxItems !== undefined && value.length > maxItems) {
		errors.push(`"${label}" must have at most ${maxItems} items`);
	}
	return errors;
}

function validateBody(body: unknown, schema: Schema): string[] {
	if (typeof body !== 'object' || body === null || Array.isArray(body)) {
		return ['Body must be a JSON object'];
	}
	const record = body as Record<string, unknown>;
	const errors: string[] = [];
	for (const name of schema.required ?? []) {
		// null/undefined are rejected by the API for required fields; empty strings are valid
		if (record[name] === undefined || record[name] === null) {
			errors.push(`Missing required body field "${name}"`);
		}
	}
	for (const [name, value] of Object.entries(record)) {
		const property = schema.properties?.[name];
		// Kaneo strips unknown body fields instead of rejecting them, so only known ones are checked
		if (!property) continue;
		if (value === null || value === undefined) {
			errors.push(`Body field "${name}" must not be ${String(value)}`);
			continue;
		}
		errors.push(...validateValue(name, value, property));
	}
	return errors;
}

/**
 * Validates a request the way the real Kaneo API would reject it (HTTP 400):
 * unknown path/method, missing required params, wrong types, values out of range,
 * and request bodies that break the schema. Returns a list of problems; empty means
 * the request is valid per the OpenAPI spec.
 */
export function validateRequest(
	method: string,
	url: string,
	qs: Record<string, unknown> = {},
	body?: unknown,
): string[] {
	const path = new URL(url).pathname.replace(/^\/api/, '');
	const template = matchPath(method.toLowerCase(), path);
	if (!template) return [`No ${method} endpoint for ${path}`];
	const op = paths[template][method.toLowerCase()];

	const errors: string[] = [];
	const queryParams = op.parameters.filter((p) => p.in === 'query');

	for (const p of queryParams) {
		if (p.required && qs[p.name] === undefined) {
			errors.push(`Missing required query param "${p.name}"`);
		}
	}
	for (const [name, value] of Object.entries(qs)) {
		const p = queryParams.find((q) => q.name === name);
		if (!p) errors.push(`Unknown query param "${name}"`);
		else errors.push(...validateValue(name, value, p.schema, true));
	}

	if (op.body) errors.push(...validateBody(body, op.body));
	else if (body !== undefined) errors.push(`${method} ${template} does not accept a body`);

	return errors;
}

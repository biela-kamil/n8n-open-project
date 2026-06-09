import {
    type IDataObject,
    ILoadOptionsFunctions,
    type INodeListSearchItems,
    type INodeListSearchResult
} from "n8n-workflow";
import {buildProjectFilters} from "../../utils/filters";
import {openProjectRequest} from "../../utils/request";
import { OpenProjectTypesCollection} from "../../utils/types";


export async function getTypes(
    this: ILoadOptionsFunctions,
    filter?: string,
    paginationToken?: string
): Promise<INodeListSearchResult> {
    const page = paginationToken ? +paginationToken : 1;
    const pageSize = 100;
    const project = this.getCurrentNodeParameter('project', { extractValue: true }) as string;

    const qs: IDataObject = { offset: page, pageSize };

    const filters = buildProjectFilters({ nameAndIdentifier: filter });
    if (filters) {
        qs.filters = filters;
    }

    const response = (await openProjectRequest.call(
        this,
        'GET',
        `/projects/${project}/types`,
        qs,
    )) as OpenProjectTypesCollection;
    const elements = response._embedded?.elements ?? [];

    const results: INodeListSearchItems[] = elements.map((el) => ({
        name: el.name,
        value: el.id,
    }));

    const nextPaginationToken = page * pageSize < response.total ? page + 1 : undefined;
    return { results, paginationToken: nextPaginationToken };
}
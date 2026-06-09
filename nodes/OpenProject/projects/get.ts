import type {ILoadOptionsFunctions, INodeListSearchItems, INodeListSearchResult} from "n8n-workflow";
import {openProjectRequest} from "../utils/request";

type ProjectItem = {
    id: number;
name: string;
};

type ProjectsResponse = {
    items: ProjectItem[];
    total_count: number;
};


export async function getProjects(
    this: ILoadOptionsFunctions,
    filter?: string,
    paginationToken?: string,
): Promise<INodeListSearchResult> {
    const page = paginationToken ? +paginationToken : 1;
    const per_page = 100;

    let responseData: ProjectsResponse = {
        items: [],
        total_count: 0,
    };

    responseData = await openProjectRequest.call(this, 'GET', '/projects')

    const results: INodeListSearchItems[] = responseData.items.map((item: ProjectItem) => ({
        name: item.title,
        value: item.number,
        url: item.html_url,
    }));

    const nextPaginationToken = page * per_page < responseData.total_count ? page + 1 : undefined;
    return { results, paginationToken: nextPaginationToken };
}
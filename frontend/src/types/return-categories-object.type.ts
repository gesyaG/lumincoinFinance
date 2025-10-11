export type ReturnCategoriesObjectType = {
    error: boolean,
    categories: Array<CategoriesType> | null,
}

export type CategoriesType = {
    id: number;
    title: string;
}
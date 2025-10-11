import { CustomHttp } from "./custom-http";
import {ReturnCategoriesObjectType} from "../types/return-categories-object.type";
import {DataCategoryType} from "../types/data-category.type";
import {CategoryType} from "../types/category.type";

export class IncomeService {
    public static async getIncomeCategories(): Promise<ReturnCategoriesObjectType>   {
        const returnObject: ReturnCategoriesObjectType = {
            error: false,
            categories: null,
        };


        const result: ReturnCategoriesObjectType  = await CustomHttp.request('/categories/income');

        if (!result || !Array.isArray(result)) {
            returnObject.error = true;
            return returnObject;
        }

        returnObject.categories = result;
        return returnObject;
    }

    public static async deleteIncomeCategory(id: number): Promise<CategoryType> {
        try {
            return await CustomHttp.request(
                `/categories/income/${id}`,
                'DELETE'
            );
        } catch (e) {
            console.error('Ошибка удаления категории:', e);
            return {
                error: true,
                message: 'Ошибка удаления категории',
            };
        }
    }

    public static async createIncomeCategory(data: DataCategoryType): Promise<CategoryType>  {
        try {
            const result: CategoryType = await CustomHttp.request('/categories/income', 'POST', data);

            if (result.error) {
                return {
                    error: true,
                    message: result.message || 'Возникла ошибка при добавлении категории',
                };
            }

            return {
                error: false,
                title: result.title,
            };
        } catch (e) {
            return {
                error: true,
                message: 'Ошибка сети или сервера',
            };
        }
    }

    public static async getIncomeCategory(id: number): Promise<CategoryType>  {
     try {
            const result: CategoryType = await CustomHttp.request('/categories/income/' + id);

            if (result.error) {
                return {
                    error: true,
                    message: result.message || 'Возникла ошибка при запросе категории',
                };
            }

            return {
                error: false,
                title: result.title,
            };
        } catch (e) {
            return {
                error: true,
                message: 'Ошибка сети или сервера',
            };
        }
    }

    public static async editIncomeCategory(id: number, data: DataCategoryType): Promise<CategoryType> {
        try {
            const result: CategoryType = await CustomHttp.request('/categories/income/' + id, 'PUT', data);

            if (result.error) {
            return {
                error: true,
                message: result.message || 'Ошибка при обновлении категории',
            };
            }

            return { error: false, title: result.toString() };
        } catch (e) {
            return { error: true, message: 'Ошибка сети или сервера' };
        }
    }
}
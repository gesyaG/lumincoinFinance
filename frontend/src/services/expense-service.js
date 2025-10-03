import { CustomHttp } from "./custom-http.js";

export class ExpenseService {
    static async getExpenseCategories() {
        const returnObject = {
            error: false,
            categories: null,
        };

        try {
            const result = await CustomHttp.request('/categories/expense');

            if (!result || !Array.isArray(result)) {
                returnObject.error = 'Ошибка при запросе категорий расхода. Обратитесь в поддержку';
                return returnObject;
            }

            returnObject.categories = result;
            return returnObject;

        } catch (e) {
            returnObject.error = e.message || 'Неизвестная ошибка';
            return returnObject;
        }
    }

    static async deleteExpenseCategory(id) {
        try {
            return await CustomHttp.request(
                `/categories/expense/${id}`,
                'DELETE'
            );
        } catch (e) {
            console.error('Ошибка удаления категории:', e);
            return null;
        }
    }

    static async createExpenseCategory(data) {
        try {
            const result = await CustomHttp.request('/categories/expense', 'POST', data);

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

    static async getExpenseCategory(id) {
     try {
            const result = await CustomHttp.request('/categories/expense/' + id);

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

    static async editExpenseCategory(id, data) {
        try {
            const result = await CustomHttp.request('/categories/expense/' + id, 'PUT', data);

            if (result.error) {
            return {
                error: true,
                message: result.message || 'Ошибка при обновлении категории',
            };
            }

            return { error: false, category: result };
        } catch (e) {
            return { error: true, message: 'Ошибка сети или сервера' };
        }
    }

}

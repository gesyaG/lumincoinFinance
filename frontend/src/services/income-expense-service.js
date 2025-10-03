import { CustomHttp } from "./custom-http.js";

export class IncomeExpenseService {
    static async getIncomeExpense(params = {}) {
        try {
            const query = new URLSearchParams(params).toString();
            let url = '/operations';
            if (query) url = `/operations?period=interval&${query}`;
            if (params._noCache) url += (url.includes('?') ? '&' : '?') + `_=${Date.now()}`;

            const result = await CustomHttp.request(url);
            if (!Array.isArray(result)) {
                return { error: true, message: 'Ошибка при запросе операций' };
            }
            return { error: false, records: result };
        } catch {
            return { error: true, message: 'Ошибка сети или сервера' };
        }
    }

    static async getOperation(id, noCache = true) {
        try {
            let url = `/operations/${id}`;
            if (noCache) url += `?_=${Date.now()}`;

            const result = await CustomHttp.request(url);
            if (!result || typeof result !== 'object') {
                return { error: true, message: 'Ошибка при запросе операции' };
            }
            return { error: false, record: result };
        } catch {
            return { error: true, message: 'Ошибка сети или сервера' };
        }
    }

    static async createIncomeExpense(data) {
        try {
            const result = await CustomHttp.request('/operations', 'POST', data);
            if (result.error) {
                return { error: true, message: result.message || 'Ошибка при создании операции' };
            }
            return { error: false, record: result };
        } catch {
            return { error: true, message: 'Ошибка сети или сервера' };
        }
    }

    static async deleteIncomeExpense(id) {
        try {
            const result = await CustomHttp.request(`/operations/${id}`, 'DELETE');
            if (result?.error) {
                return { error: true, message: result.message || 'Ошибка при удалении операции' };
            }
            return { error: false };
        } catch {
            return { error: true, message: 'Ошибка сети или сервера' };
        }
    }

    static async updateIncomeExpense(id, data) {
        try {
            const result = await CustomHttp.request(`/operations/${id}`, 'PUT', data);
            if (result?.error) {
                return { error: true, message: result.message || 'Ошибка при обновлении операции' };
            }
            return { error: false, record: result };
        } catch {
            return { error: true, message: 'Ошибка сети или сервера' };
        }
    }
}
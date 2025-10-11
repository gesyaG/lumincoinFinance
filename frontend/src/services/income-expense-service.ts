import { CustomHttp } from "./custom-http";
import {IncomeExpenseListType} from "../types/income-expense-list.type";
import {IncomeExpenseRecordsReturnType} from "../types/income-expense-records-return.type";
import {GetIncomeExpenseParams} from "../types/get-income-expense-params.type";
import {DataRecordsType} from "../types/data-records.type";

export class IncomeExpenseService {
    public static async getIncomeExpense(params:GetIncomeExpenseParams = {}): Promise<IncomeExpenseRecordsReturnType> {
        try {
            const query: string = new URLSearchParams(params).toString();
            let url: string = '/operations';
            if (query) url = `/operations?period=interval&${query}`;
            if (params._noCache) url += (url.includes('?') ? '&' : '?') + `_=${Date.now()}`;

            const result: IncomeExpenseListType[] = await CustomHttp.request(url);
            if (!Array.isArray(result)) {
                return { error: true, message: 'Ошибка при запросе операций' };
            }
            return { error: false, records: result };
        } catch {
            return { error: true, message: 'Ошибка сети или сервера' };
        }
    }

    public static async getOperation(id: number, noCache: boolean = true): Promise<IncomeExpenseRecordsReturnType> {
        try {
            let url: string = `/operations/${id}`;
            if (noCache) url += `?_=${Date.now()}`;

            const result: IncomeExpenseListType = await CustomHttp.request(url);
            if (!result || typeof result !== 'object') {
                return { error: true, message: 'Ошибка при запросе операции' };
            }
            return { error: false, record: result };
        } catch {
            return { error: true, message: 'Ошибка сети или сервера' };
        }
    }

    public static async createIncomeExpense(data: DataRecordsType): Promise<IncomeExpenseRecordsReturnType> {
        try {
            const result: IncomeExpenseListType = await CustomHttp.request('/operations', 'POST', data);
            if (!result || typeof result !== 'object') {
                return { error: true, message: 'Ошибка при создании операции' };
            }
            return { error: false, record: result };
        } catch {
            return { error: true, message: 'Ошибка сети или сервера' };
        }
    }

    public static async deleteIncomeExpense(id: number): Promise<IncomeExpenseRecordsReturnType> {
        try {
            const result: IncomeExpenseListType = await CustomHttp.request(`/operations/${id}`, 'DELETE');
            if (!result || typeof result !== 'object') {
                return { error: true, message: 'Ошибка при удалении операции' };
            }
            return { error: false };
        } catch {
            return { error: true, message: 'Ошибка сети или сервера' };
        }
    }

    public static async updateIncomeExpense(id: number, data: DataRecordsType): Promise<IncomeExpenseRecordsReturnType> {
        try {
            const result: IncomeExpenseListType = await CustomHttp.request(`/operations/${id}`, 'PUT', data);
            if (!result || typeof result !== 'object') {
                return { error: true, message: 'Ошибка при обновлении операции' };
            }
            return { error: false, record: result };
        } catch {
            return { error: true, message: 'Ошибка сети или сервера' };
        }
    }
}
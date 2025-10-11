import {IncomeExpenseListType} from "./income-expense-list.type";

export type IncomeExpenseRecordsReturnType = {
    error: boolean,
    message?: string,
    records?: IncomeExpenseListType[],
    record?: IncomeExpenseListType
}
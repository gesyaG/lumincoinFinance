export type IncomeExpenseListType = {
    "id": boolean,
    "user_id": boolean,
    "category_expense_id": number | null,
    "category_income_id": number | null,
    "type": string,
    "amount": number,
    "date": string,
    "comment": string,
    "category" : string,
}
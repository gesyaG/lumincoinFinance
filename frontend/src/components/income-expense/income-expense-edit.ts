import {IncomeExpenseService} from "../../services/income-expense-service";
import {IncomeService} from "../../services/income-service";
import {ExpenseService} from "../../services/expense-service";
import {UrlUtils} from "../../utils/url-utils";
import {IncomeExpenseRecordsReturnType} from "../../types/income-expense-records-return.type";
import {IncomeExpenseListType} from "../../types/income-expense-list.type";
import {CategoriesType, ReturnCategoriesObjectType} from "../../types/return-categories-object.type";
import {DataRecordsType} from "../../types/data-records.type";
import {ConstructorGeneric} from "../../utils/constructor-generic";

export class IncomeExpenseEdit {
    readonly openNewRoute: () => Promise<void>;
    readonly typeInput: HTMLInputElement | null;
    readonly categoryInput: HTMLSelectElement | null;
    readonly amountInput: HTMLInputElement | null;
    readonly dateInput: HTMLInputElement | null;
    readonly commentInput: HTMLInputElement | null;
    readonly saveBtn: HTMLElement | null;
    readonly cancelBtn: HTMLElement | null;
    readonly errorType: HTMLElement | null;
    readonly errorCategory: HTMLElement | null;
    readonly errorAmount: HTMLElement | null;
    readonly errorDate: HTMLElement | null;
    readonly errorComment: HTMLElement | null;
    readonly operationId: number | null;

    constructor(openNewRoute: () => Promise<void>) {
        this.openNewRoute = openNewRoute;

        this.typeInput = ConstructorGeneric.getElementById<HTMLInputElement>('edit-type');
        this.categoryInput = ConstructorGeneric.getElementById<HTMLSelectElement>('edit-category');
        this.amountInput = ConstructorGeneric.getElementById<HTMLInputElement>('edit-amount');
        this.dateInput = ConstructorGeneric.getElementById<HTMLInputElement>('edit-date');
        this.commentInput = ConstructorGeneric.getElementById<HTMLInputElement>('edit-comment');
        this.saveBtn = ConstructorGeneric.getElementById<HTMLButtonElement>('button-save');
        this.cancelBtn = ConstructorGeneric.getElementById<HTMLButtonElement>('button-cancel');
        this.operationId = null;
        this.errorType = ConstructorGeneric.getElementById<HTMLDivElement>("error-type");
        this.errorCategory = ConstructorGeneric.getElementById<HTMLDivElement>("error-category");
        this.errorAmount = ConstructorGeneric.getElementById<HTMLDivElement>("error-amount");
        this.errorDate = ConstructorGeneric.getElementById<HTMLDivElement>("error-date");
        this.errorComment = ConstructorGeneric.getElementById<HTMLDivElement>("error-comment");

        this.operationId = Number(UrlUtils.getUrlParam('id'));
        if (!this.operationId) {
            return;
        }

        this.typeInput.addEventListener('change', () => {
            if (this.typeInput) {
                this.loadCategories(this.typeInput.value);
                if (this.categoryInput) {
                    this.categoryInput.value = '';
                }
            }
        });

        this.loadOperation();
        this.initBtnEvents();
    }

    private async loadOperation(): Promise<void> {
        if (this.operationId !== null) {
            const res: IncomeExpenseRecordsReturnType = await IncomeExpenseService.getOperation(this.operationId, true);
            if (res.error || !res.record) return;
            const operation: IncomeExpenseListType = res.record;
            if (this.typeInput && this.categoryInput && this.amountInput && this.dateInput && this.commentInput) {
                this.typeInput.value = operation.type;

                await this.loadCategories(operation.type);

                const option: HTMLOptionElement | undefined = Array.from(this.categoryInput.options)
                    .find(opt => opt.textContent.trim() === operation.category?.trim());
                if (option) this.categoryInput.value = option.value;

                this.amountInput.value = operation.amount.toString();
                this.dateInput.value = operation.date;
                this.commentInput.value = operation.comment || "";
            }
        }
    }

    private async loadCategories(type: string | null): Promise<void> {
        if (this.categoryInput) {
            this.categoryInput.innerHTML = '<option value="">Выберите категорию...</option>';
            const response: ReturnCategoriesObjectType = type === "income"
                ? await IncomeService.getIncomeCategories()
                : await ExpenseService.getExpenseCategories();

            if (response.error) return;

            const categories: CategoriesType[] = response.categories || [];
            categories.forEach(category => {
                const option: HTMLOptionElement = document.createElement("option");
                option.value = String(category.id ?? category.id);
                option.textContent = category.title ?? category.title;
                if (this.categoryInput) {
                    this.categoryInput.appendChild(option);
                }
            });
        }
    }

    private validate(type: string, category_id: number, amount: number, date: string, comment: string): boolean | undefined {
        let hasError: boolean = false;

        if (this.errorType && this.errorCategory && this.errorAmount && this.errorDate && this.errorComment) {
            this.errorType.style.display = "none";
            this.errorCategory.style.display = "none";
            this.errorAmount.style.display = "none";
            this.errorDate.style.display = "none";
            this.errorComment.style.display = "none";

            if (!type) {
                this.errorType.innerText = "Выберите тип!";
                this.errorType.style.display = "block";
                hasError = true;
            }
            if (isNaN(category_id)) {
                this.errorCategory.innerText = "Выберите категорию!";
                this.errorCategory.style.display = "block";
                hasError = true;
            }
            if (!amount || amount <= 0 || Number.isNaN(amount)) {
                this.errorAmount.innerText = "Введите корректную сумму!";
                this.errorAmount.style.display = "block";
                hasError = true;
            }
            if (!date) {
                this.errorDate.innerText = "Выберите дату!";
                this.errorDate.style.display = "block";
                hasError = true;
            }
            if (!comment || !comment.trim()) {
                this.errorComment.innerText = "Комментарий обязателен!";
                this.errorComment.style.display = "block";
                hasError = true;
            }

            return !hasError;
        }
    }

    private initBtnEvents(): void {
        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', async () => {
                if (this.typeInput && this.categoryInput && this.amountInput && this.dateInput && this.commentInput) {
                    const type: string = this.typeInput.value;
                    const category_id: number = parseInt(this.categoryInput.value, 10);
                    const amount: number = parseFloat(this.amountInput.value);
                    const date: string = this.dateInput.value;
                    const comment: string = this.commentInput.value.trim();

                    if (!this.validate(type, category_id, amount, date, comment)) return;

                    const editData = {type, category_id, amount, date, comment};
                    if (this.operationId) {
                        const response: IncomeExpenseRecordsReturnType = await IncomeExpenseService.updateIncomeExpense(this.operationId, editData as DataRecordsType);
                        if (!response.error) {
                            window.location.hash = '#/income-expense';
                        }
                    }
                }
            })
        }

        if (this.cancelBtn) {
            this.cancelBtn.addEventListener('click', () => {
                window.location.hash = '#/income-expense';
            });
        }
    }
}
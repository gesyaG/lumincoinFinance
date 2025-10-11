import {IncomeExpenseService} from "../../services/income-expense-service";
import {IncomeService} from "../../services/income-service";
import {ExpenseService} from "../../services/expense-service";
import {IncomeExpenseRecordsReturnType} from "../../types/income-expense-records-return.type";
import {DataRecordsType} from "../../types/data-records.type";

export class IncomeExpenseCreate {
    readonly openNewRoute: () => Promise<void>;
    readonly typeInput: HTMLInputElement | null;
    readonly categoryInput: HTMLInputElement | null;
    readonly amountInput: HTMLInputElement | null;
    readonly dateInput: HTMLInputElement | null;
    readonly commentInput: HTMLInputElement | null;
    readonly createBtn: HTMLElement | null;
    readonly cancelBtn: HTMLElement | null;
    readonly errorType: HTMLElement | null;
    readonly errorCategory: HTMLElement | null;
    readonly errorAmount: HTMLElement | null;
    readonly errorDate: HTMLElement | null;
    readonly errorComment: HTMLElement | null;

    constructor(openNewRoute: () => Promise<void>) {
        this.openNewRoute = openNewRoute;

        this.typeInput = document.getElementById('input-type') as HTMLInputElement;
        this.categoryInput = document.getElementById('input-category') as HTMLInputElement;
        this.amountInput = document.getElementById('input-amount') as HTMLInputElement;
        this.dateInput = document.getElementById('input-date') as HTMLInputElement;
        this.commentInput = document.getElementById('input-comment') as HTMLInputElement;
        this.createBtn = document.getElementById('button-create');
        this.cancelBtn = document.getElementById('button-cancel');

        this.errorType = document.getElementById('error-type');
        this.errorCategory = document.getElementById('error-category');
        this.errorAmount = document.getElementById('error-amount');
        this.errorDate = document.getElementById('error-date');
        this.errorComment = document.getElementById('error-comment');

        this.initDatePlaceholder();
        this.initTypeFromRoute();
        this.initTypeChange();
        this.initLiveValidation();
        this.initBtnEvents();
    }

    private initDatePlaceholder(): void {
        if (!this.dateInput) return;
        this.dateInput.type = "text";
        this.dateInput.placeholder = "Выберите дату...";
        this.dateInput.addEventListener("focus", () => {
            if (this.dateInput) {
                this.dateInput.type = "date";
            }
        });
        this.dateInput.addEventListener("blur", () => {
            if (this.dateInput) {
                if (!this.dateInput.value) {
                    this.dateInput.type = "text";
                    this.dateInput.placeholder = "Выберите дату...";
                }
            }
        });
    }

    private async initTypeFromRoute(): Promise<void> {
        const params = new URLSearchParams(window.location.hash.split('?')[1]);
        const type: string | null = params.get('type');

        if (type === 'income' && this.typeInput) {
            this.typeInput.value = 'income';
            await this.loadCategories('income');
        } else if (type === 'expense' && this.typeInput) {
            this.typeInput.value = 'expense';
            await this.loadCategories('expense');
        }
    }

    private initTypeChange(): void {
        if (this.typeInput) {
            this.typeInput.addEventListener("change", async () => {
                if (this.typeInput) {
                    const type: string | null = this.typeInput.value;
                    if (type === "income") {
                        await this.loadCategories("income");
                    } else if (type === "expense") {
                        await this.loadCategories("expense");
                    }
                }
            });
        }
    }

    private async loadCategories(type: string | null): Promise<void> {
        if (this.categoryInput) {
            this.categoryInput.innerHTML = `<option value="">Выберите категорию...</option>`;
            let response;

            if (type === "income") {
                response = await IncomeService.getIncomeCategories();
            } else {
                response = await ExpenseService.getExpenseCategories();
            }

            if (!response.error && response.categories) {
                response.categories.forEach(category => {
                    const option: HTMLOptionElement | null = document.createElement("option");
                    option.value = category.id.toString();
                    option.textContent = category.title;
                    if (this.categoryInput) {
                        this.categoryInput.appendChild(option);
                    }
                });
            }
        }
    }

    private clearError(input: HTMLInputElement, errorEl: HTMLInputElement): void {
        input.classList.remove('input-error');
        errorEl.style.display = 'none';
        errorEl.innerText = '';
    }

    private showError(input: HTMLInputElement, errorEl: HTMLInputElement, message: string): void {
        input.classList.add('input-error');
        errorEl.innerText = message;
        errorEl.style.display = 'block';
    }

    private initLiveValidation(): void {
        if (this.typeInput && this.categoryInput && this.amountInput && this.dateInput && this.commentInput) {
            this.typeInput.addEventListener("change", () => this.clearError(<HTMLInputElement>this.typeInput, <HTMLInputElement>this.errorType));
            this.categoryInput.addEventListener("change", () => this.clearError(<HTMLInputElement>this.categoryInput, <HTMLInputElement>this.errorCategory));
            this.amountInput.addEventListener("input", () => this.clearError(<HTMLInputElement>this.amountInput, <HTMLInputElement>this.errorAmount));
            this.dateInput.addEventListener("input", () => this.clearError(<HTMLInputElement>this.dateInput, <HTMLInputElement>this.errorDate));
            this.commentInput.addEventListener("input", () => this.clearError(<HTMLInputElement>this.commentInput, <HTMLInputElement>this.errorComment));
        }
    }

    private initBtnEvents(): void {
        if (this.createBtn) {
            this.createBtn.addEventListener('click', async () => {
                let hasError: boolean = false;
                if (this.typeInput && this.categoryInput && this.amountInput && this.dateInput && this.commentInput) {
                    const type: string = this.typeInput.value;
                    const category_id: number = parseInt(this.categoryInput.value, 10);
                    const amount: number = parseFloat(this.amountInput.value);
                    const date: string = this.dateInput.value;
                    const comment: string = this.commentInput.value;

                    if (!type) {
                        this.showError(this.typeInput, <HTMLInputElement>this.errorType, "Выберите тип операции");
                        hasError = true;
                    }
                    if (!category_id) {
                        this.showError(this.categoryInput, <HTMLInputElement>this.errorCategory, "Выберите категорию");
                        hasError = true;
                    }
                    if (!amount || amount <= 0) {
                        this.showError(this.amountInput, <HTMLInputElement>this.errorAmount, "Введите сумму больше 0");
                        hasError = true;
                    }
                    if (!date) {
                        this.showError(this.dateInput, <HTMLInputElement>this.errorDate, "Выберите дату");
                        hasError = true;
                    }
                    if (!comment.trim()) {
                        this.showError(this.commentInput, <HTMLInputElement>this.errorComment, "Комментарий не может быть пустым");
                        hasError = true;
                    }

                    if (hasError) return;

                    const createData = {type, category_id, amount, date, comment};
                    const response: IncomeExpenseRecordsReturnType = await IncomeExpenseService.createIncomeExpense(createData as DataRecordsType);

                    if (response.error) {
                        this.showError(this.typeInput, <HTMLInputElement>this.errorType, response.message || "Ошибка при создании операции");
                        return;
                    }

                    window.location.hash = '#/income-expense';
                }
            });
        }
        if (this.cancelBtn) {
            this.cancelBtn.addEventListener('click', () => {
                window.location.hash = `#/income-expense`;
            });
        }
    }
}
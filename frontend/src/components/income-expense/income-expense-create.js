import { IncomeExpenseService } from "../../services/income-expense-service.js";
import { IncomeService } from "../../services/income-service.js";
import { ExpenseService } from "../../services/expense-service.js";

export class IncomeExpenseCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.typeInput = document.getElementById('input-type');
        this.categoryInput = document.getElementById('input-category');
        this.amountInput = document.getElementById('input-amount');
        this.dateInput = document.getElementById('input-date');
        this.commentInput = document.getElementById('input-comment');
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

    initDatePlaceholder() {
        this.dateInput.type = "text";
        this.dateInput.placeholder = "Выберите дату...";
        this.dateInput.addEventListener("focus", () => {
            this.dateInput.type = "date";
        });
        this.dateInput.addEventListener("blur", () => {
            if (!this.dateInput.value) {
                this.dateInput.type = "text";
                this.dateInput.placeholder = "Выберите дату...";
            }
        });
    }

    async initTypeFromRoute() {
        const params = new URLSearchParams(window.location.hash.split('?')[1]);
        const type = params.get('type');

        if (type === 'income') {
            this.typeInput.value = 'income';
            await this.loadCategories('income');
        } else if (type === 'expense') {
            this.typeInput.value = 'expense';
            await this.loadCategories('expense');
        }
    }

    initTypeChange() {
        this.typeInput.addEventListener("change", async () => {
            const type = this.typeInput.value;
            if (type === "income") {
                await this.loadCategories("income");
            } else if (type === "expense") {
                await this.loadCategories("expense");
            }
        });
    }

    async loadCategories(type) {
        this.categoryInput.innerHTML = `<option value="">Выберите категорию...</option>`;
        let response;

        if (type === "income") {
            response = await IncomeService.getIncomeCategories();
        } else {
            response = await ExpenseService.getExpenseCategories();
        }

        if (!response.error && response.categories) {
            response.categories.forEach(category => {
                const option = document.createElement("option");
                option.value = category.id;
                option.textContent = category.title;
                this.categoryInput.appendChild(option);
            });
        }
    }

    clearError(input, errorEl) {
        input.classList.remove('input-error');
        errorEl.style.display = 'none';
        errorEl.innerText = '';
    }

    showError(input, errorEl, message) {
        input.classList.add('input-error');
        errorEl.innerText = message;
        errorEl.style.display = 'block';
    }

    initLiveValidation() {
        this.typeInput.addEventListener("change", () => this.clearError(this.typeInput, this.errorType));
        this.categoryInput.addEventListener("change", () => this.clearError(this.categoryInput, this.errorCategory));
        this.amountInput.addEventListener("input", () => this.clearError(this.amountInput, this.errorAmount));
        this.dateInput.addEventListener("input", () => this.clearError(this.dateInput, this.errorDate));
        this.commentInput.addEventListener("input", () => this.clearError(this.commentInput, this.errorComment));
    }

    initBtnEvents() {
        this.createBtn.addEventListener('click', async () => {
            let hasError = false;

            const type = this.typeInput.value;
            const category_id = parseInt(this.categoryInput.value, 10);
            const amount = parseFloat(this.amountInput.value);
            const date = this.dateInput.value;
            const comment = this.commentInput.value;

            if (!type) {
                this.showError(this.typeInput, this.errorType, "Выберите тип операции");
                hasError = true;
            }
            if (!category_id) {
                this.showError(this.categoryInput, this.errorCategory, "Выберите категорию");
                hasError = true;
            }
            if (!amount || amount <= 0) {
                this.showError(this.amountInput, this.errorAmount, "Введите сумму больше 0");
                hasError = true;
            }
            if (!date) {
                this.showError(this.dateInput, this.errorDate, "Выберите дату");
                hasError = true;
            }
            if (!comment.trim()) {
                this.showError(this.commentInput, this.errorComment, "Комментарий не может быть пустым");
                hasError = true;
            }

            if (hasError) return;

            const createData = { type, category_id, amount, date, comment };
            const response = await IncomeExpenseService.createIncomeExpense(createData);

            if (response.error) {
                this.showError(this.typeInput, this.errorType, response.message || "Ошибка при создании операции");
                return;
            }

            window.location.hash = '#/income-expense';
        });

        this.cancelBtn.addEventListener('click', () => {
            window.location.hash = `#/income-expense`;
        });
    }
}
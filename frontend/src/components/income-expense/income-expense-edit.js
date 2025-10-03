import { IncomeExpenseService } from "../../services/income-expense-service.js";
import { IncomeService } from "../../services/income-service.js";
import { ExpenseService } from "../../services/expense-service.js";
import { UrlUtils } from "../../utils/url-utils.js";

export class IncomeExpenseEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.typeInput = document.getElementById('edit-type');
        this.categoryInput = document.getElementById('edit-category');
        this.amountInput = document.getElementById('edit-amount');
        this.dateInput = document.getElementById('edit-date');
        this.commentInput = document.getElementById('edit-comment');
        this.saveBtn = document.getElementById('button-save');
        this.cancelBtn = document.getElementById('button-cancel');

        this.errorType = document.getElementById("error-type");
        this.errorCategory = document.getElementById("error-category");
        this.errorAmount = document.getElementById("error-amount");
        this.errorDate = document.getElementById("error-date");
        this.errorComment = document.getElementById("error-comment");

        this.operationId = UrlUtils.getUrlParam('id');
        if (!this.operationId) {
            this.openNewRoute('/income-expense');
            return;
        }

        this.typeInput.addEventListener('change', () => {
            this.loadCategories(this.typeInput.value);
            this.categoryInput.value = '';
        });

        this.loadOperation();
        this.initBtnEvents();
    }

    async loadOperation() {
        const res = await IncomeExpenseService.getOperation(this.operationId, true);
        if (res.error || !res.record) return;

        const operation = res.record;
        this.typeInput.value = operation.type;

        await this.loadCategories(operation.type);

        const option = Array.from(this.categoryInput.options)
            .find(opt => opt.textContent.trim() === operation.category?.trim());
        if (option) this.categoryInput.value = option.value;

        this.amountInput.value = operation.amount;
        this.dateInput.value = operation.date;
        this.commentInput.value = operation.comment || "";
    }

    async loadCategories(type) {
        this.categoryInput.innerHTML = '<option value="">Выберите категорию...</option>';
        const response = type === "income"
            ? await IncomeService.getIncomeCategories()
            : await ExpenseService.getExpenseCategories();

        if (response.error) return;

        const categories = response.categories || response.records || [];
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = String(category.id ?? category.Id);
            option.textContent = category.title ?? category.name;
            this.categoryInput.appendChild(option);
        });
    }

    validate(type, category_id, amount, date, comment) {
        let hasError = false;

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

    initBtnEvents() {
        this.saveBtn.addEventListener('click', async () => {
            const type = this.typeInput.value;
            const category_id = parseInt(this.categoryInput.value, 10);
            const amount = parseFloat(this.amountInput.value);
            const date = this.dateInput.value;
            const comment = this.commentInput.value.trim();

            if (!this.validate(type, category_id, amount, date, comment)) return;

            const editData = { type, category_id, amount, date, comment };
            const response = await IncomeExpenseService.updateIncomeExpense(this.operationId, editData);

            if (!response.error) {
                window.location.hash = '#/income-expense';
            }
        });

        this.cancelBtn.addEventListener('click', () => {
            window.location.hash = '#/income-expense';
        });
    }
}
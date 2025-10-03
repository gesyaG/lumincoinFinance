import { ExpenseService } from "../../services/expense-service";

export class ExpenseCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.cancelBtn = document.getElementById('cancelBtn'); 
        this.createBtn = document.getElementById('createBtn'); 
        this.newCategoryInput = document.getElementById('newCategoryInput'); 

        this.initBtnEvents();
    }

    initBtnEvents() {
        this.createBtn.addEventListener('click', async () => {
            const title = this.newCategoryInput.value.trim();
            const errorEl = document.getElementById('newExpenseCategoryError');

            if (!title) {
                this.newCategoryInput.classList.add('input-error');
                errorEl.innerText = "Название категории не может быть пустым!";
                errorEl.style.display = "block";
                return;
            }

            this.newCategoryInput.classList.remove('input-error');
            errorEl.style.display = "none";

            const createData = { title };
            const response = await ExpenseService.createExpenseCategory(createData);

            if (response.error) {
                errorEl.innerText = response.message;
                errorEl.style.display = "block";
                return;
            }

            window.location.hash = '#/expense';
        });

        this.cancelBtn.addEventListener('click', () => {
           window.location.hash = `#/expense`;
        });
    }

}
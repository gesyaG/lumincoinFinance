import { ExpenseService } from "../../services/expense-service";
import { UrlUtils } from "../../utils/url-utils";

export class ExpenseEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.cancelBtn = document.getElementById('cancelBtn'); 
        this.saveBtn = document.getElementById('saveBtn'); 
        this.EditCategoryInput = document.getElementById('EditCategoryInput'); 
        
       const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/expense');
        }


        this.getExpenseCategory(id);
        this.initBtnEvents(id);
    }

    async getExpenseCategory(id) {
        const response = await ExpenseService.getExpenseCategory(id);

        if (response.error) {
            alert(response.message);
            return;
        }

        this.EditCategoryInput.value = response.title; 
    }

        initBtnEvents(id) {
            this.saveBtn.addEventListener('click', async () => {
            const title = this.EditCategoryInput.value.trim();
            const errorEl = document.getElementById('editExpenseCategoryError');

            if (!title) {
                this.EditCategoryInput.classList.add('input-error');
                errorEl.innerText = "Название категории не может быть пустым!";
                errorEl.style.display = "block";
                return;
            }

            this.EditCategoryInput.classList.remove('input-error');
            errorEl.style.display = "none";

            const editData = { title, id };
            const response = await ExpenseService.editExpenseCategory(id, editData);

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
import { IncomeService } from "../../services/income-service";
import {CategoryType} from "../../types/category.type";
import {DataCategoryType} from "../../types/data-category.type";

export class IncomeCreate {
    readonly openNewRoute: () => Promise<void>;
    readonly cancelBtn : HTMLElement | null;
    readonly createBtn : HTMLElement | null;
    readonly newCategoryInput : HTMLInputElement | null;

    constructor(openNewRoute: () => Promise<void>) {
        this.openNewRoute = openNewRoute;
        this.cancelBtn = document.getElementById('cancelBtn'); 
        this.createBtn = document.getElementById('createBtn'); 
        this.newCategoryInput = document.getElementById('newCategoryInput') as HTMLInputElement | null;

        this.initBtnEvents();
    }

    private initBtnEvents(): void {
        if (this.createBtn) {
            this.createBtn.addEventListener('click', async () => {
                if (!this.newCategoryInput) return;
                const title: string = this.newCategoryInput.value.trim();
                const errorEl: HTMLElement | null = document.getElementById('newCategoryError');

                if (!title && errorEl) {
                    this.newCategoryInput.classList.add('input-error');
                    errorEl.innerText = "Название категории не может быть пустым!";
                    errorEl.style.display = "block";
                    return;
                }

                this.newCategoryInput.classList.remove('input-error');
                if (errorEl) {
                    errorEl.style.display = "none";
                }

                const createData: CategoryType = { title };
                const response: CategoryType = await IncomeService.createIncomeCategory(createData as DataCategoryType);

                if (response.error && errorEl) {
                    errorEl.innerText = response.message ?? "Произошла ошибка";
                    errorEl.style.display = "block";
                    return;
                }

                window.location.hash = '#/income';
            });
        }

        if (this.cancelBtn) {
            this.cancelBtn.addEventListener('click', () => {
                window.location.hash = `#/income`;
            });
        }
    }
}
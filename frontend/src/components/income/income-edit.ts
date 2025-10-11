import {IncomeService} from "../../services/income-service";
import {UrlUtils} from "../../utils/url-utils";
import {CategoryType} from "../../types/category.type";
import {DataCategoryType} from "../../types/data-category.type";

export class IncomeEdit {
    readonly openNewRoute: () => Promise<void>;
    readonly cancelBtn: HTMLElement | null;
    readonly saveBtn: HTMLElement | null;
    readonly EditCategoryInput: HTMLInputElement | null;

    constructor(openNewRoute: () => Promise<void>) {
        this.openNewRoute = openNewRoute;
        this.cancelBtn = document.getElementById('cancelBtn');
        this.saveBtn = document.getElementById('saveBtn');
        this.EditCategoryInput = document.getElementById('EditCategoryInput') as HTMLInputElement | null;

        const id: number | null = Number(UrlUtils.getUrlParam('id'));
        if (!id) {
            return;
        }

        this.getIncomeCategory(id);
        this.initBtnEvents(id);
    }

    private async getIncomeCategory(id: number): Promise<void> {
        const response: CategoryType = await IncomeService.getIncomeCategory(id);

        if (response.error) {
            alert(response.message);
            return;
        }

        if (this.EditCategoryInput && response.title !== undefined) {
            this.EditCategoryInput.value = response.title;
        }
    }

    private initBtnEvents(id: number): void {
        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', async () => {
                if (!this.EditCategoryInput) return;
                const title: string = this.EditCategoryInput.value.trim();
                const errorEl: HTMLElement | null = document.getElementById('editCategoryError');

                if (!title && errorEl) {
                    this.EditCategoryInput.classList.add('input-error');
                    errorEl.innerText = "Название категории не может быть пустым!";
                    errorEl.style.display = "block";
                    return;
                }

                this.EditCategoryInput.classList.remove('input-error');
                if (errorEl) {
                    errorEl.style.display = "none";
                }

                const editData: DataCategoryType = {title, id};
                const response: CategoryType = await IncomeService.editIncomeCategory(id, editData);

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
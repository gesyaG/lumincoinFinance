import { ExpenseService } from "../../services/expense-service";
import {CategoryType} from "../../types/category.type";
import {ReturnCategoriesObjectType} from "../../types/return-categories-object.type";

export class ExpenseCategories {
    readonly openNewRoute: () => Promise<void>;
    readonly popup : HTMLElement | null;
    private deleteConfirmBtn: HTMLElement | null;
    private deleteCancelBtn: HTMLElement | null;
    private currentDeleteId : number | null;

    constructor(openNewRoute: () => Promise<void>) {
        this.openNewRoute = openNewRoute;
        this.popup = document.getElementById('popup');
        this.currentDeleteId = null;
        this.deleteConfirmBtn = null;
        this.deleteCancelBtn = null;

        this.initPopupEvents();
        this.getExpenseCategories();
    }

    private initPopupEvents(): void {
        if (!this.popup) return;
        this.deleteConfirmBtn = this.popup.querySelector('.popup-button-delete button');
        this.deleteCancelBtn = this.popup.querySelector('.popup-button-nodelete button');

        if (this.deleteConfirmBtn) {
            this.deleteConfirmBtn.addEventListener('click', async () => {
                if (this.currentDeleteId) {
                    const result: CategoryType = await ExpenseService.deleteExpenseCategory(this.currentDeleteId);
                    if (result && this.popup) {
                        this.popup.style.display = 'none';
                        await this.getExpenseCategories();
                    } else {
                        alert('Ошибка при удалении');
                    }
                    this.currentDeleteId = null;
                }
            });
        }

        if (this.deleteCancelBtn) {
            this.deleteCancelBtn.addEventListener('click', () => {
                if (this.popup) {
                    this.popup.style.display = 'none';
                    this.currentDeleteId = null;
                }
            });
        }
    }

    private async getExpenseCategories(): Promise<void> {
        const response: ReturnCategoriesObjectType = await ExpenseService.getExpenseCategories();

        if (response.error) {
            alert(response.error);
            return;
        }

        if (response.categories) {
            this.showCategory(response.categories);
        }
    }

    private showCategory(categories: CategoryType[]): void {
        const container: HTMLElement | null = document.querySelector('.income-blocks');

        if (!container) return;

        container.innerHTML = `
            <div class="income-block income-block-new">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.5469 6.08984V9.05664H0.902344V6.08984H14.5469ZM9.32422 0.511719V15.0039H6.13867V0.511719H9.32422Z" fill="#CED4DA"/>
                </svg>
            </div>
        `;

        const newBlockBtn: HTMLElement | null = container.querySelector('.income-block-new');
        if (newBlockBtn) {
            newBlockBtn.addEventListener('click', () => {
                window.location.hash = '#/expense/create';
            });
        }

        categories.forEach((category: CategoryType) => {
            const block: HTMLElement | null = document.createElement('div');
            block.className = 'income-block';

            block.innerHTML = `
                <div class="income-title">${category.title}</div>
                <div class="income-buttons">
                    <div class="income-button-edit">
                        <button type="button" class="btn btn-block btn-primary">Редактировать</button>
                    </div>
                    <div class="income-button-delete">
                        <button type="button" class="btn btn-block btn-danger" data-id="${category.id}">Удалить</button>
                    </div>
                </div>
            `;

            container.insertBefore(block, container.querySelector('.income-block-new'));

            const editBtn: HTMLElement | null = block.querySelector('.income-button-edit button');
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    window.location.hash = `#/expense/edit?id=${category.id}`;
                });
            }

            const deleteBtn: HTMLElement | null = block.querySelector('.income-button-delete button');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    if (e.target && e.target instanceof HTMLElement) {
                        const idStr: string | undefined = e.target.dataset.id;
                        if (idStr) {
                            this.currentDeleteId = Number(idStr);
                        }
                    }
                    if (this.popup) {
                        this.popup.style.display = 'flex';
                    }
                });
            }
        });
    }
}
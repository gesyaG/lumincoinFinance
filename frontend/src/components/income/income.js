import { IncomeService } from "../../services/income-service";

export class IncomeCategories {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.popup = document.getElementById('popup');
        this.deleteConfirmBtn = this.popup.querySelector('.popup-button-delete button');
        this.deleteCancelBtn = this.popup.querySelector('.popup-button-nodelete button');
        this.currentDeleteId = null;

        this.initPopupEvents();
        this.getIncomeCategories();
    }

    initPopupEvents() {
        this.deleteConfirmBtn.addEventListener('click', async () => {
            if (this.currentDeleteId) { 
                const result = await IncomeService.deleteIncomeCategory(this.currentDeleteId);
                if (result) {
                    this.popup.style.display = 'none';
                    await this.getIncomeCategories();
                } else {
                    alert('Ошибка при удалении');
                }
                this.currentDeleteId = null;
            }
        });

        this.deleteCancelBtn.addEventListener('click', () => {
            this.popup.style.display = 'none';
            this.currentDeleteId = null;
        });
    }

    async getIncomeCategories() {
        const response = await IncomeService.getIncomeCategories();

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.showCategory(response.categories);
    }

    showCategory(categories) {
        const container = document.querySelector('.income-blocks');

        container.innerHTML = `
            <div class="income-block income-block-new">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.5469 6.08984V9.05664H0.902344V6.08984H14.5469ZM9.32422 0.511719V15.0039H6.13867V0.511719H9.32422Z" fill="#CED4DA"/>
                </svg>
            </div>
        `;

        const newBlockBtn = container.querySelector('.income-block-new');
        newBlockBtn.addEventListener('click', () => {
            window.location.hash = '#/income/create';
        });

        categories.forEach(category => {
            const block = document.createElement('div');
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

            const editBtn = block.querySelector('.income-button-edit button');
            editBtn.addEventListener('click', () => {
                window.location.hash = `#/income/edit?id=${category.id}`;
            });

            const deleteBtn = block.querySelector('.income-button-delete button');
            deleteBtn.addEventListener('click', (e) => {
                this.currentDeleteId = e.target.dataset.id;
                this.popup.style.display = 'flex';
            });
        });
    }
}
import { IncomeExpenseService } from "../../services/income-expense-service.js";
import { CommonUtils } from "../../utils/common-utils.js";

export class IncomeExpense {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.formatDate = (date) => date.toISOString().split('T')[0];

        this.initFilters();
        this.createButton();

        const today = this.formatDate(new Date());
        this.setActiveButton(document.getElementById('filter-today'));
        this.getIncomeExpense({ dateFrom: today, dateTo: today }).then();
    }

    initDeleteHandlers() {
        const popup = document.querySelector('.popup');
        const deleteBtn = popup.querySelector('.popup-button-delete button');
        const cancelBtn = popup.querySelector('.popup-button-nodelete button');
        let currentId = null;

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                currentId = e.currentTarget.getAttribute('data-id');
                popup.style.display = 'flex'; 
            });
        });

        cancelBtn.addEventListener('click', () => {
            popup.style.display = 'none';
            currentId = null;
        });

        deleteBtn.addEventListener('click', async () => {
            if (!currentId) return;

            const response = await IncomeExpenseService.deleteIncomeExpense(currentId);

            if (response.error) {
                alert(response.message);
            } 

            popup.style.display = 'none';
            currentId = null;
        });
    }

    initFilters() {
        const setHandler = (id, callback) => {
            document.getElementById(id).addEventListener('click', (e) => {
                this.setActiveButton(e.target);
                callback();
            });
        };

        setHandler('filter-today', () => {
            const today = this.formatDate(new Date());
            this.getIncomeExpense({ dateFrom: today, dateTo: today });
        });

        setHandler('filter-week', () => {
            const today = new Date();
            const weekAgo = new Date();
            weekAgo.setDate(today.getDate() - 7);
            this.getIncomeExpense({ dateFrom: this.formatDate(weekAgo), dateTo: this.formatDate(today) });
        });

        setHandler('filter-month', () => {
            const today = new Date();
            const monthAgo = new Date();
            monthAgo.setMonth(today.getMonth() - 1);
            this.getIncomeExpense({ dateFrom: this.formatDate(monthAgo), dateTo: this.formatDate(today) });
        });

        setHandler('filter-year', () => {
            const today = new Date();
            const yearAgo = new Date();
            yearAgo.setFullYear(today.getFullYear() - 1);
            this.getIncomeExpense({ dateFrom: this.formatDate(yearAgo), dateTo: this.formatDate(today) });
        });

        setHandler("filter-all", () => {
            const today = this.formatDate(new Date());
            this.getIncomeExpense({ dateFrom: "2000-01-01", dateTo: today });
        });


        setHandler('filter-interval', () => {
            const dateFrom = document.getElementById('start-date').value;
            const dateTo = document.getElementById('end-date').value;

            if (!dateFrom || !dateTo) {
                alert("Укажите обе даты!");
                return;
            }

            this.getIncomeExpense({ dateFrom, dateTo });
        });
    }

    setActiveButton(activeBtn) {
        document.querySelectorAll('.btn-group button').forEach(btn => {
            btn.classList.remove('btn-primary', 'active');
            btn.classList.add('btn-outline-secondary');
        });

        activeBtn.classList.remove('btn-outline-secondary');
        activeBtn.classList.add('btn-primary', 'active');
    }

    createButton() {
        document.getElementById('create-income').addEventListener('click', () => {
        window.location.hash = '#/income-expense/create?type=income';
    });

        document.getElementById('create-expense').addEventListener('click', () => {
        window.location.hash = '#/income-expense/create?type=expense';
    });

    }

    async getIncomeExpense(params = {}) {
        const response = await IncomeExpenseService.getIncomeExpense(params);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.showRecords(response.records);
    }

    showRecords(records) {
        const recordsElement = document.getElementById('records');
        recordsElement.innerHTML = ''; 

        for (let i = 0; i < records.length; i++) {
            const trElement = document.createElement('tr');
            trElement.insertCell().innerText = records[i].id;
            trElement.insertCell().innerText = records[i].type === 'income' ? 'доход' : 'расход';
            trElement.insertCell().innerText = records[i].category || 'Без категории';
            trElement.insertCell().innerText = records[i].amount + ' $';
            trElement.insertCell().innerText = records[i].date;
            trElement.insertCell().innerText = records[i].comment || '';
            trElement.insertCell().innerHTML = CommonUtils.generateGridToolsColumn(records[i].id);

            recordsElement.appendChild(trElement);
        }

        this.initDeleteHandlers();
    }
}

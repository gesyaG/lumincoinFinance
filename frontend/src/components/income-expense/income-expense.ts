import { IncomeExpenseService } from "../../services/income-expense-service";
import { CommonUtils } from "../../utils/common-utils";
import {IncomeExpenseRecordsReturnType} from "../../types/income-expense-records-return.type";
import {IncomeExpenseListType} from "../../types/income-expense-list.type";

export class IncomeExpense {
    readonly openNewRoute: () => Promise<void>;
    readonly formatDate: (date: Date) => string | undefined;

    constructor(openNewRoute: () => Promise<void>) {
        this.openNewRoute = openNewRoute;
        this.formatDate = (date) => date.toISOString().split('T')[0];

        this.initFilters();
        this.createButton();

        const today: string | undefined = this.formatDate(new Date());
        this.setActiveButton(document.getElementById('filter-today'));
        this.getIncomeExpense({ dateFrom: today, dateTo: today }).then();
    }

    private initDeleteHandlers(): void {
        const popup: HTMLElement | null = document.querySelector('.popup');
        if (!popup) return;
        const deleteBtn: HTMLElement | null = popup.querySelector('.popup-button-delete button');
        const cancelBtn: HTMLElement | null = popup.querySelector('.popup-button-nodelete button');
        let currentId: number | null = null;

        document.querySelectorAll<HTMLButtonElement>('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLButtonElement;
                currentId = Number(target.getAttribute('data-id'));
                popup.style.display = 'flex';
            });
        });

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                popup.style.display = 'none';
                currentId = null;
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', async () => {
                if (!currentId) return;

                const response: IncomeExpenseRecordsReturnType = await IncomeExpenseService.deleteIncomeExpense(currentId);

                if (response.error) {
                    alert(response.message);
                }

                popup.style.display = 'none';
                currentId = null;
            });
        }
    }

    private initFilters(): void {
        const setHandler = (id: string, callback: () => void) => {
            document.getElementById(id)?.addEventListener('click', (e) => {
                this.setActiveButton(e.target as HTMLElement);
                callback();
            });
        };

        setHandler('filter-today', () => {
            const today: string | undefined = this.formatDate(new Date());
            this.getIncomeExpense({ dateFrom: today, dateTo: today });
        });

        setHandler('filter-week', () => {
            const today: Date = new Date();
            const weekAgo: Date  = new Date();
            weekAgo.setDate(today.getDate() - 7);
            this.getIncomeExpense({ dateFrom: this.formatDate(weekAgo), dateTo: this.formatDate(today) });
        });

        setHandler('filter-month', () => {
            const today: Date= new Date();
            const monthAgo: Date = new Date();
            monthAgo.setMonth(today.getMonth() - 1);
            this.getIncomeExpense({ dateFrom: this.formatDate(monthAgo), dateTo: this.formatDate(today) });
        });

        setHandler('filter-year', () => {
            const today: Date = new Date();
            const yearAgo: Date = new Date();
            yearAgo.setFullYear(today.getFullYear() - 1);
            this.getIncomeExpense({ dateFrom: this.formatDate(yearAgo), dateTo: this.formatDate(today) });
        });

        setHandler("filter-all", () => {
            const today: string | undefined = this.formatDate(new Date());
            this.getIncomeExpense({ dateFrom: "2000-01-01", dateTo: today });
        });


        setHandler('filter-interval', () => {
            const dateFromInput = document.getElementById('start-date') as HTMLInputElement | null;
            const dateToInput = document.getElementById('end-date') as HTMLInputElement | null;

            if (!dateFromInput || !dateToInput) return;

            const updateInterval = () => {
                const dateFrom = dateFromInput.value;
                const dateTo = dateToInput.value;

                if (dateFrom && dateTo) {
                    this.setActiveButton(document.getElementById('filter-interval'));
                    this.getIncomeExpense({ dateFrom, dateTo });
                }
            };

            if (dateFromInput.value && dateToInput.value) {
                updateInterval();
            }
            dateFromInput.addEventListener('change', updateInterval);
            dateToInput.addEventListener('change', updateInterval);
        });
    }

    private setActiveButton(activeBtn: HTMLElement | null): void {
        document.querySelectorAll('.btn-group button').forEach(btn => {
            btn.classList.remove('btn-primary', 'active');
            btn.classList.add('btn-outline-secondary');
        });
        if (activeBtn) {
            activeBtn.classList.remove('btn-outline-secondary');
            activeBtn.classList.add('btn-primary', 'active');
        }
    }

    private createButton(): void {
        document.getElementById('create-income')?.addEventListener('click', () => {
        window.location.hash = '#/income-expense/create?type=income';
    });

        document.getElementById('create-expense')?.addEventListener('click', () => {
        window.location.hash = '#/income-expense/create?type=expense';
    });

    }

    private async getIncomeExpense(params = {}): Promise<void>  {
        const response: IncomeExpenseRecordsReturnType = await IncomeExpenseService.getIncomeExpense(params);

        if (response.error) {
            alert(response.error);
            return;
        }

        if (response.records) {
            this.showRecords(response.records);
        }
    }

    private showRecords(records: IncomeExpenseListType[]): void {
        const recordsElement: HTMLElement | null = document.getElementById('records');
        if (!recordsElement) return;
        recordsElement.innerHTML = '';

        records?.forEach(record => {
            const trElement = document.createElement('tr');

            trElement.insertCell().innerText = record.id.toString();
            trElement.insertCell().innerText = record.type === 'income' ? 'доход' : 'расход';
            trElement.insertCell().innerText = record.category || 'Без категории';
            trElement.insertCell().innerText = record.amount + ' $';
            trElement.insertCell().innerText = record.date;
            trElement.insertCell().innerText = record.comment || '';
            trElement.insertCell().innerHTML = CommonUtils.generateGridToolsColumn(Number(record.id));

            recordsElement?.appendChild(trElement);
        });


        this.initDeleteHandlers();
    }
}
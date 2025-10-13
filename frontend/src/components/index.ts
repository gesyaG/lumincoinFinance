import { IncomeExpenseService } from "../services/income-expense-service";
import {PieDataType} from "../types/pie-data.type";
import {IncomeExpenseRecordsReturnType} from "../types/income-expense-records-return.type";
import {IncomeExpenseListType, IncomeExpenseRecordWithCategory} from "../types/income-expense-list.type";
import {DateFilter} from "../types/data-filter.type";
import {Chart} from 'chart.js';

export class Index {
    private pieIncome: Chart | null = null;
    private pieExpense: Chart | null = null;
    readonly formatDate: (date: Date) => string | undefined;

    constructor() {
        this.pieIncome = null;
        this.pieExpense = null;
        this.formatDate = (date: Date): string | undefined => date.toISOString().split("T")[0];

        this.initFilters();

        const today: string | undefined = this.formatDate(new Date());
        this.setActiveButton(document.getElementById("filter-today"));
        this.loadData({ dateFrom: today, dateTo: today });
    }

    private initFilters(): void {
        const setHandler = (id: string, callback: () => void): void => {
            document.getElementById(id)?.addEventListener("click", (e) => {
                this.setActiveButton(e.target as HTMLElement);
                callback();
            });
        };

        setHandler("filter-today", (): void => {
            const today: string | undefined = this.formatDate(new Date());
            this.loadData({ dateFrom: today, dateTo: today });
        });

        setHandler("filter-week", (): void => {
            const today: Date = new Date();
            const weekAgo: Date = new Date();
            weekAgo.setDate(today.getDate() - 7);
            this.loadData({ dateFrom: this.formatDate(weekAgo), dateTo: this.formatDate(today) });
        });

        setHandler("filter-month", (): void => {
            const today : Date= new Date();
            const monthAgo: Date = new Date();
            monthAgo.setMonth(today.getMonth() - 1);
            this.loadData({ dateFrom: this.formatDate(monthAgo), dateTo: this.formatDate(today) });
        });

        setHandler("filter-year", (): void => {
            const today: Date = new Date();
            const yearAgo: Date = new Date();
            yearAgo.setFullYear(today.getFullYear() - 1);
            this.loadData({ dateFrom: this.formatDate(yearAgo), dateTo: this.formatDate(today) });
        });

        setHandler("filter-all", (): void => {
            const today: string | undefined  = this.formatDate(new Date());
            this.loadData({ dateFrom: "2000-01-01", dateTo: today });
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
                    this.loadData({ dateFrom, dateTo });
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

    private async loadData(params: DateFilter): Promise<void> {
        const response: IncomeExpenseRecordsReturnType = await IncomeExpenseService.getIncomeExpense(params);

        if (response.error) {
            console.error(response.message);
            return;
        }

        const incomeRecords:IncomeExpenseListType[] | undefined = response.records?.filter(r => r.type === "income");
        const expenseRecords:IncomeExpenseListType[] | undefined  = response.records?.filter(r => r.type === "expense");

        this.renderChart("pieChart", incomeRecords, true);
        this.renderChart("pieChart-2", expenseRecords, false);
    }

    private renderChart(
        canvasId: string,
        records: IncomeExpenseRecordWithCategory[] | undefined,
        isIncome: boolean
    ): void {
        if (!records?.length) return;

        const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const grouped: Record<string, number> = {};

        for (const record of records) {
            const category: string = record.category ?? record.category_name ?? record.categoryTitle ?? "Без категории";
            grouped[category] = (grouped[category] || 0) + record.amount;
        }

        const labels: string[] = Object.keys(grouped);
        const data: number[] = Object.values(grouped);

        const colors: string[] = [
            "#0D6EFD", "#20C997", "#FFC107", "#FD7E14", "#DC3545",
            "#6610f2", "#198754", "#6f42c1", "#e83e8c", "#0dcaf0"
        ];

        const pieData: PieDataType = {
            labels: labels.length ? labels : ["Нет данных"],
            datasets: [{
                data: data.length ? data : [1],
                backgroundColor: labels.length ? colors.slice(0, labels.length) : ["#dee2e6"]
            }]
        };

        const pieOptions = { maintainAspectRatio: false, responsive: true };

        if (isIncome) {
            if (this.pieIncome) {
                this.pieIncome.config.data = pieData;
                this.pieIncome.update();
            } else {
                this.pieIncome = new Chart(ctx, { type: "pie", data: pieData, options: pieOptions });
            }
        } else {
            if (this.pieExpense) {
                this.pieExpense.config.data = pieData;
                this.pieExpense.update();
            } else {
                this.pieExpense = new Chart(ctx, { type: "pie", data: pieData, options: pieOptions });
            }
        }
    }


}

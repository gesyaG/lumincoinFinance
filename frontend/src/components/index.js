import { IncomeExpenseService } from "../services/income-expense-service.js";

export class Index {
    constructor() {
        this.pieIncome = null;
        this.pieExpense = null;
        this.formatDate = (date) => date.toISOString().split("T")[0];

        this.initFilters();

        const today = this.formatDate(new Date());
        this.setActiveButton(document.getElementById("filter-today"));
        this.loadData({ dateFrom: today, dateTo: today });
    }

    initFilters() {
        const setHandler = (id, callback) => {
            document.getElementById(id).addEventListener("click", (e) => {
                this.setActiveButton(e.target);
                callback();
            });
        };

        setHandler("filter-today", () => {
            const today = this.formatDate(new Date());
            this.loadData({ dateFrom: today, dateTo: today });
        });

        setHandler("filter-week", () => {
            const today = new Date();
            const weekAgo = new Date();
            weekAgo.setDate(today.getDate() - 7);
            this.loadData({ dateFrom: this.formatDate(weekAgo), dateTo: this.formatDate(today) });
        });

        setHandler("filter-month", () => {
            const today = new Date();
            const monthAgo = new Date();
            monthAgo.setMonth(today.getMonth() - 1);
            this.loadData({ dateFrom: this.formatDate(monthAgo), dateTo: this.formatDate(today) });
        });

        setHandler("filter-year", () => {
            const today = new Date();
            const yearAgo = new Date();
            yearAgo.setFullYear(today.getFullYear() - 1);
            this.loadData({ dateFrom: this.formatDate(yearAgo), dateTo: this.formatDate(today) });
        });

        setHandler("filter-all", () => {
            const today = this.formatDate(new Date());
            this.loadData({ dateFrom: "2000-01-01", dateTo: today });
        });

        setHandler("filter-interval", () => {
            const dateFrom = document.getElementById("start-date").value;
            const dateTo = document.getElementById("end-date").value;

            if (!dateFrom || !dateTo) {
                alert("Укажите обе даты!");
                return;
            }

            this.loadData({ dateFrom, dateTo });
        });
    }

    setActiveButton(activeBtn) {
        document.querySelectorAll(".btn-group button").forEach(btn => {
            btn.classList.remove("btn-primary", "active");
            btn.classList.add("btn-outline-secondary");
        });

        activeBtn.classList.remove("btn-outline-secondary");
        activeBtn.classList.add("btn-primary", "active");
    }

    async loadData(params) {
        const response = await IncomeExpenseService.getIncomeExpense(params);

        if (response.error) {
            console.error(response.message);
            return;
        }

        const incomeRecords = response.records.filter(r => r.type === "income");
        const expenseRecords = response.records.filter(r => r.type === "expense");

        this.renderChart("pieChart", incomeRecords, true);
        this.renderChart("pieChart-2", expenseRecords, false);
    }

    renderChart(canvasId, records, isIncome) {
        const pieChartCanvas = document.getElementById(canvasId).getContext("2d");

        const grouped = {};
        for (let r of records) {
            const cat = r.category || r.category_name || r.categoryTitle || "Без категории";
            grouped[cat] = (grouped[cat] || 0) + r.amount;
        }

        const labels = Object.keys(grouped);
        const data = Object.values(grouped);

        const colors = [
            "#0D6EFD", "#20C997", "#FFC107", "#FD7E14", "#DC3545",
            "#6610f2", "#198754", "#6f42c1", "#e83e8c", "#0dcaf0"
        ];

        const pieData = {
            labels: labels.length ? labels : ["Нет данных"],
            datasets: [{
                data: data.length ? data : [1],
                backgroundColor: labels.length ? colors.slice(0, labels.length) : ["#dee2e6"]
            }]
        };

        const pieOptions = { maintainAspectRatio: false, responsive: true };

        if (isIncome) {
            if (this.pieIncome) {
                this.pieIncome.data = pieData;
                this.pieIncome.update();
            } else {
                this.pieIncome = new Chart(pieChartCanvas, { type: "pie", data: pieData, options: pieOptions });
            }
        } else {
            if (this.pieExpense) {
                this.pieExpense.data = pieData;
                this.pieExpense.update();
            } else {
                this.pieExpense = new Chart(pieChartCanvas, { type: "pie", data: pieData, options: pieOptions });
            }
        }
    }
}

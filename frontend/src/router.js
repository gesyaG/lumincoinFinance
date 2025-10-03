import {Index} from "./components/index";
import {Form} from "./components/form";
import {Auth} from "./services/auth";
import {Common} from "./components/common";
import {IncomeCategories} from "./components/income/income";
import { IncomeCreate } from "./components/income/income-create";
import { IncomeEdit } from "./components/income/income-edit";
import {ExpenseCategories} from "./components/expense/expense";
import { ExpenseCreate } from "./components/expense/expense-create";
import { ExpenseEdit } from "./components/expense/expense-edit";
import { IncomeExpense } from "./components/income-expense/income-expense";
import { IncomeExpenseCreate } from "./components/income-expense/income-expense-create";
import { IncomeExpenseEdit } from "./components/income-expense/income-expense-edit";

export class Router {
    constructor() {
        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/index.html',
                styles: 'styles/index.css',
                load: () => {
                    new Index();
                }
            },
            {
                route: '#/sign-up',
                title: 'Регистрация',
                template: 'templates/sign-up.html',
                styles: 'styles/login.css',
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/login',
                title: 'Вход',
                template: 'templates/login.html',
                styles: 'styles/login.css',
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'templates/income.html',
                styles: 'styles/income.css',
                load: () => {
                    new IncomeCategories(this.openRoute.bind(this));
                }
            },
            {
                route: '#/income/create',
                title: 'Создание категории дохода',
                template: 'templates/income-create.html',
                styles: 'styles/category.css',
                load: () => {
                    new IncomeCreate(this.openRoute.bind(this));
                }
            },
            {
                route: '#/income/edit',
                title: 'Редактирование категории дохода',
                template: 'templates/income-edit.html',
                styles: 'styles/category.css',
                load: () => {
                    new IncomeEdit(this.openRoute.bind(this));
                }
            },
            {
                route: '#/expense',
                title: 'Расходы',
                template: 'templates/expense.html',
                styles: 'styles/income.css',
                load: () => {
                    new ExpenseCategories(this.openRoute.bind(this));
                }
            },
            {
                route: '#/expense/create',
                title: 'Создание категории расхода',
                template: 'templates/expense-create.html',
                styles: 'styles/category.css',
                load: () => {
                    new ExpenseCreate(this.openRoute.bind(this));
                }
            },
            {
                route: '#/expense/edit',
                title: 'Редактирование категории расхода',
                template: 'templates/expense-edit.html',
                styles: 'styles/category.css',
                load: () => {
                    new ExpenseEdit(this.openRoute.bind(this));
                }
            },
            {
                route: '#/income-expense',
                title: 'Доходы и расходы',
                template: 'templates/income-expense.html',
                styles: 'styles/income-expense.css',
                load: () => {
                    new IncomeExpense(this.openRoute.bind(this));
                }
            },
            {
                route: '#/income-expense/create',
                title: 'Создание дохода/расхода',
                template: 'templates/income-expense-create.html',
                styles: 'styles/category.css',
                load: () => {
                    new IncomeExpenseCreate(this.openRoute.bind(this));
                }
            },
            {
                route: '#/income-expense/edit',
                title: 'Редактирование дохода/расхода',
                template: 'templates/income-expense-edit.html',
                styles: 'styles/category.css',
                load: () => {
                    new IncomeExpenseEdit(this.openRoute.bind(this));
                }
            },
        ];
    }

    async openRoute() {
        const newRoute = this.routes.find(item => item.route === window.location.hash.split('?')[0]);

        const urlRoute = window.location.hash.split('?')[0];
        if (urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/login';
            return;
        }

        if (!newRoute) {
            window.location.href = '#/';
            return;
        }

        const userInfo = Auth.getUserInfo();
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (userInfo && accessToken) {
            new Common();
        } else {
            const currentHash = window.location.hash;
            if (currentHash !== '#/login' && currentHash !== '#/sign-up') {
                window.location.replace('#/login');
            }
        }

        document.getElementById('content').innerHTML =
            await fetch(newRoute.template).then(response => response.text());
        document.getElementById('styles').setAttribute('href', newRoute.styles);
        document.getElementById('page-title').innerText = newRoute.title;

        const asideElement = document.querySelector('aside');
        asideElement.style.display = (newRoute.route === '#/login' || newRoute.route === '#/sign-up') ? 'none' : 'block';

        const navIncome = document.getElementById('nav-income');
        const navExpense = document.getElementById('nav-expense');
        const navCategories = document.getElementById('nav-categories');
        const navCategoriesItem = navCategories.closest('li');

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const svgIcon = link.querySelector('svg');
            if (svgIcon) svgIcon.style.fill = '#052C65';
        });

        const activeLink = document.querySelector(`.nav-link[href="${newRoute.route}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            const svgIcon = activeLink.querySelector('svg');
            if (svgIcon) svgIcon.style.fill = 'white';
        }

        const route = newRoute.route;

        if (route === '#/income' || route.startsWith('#/income/')) {
            navIncome.classList.add('active');
            navCategories.classList.add('active');
            navCategoriesItem.classList.add('menu-open');
            navCategories.querySelectorAll('svg').forEach(svg => svg.style.fill = 'white');
            navCategories.style.borderBottomLeftRadius = '0';
            navCategories.style.borderBottomRightRadius = '0';
            navCategories.style.marginBottom = '0';
            navIncome.style.borderRadius = '0';
            navIncome.style.marginBottom = '0';
            navExpense.style.borderTopLeftRadius = '0';
            navExpense.style.borderTopRightRadius = '0';
            navExpense.style.borderLeft = '1px solid #0D6EFD';
            navExpense.style.borderRight = '1px solid #0D6EFD';
            navExpense.style.borderBottom = '1px solid #0D6EFD';
        } else if (route === '#/expense' || route.startsWith('#/expense/')) {
            navExpense.classList.add('active');
            navCategories.classList.add('active');
            navCategoriesItem.classList.add('menu-open');
            navCategories.querySelectorAll('svg').forEach(svg => svg.style.fill = 'white');
            navCategories.style.borderBottomLeftRadius = '0';
            navCategories.style.borderBottomRightRadius = '0';
            navCategories.style.marginBottom = '0';
            navIncome.style.borderRadius = '0';
            navIncome.style.marginBottom = '0';
            navExpense.style.borderTopLeftRadius = '0';
            navExpense.style.borderTopRightRadius = '0';
            navIncome.style.borderLeft = '1px solid #0D6EFD';
            navIncome.style.borderRight = '1px solid #0D6EFD';
        } else {
            navExpense.style.border = 'none';
            navIncome.style.border = 'none';
            navCategoriesItem.classList.remove('menu-open');
            navCategories.querySelectorAll('svg').forEach(svg => {
                svg.style.fill = '#052C65';
            });
        }

        newRoute.load();

        document.getElementById('avatar').addEventListener('click', () => {
            const logoutDialog = document.getElementById('logout');
            logoutDialog.style.display = (logoutDialog.style.display === 'block') ? 'none' : 'block';
        });

        document.getElementById('user-name').addEventListener('click', () => {
            const logoutDialog = document.getElementById('logout');
            logoutDialog.style.display = (logoutDialog.style.display === 'block') ? 'none' : 'block';
        });
    }
}
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
import { RouteType } from "./types/route.type";
import { UserInfoType } from "./types/user-info.type";

export class Router {

    readonly contentElement: HTMLElement | null;
    readonly stylesElement: HTMLElement | null;
    readonly pageTitleElement: HTMLElement | null;
    readonly asideElement: HTMLElement | null;
    readonly navIncomeElement: HTMLElement | null;
    readonly navExpenseElement: HTMLElement | null;
    readonly navCategoriesElement: HTMLElement | null;
    private navCategoriesItemElement: HTMLLIElement | null
    readonly avatarElement: HTMLElement | null;
    readonly logoutDialogElement: HTMLElement | null;
    readonly userNameElement: HTMLElement | null;
    private routes: RouteType[];

    constructor() {
        this.contentElement = document.getElementById('content');
        this.stylesElement = document.getElementById('styles');
        this.pageTitleElement = document.getElementById('page-title');
        this.asideElement = document.querySelector('aside');
        this.navIncomeElement = document.getElementById('nav-income');
        this.navExpenseElement = document.getElementById('nav-expense');
        this.navCategoriesElement = document.getElementById('nav-categories');
        this.navCategoriesItemElement = null
        this.avatarElement = document.getElementById('avatar');
        this.logoutDialogElement = document.getElementById('logout');
        this.userNameElement = document.getElementById('user-name');

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
                    new IncomeCategories(() => this.openRoute());
                }
            },
            {
                route: '#/income/create',
                title: 'Создание категории дохода',
                template: 'templates/income-create.html',
                styles: 'styles/category.css',
                load: () => {
                    new IncomeCreate(() => this.openRoute());
                }
            },
            {
                route: '#/income/edit',
                title: 'Редактирование категории дохода',
                template: 'templates/income-edit.html',
                styles: 'styles/category.css',
                load: () => {
                    new IncomeEdit(() => this.openRoute());
                }
            },
            {
                route: '#/expense',
                title: 'Расходы',
                template: 'templates/expense.html',
                styles: 'styles/income.css',
                load: () => {
                    new ExpenseCategories(() => this.openRoute());
                }
            },
            {
                route: '#/expense/create',
                title: 'Создание категории расхода',
                template: 'templates/expense-create.html',
                styles: 'styles/category.css',
                load: () => {
                    new ExpenseCreate(() => this.openRoute());
                }
            },
            {
                route: '#/expense/edit',
                title: 'Редактирование категории расхода',
                template: 'templates/expense-edit.html',
                styles: 'styles/category.css',
                load: () => {
                    new ExpenseEdit(() => this.openRoute());
                }
            },
            {
                route: '#/income-expense',
                title: 'Доходы и расходы',
                template: 'templates/income-expense.html',
                styles: 'styles/income-expense.css',
                load: () => {
                    new IncomeExpense(() => this.openRoute());
                }
            },
            {
                route: '#/income-expense/create',
                title: 'Создание дохода/расхода',
                template: 'templates/income-expense-create.html',
                styles: 'styles/category.css',
                load: () => {
                    new IncomeExpenseCreate(() => this.openRoute());
                }
            },
            {
                route: '#/income-expense/edit',
                title: 'Редактирование дохода/расхода',
                template: 'templates/income-expense-edit.html',
                styles: 'styles/category.css',
                load: () => {
                    new IncomeExpenseEdit(() => this.openRoute());
                }
            },
        ];
    }

    public async openRoute(): Promise<void> {
        const newRoute: RouteType | undefined = this.routes.find(item => item.route === window.location.hash.split('?')[0]);

        const urlRoute: string | undefined = window.location.hash.split('?')[0];

        if (!urlRoute) {
            window.location.href = '#/';
            return;
        }

        if (urlRoute === '#/logout') {
            const result:boolean = await Auth.logout();
            if (result) {
                window.location.href = '#/login';
                return;
            } else {
                //...
            }
        }

        if (!newRoute) {
            window.location.href = '#/';
            return;
        }

        const userInfo: UserInfoType | null = Auth.getUserInfo();
        const accessToken: string | null = localStorage.getItem(Auth.accessTokenKey);
        if (userInfo && accessToken) {
            new Common();
        } else {
            const currentHash = window.location.hash;
            if (currentHash !== '#/login' && currentHash !== '#/sign-up') {
                window.location.replace('#/login');
            }
        }
        if (!this.navCategoriesElement) return;
        this.navCategoriesItemElement = this.navCategoriesElement.closest('li');

        if (!this.contentElement || !this.stylesElement || !this.pageTitleElement || !this.asideElement 
            || !this.navIncomeElement || !this.navExpenseElement || !this.navCategoriesItemElement
            || !this.avatarElement || !this.userNameElement
        ) {

                if (urlRoute === '#/') {
                return;
            } else {
                window.location.href = '#/';
                return;
            }
        }

        this.contentElement.innerHTML =
            await fetch(newRoute.template).then(response => response.text());
        this.stylesElement.setAttribute('href', newRoute.styles);
        this.pageTitleElement.innerText = newRoute.title;
        this.asideElement.style.display = (newRoute.route === '#/login' || newRoute.route === '#/sign-up') ? 'none' : 'block';

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const svgIcon = link.querySelector('svg');
            if (svgIcon) svgIcon.style.fill = '#052C65';
        });

        const activeLink: Element | null = document.querySelector(`.nav-link[href="${newRoute.route}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            const svgIcon = activeLink.querySelector('svg');
            if (svgIcon) svgIcon.style.fill = 'white';
        }

        const route: string = newRoute.route;

        if (route === '#/income' || route.startsWith('#/income/')) {
            this.navIncomeElement.classList.add('active');
            this.navCategoriesElement.classList.add('active');
            this.navCategoriesItemElement.classList.add('menu-open');
            this.navCategoriesElement.querySelectorAll('svg').forEach(svg => svg.style.fill = 'white');
            this.navCategoriesElement.style.borderBottomLeftRadius = '0';
            this.navCategoriesElement.style.borderBottomRightRadius = '0';
            this.navCategoriesElement.style.marginBottom = '0';
            this.navIncomeElement.style.borderRadius = '0';
            this.navIncomeElement.style.marginBottom = '0';
            this.navExpenseElement.style.borderTopLeftRadius = '0';
            this.navExpenseElement.style.borderTopRightRadius = '0';
            this.navExpenseElement.style.borderLeft = '1px solid #0D6EFD';
            this.navExpenseElement.style.borderRight = '1px solid #0D6EFD';
            this.navExpenseElement.style.borderBottom = '1px solid #0D6EFD';
        } else if (route === '#/expense' || route.startsWith('#/expense/')) {
            this.navExpenseElement.classList.add('active');
            this.navCategoriesElement.classList.add('active');
            this.navCategoriesItemElement.classList.add('menu-open');
            this.navCategoriesElement.querySelectorAll('svg').forEach(svg => svg.style.fill = 'white');
            this.navCategoriesElement.style.borderBottomLeftRadius = '0';
            this.navCategoriesElement.style.borderBottomRightRadius = '0';
            this.navCategoriesElement.style.marginBottom = '0';
            this.navIncomeElement.style.borderRadius = '0';
            this.navIncomeElement.style.marginBottom = '0';
            this.navExpenseElement.style.borderTopLeftRadius = '0';
            this.navExpenseElement.style.borderTopRightRadius = '0';
            this.navIncomeElement.style.borderLeft = '1px solid #0D6EFD';
            this.navIncomeElement.style.borderRight = '1px solid #0D6EFD';
        } else {
            this.navExpenseElement.style.border = 'none';
            this.navIncomeElement.style.border = 'none';
            this.navCategoriesItemElement.classList.remove('menu-open');
            this.navCategoriesElement.querySelectorAll('svg').forEach(svg => {
                svg.style.fill = '#052C65';
            });
        }

        newRoute.load();

        this.avatarElement.addEventListener('click', () => {
            if (!this.logoutDialogElement) return;
            this.logoutDialogElement.style.display = (this.logoutDialogElement.style.display === 'block') ? 'none' : 'block';
        });

        this.userNameElement.addEventListener('click', () => {
            if (!this.logoutDialogElement) return;
            this.logoutDialogElement.style.display = (this.logoutDialogElement.style.display === 'block') ? 'none' : 'block';
        });
    }
}
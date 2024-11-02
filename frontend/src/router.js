import {Index} from "./components/index";
import {Form} from "./components/form";
import {Auth} from "./services/auth";

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
                }
            },
            {
                route: '#/income/create',
                title: 'Создание категории дохода',
                template: 'templates/income-create.html',
                styles: 'styles/category.css',
                load: () => {
                }
            },
            {
                route: '#/income/edit',
                title: 'Редактировани категории дохода',
                template: 'templates/income-edit.html',
                styles: 'styles/category.css',
                load: () => {
                }
            },
            {
                route: '#/expenses',
                title: 'Расходы',
                template: 'templates/expenses.html',
                styles: 'styles/income.css',
                load: () => {
                }
            },
            {
                route: '#/expenses/create',
                title: 'Создание категории расхода',
                template: 'templates/expenses-create.html',
                styles: 'styles/category.css',
                load: () => {
                }
            },
            {
                route: '#/expenses/edit',
                title: 'Редактировани категории расхода',
                template: 'templates/expenses-edit.html',
                styles: 'styles/category.css',
                load: () => {
                }
            },
            {
                route: '#/income-expenses',
                title: 'Доходы и расходы',
                template: 'templates/income-expenses.html',
                styles: 'styles/income-expenses.css',
                load: () => {
                }
            },
            {
                route: '#/income-expenses/create',
                title: 'Создание дохода/расхода',
                template: 'templates/income-expenses-create.html',
                styles: 'styles/category.css',
                load: () => {
                }
            },
            {
                route: '#/income-expenses/edit',
                title: 'Редактирование дохода/расхода',
                template: 'templates/income-expenses-edit.html',
                styles: 'styles/category.css',
                load: () => {
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

        if (newRoute.route !== '#/login' && newRoute.route !== '#/sign-up') {
            const accessToken = localStorage.getItem(Auth.accessTokenKey);
            if (!accessToken) {
                window.location.href = '#/login';
                return;
            }
        }

        document.getElementById('content').innerHTML =
            await fetch(newRoute.template).then(response => response.text());
        document.getElementById('styles').setAttribute('href', newRoute.styles);
        document.getElementById('page-title').innerText = newRoute.title;

        const asideElement = document.querySelector('aside');
        asideElement.style.display = (newRoute.route === '#/login' || newRoute.route === '#/sign-up') ? 'none' : 'block';

        document.querySelectorAll('.nav-link').forEach(link => {
            const svgIcon = link.querySelector('svg');
            const navIncome = document.getElementById('nav-income');
            const navExpenses = document.getElementById('nav-expenses');
            const navCategories = document.getElementById('nav-categories');
            if (link.getAttribute('href') === newRoute.route) {
                link.classList.add('active');
                if (svgIcon) {
                    svgIcon.style.fill = 'white';
                }
                if (newRoute.route === '#/income' || newRoute.route === '#/expenses') {
                    navCategories.classList.add('active');
                    navCategories.querySelectorAll('svg').forEach(svgIcon => {
                        svgIcon.style.fill = 'white';
                    });
                    navCategories.style.borderBottomLeftRadius = '0';
                    navCategories.style.borderBottomRightRadius = '0';
                    navCategories.style.marginBottom = '0';
                    navIncome.style.borderRadius = '0';
                    navIncome.style.marginBottom = '0';
                    navExpenses.style.borderTopLeftRadius = '0';
                    navExpenses.style.borderTopRightRadius = '0';
                    if (newRoute.route === '#/income') {
                        navExpenses.style.borderLeft = '1px solid #0D6EFD'
                        navExpenses.style.borderRight = '1px solid #0D6EFD'
                        navExpenses.style.borderBottom = '1px solid #0D6EFD'
                    }
                    if (newRoute.route === '#/expenses') {
                        navIncome.style.borderLeft = '1px solid #0D6EFD'
                        navIncome.style.borderRight = '1px solid #0D6EFD'
                    }
                } else {
                    navExpenses.style.border = 'none';
                    navIncome.style.border = 'none';
                    navCategories.querySelectorAll('svg').forEach(svgIcon => {
                        svgIcon.style.fill = '#052C65';
                    });
                }
            } else {
                link.classList.remove('active');
                if (svgIcon) {
                    svgIcon.style.fill = '#052C65';
                }
            }
        });

        newRoute.load();

        document.getElementById('avatar').addEventListener('click', () => {
            const logoutDialog = document.getElementById('logout');
            if (logoutDialog.style.display === 'block') {
                logoutDialog.style.display = 'none';
            } else {
                logoutDialog.style.display = 'block';
            }
        });
    }

}

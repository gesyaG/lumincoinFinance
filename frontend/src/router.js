import {Index} from "./components/index";

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
                }
            },
            {
                route: '#/login',
                title: 'Вход',
                template: 'templates/login.html',
                styles: 'styles/login.css',
                load: () => {
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
                title: 'Доходы',
                template: 'templates/expenses.html',
                styles: 'styles/income.css',
                load: () => {
                }
            },
            {
                route: '#/expenses/create',
                title: 'Создание категории дохода',
                template: 'templates/expenses-create.html',
                styles: 'styles/category.css',
                load: () => {
                }
            },
            {
                route: '#/expenses/edit',
                title: 'Редактировани категории дохода',
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
        const newRoute = this.routes.find(item => {
            return item.route === window.location.hash.split('?')[0];
        });

        if (!newRoute) {
            window.location.href = '#/';
            return;
        }

        document.getElementById('content').innerHTML =
            await fetch(newRoute.template).then(response => response.text());
        document.getElementById('styles').setAttribute('href', newRoute.styles);
        document.getElementById('page-title').innerText = newRoute.title;

        const asideElement = document.querySelector('aside');

        if (newRoute.route === '#/login' || newRoute.route === '#/sign-up') {
            asideElement.style.display = 'none';
        } else {
            asideElement.style.display = 'block';
        }

        newRoute.load();
    }
}

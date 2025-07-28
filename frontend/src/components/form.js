import {CustomHttp} from "../services/custom-http.js";
import {Auth} from "../services/auth.js";
import config from "../../config/config.js";

export class Form {

    constructor(page) {
        this.processElement = null;
        this.page = page;

        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (accessToken && this.page === 'signup') {
            location.href = '#/';
            return;
        }

        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\_-]?\w+)*@\w+([\_-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            },
        ];

        if (this.page === 'signup') {
            this.fields.unshift(
                {
                    name: 'name',
                    id: 'name',
                    element: null,
                    regex: /^[А-ЯЁ][а-яё]+(?:\s[А-ЯЁ][а-яё]+){2}$/,
                    valid: false,
                },
            )
            this.fields.push(
                {
                    name: 'confirmPassword',
                    id: 'confirm-password',
                    element: null,
                    regex: null,
                    valid: true,
                }
            );
        }

        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this);
            }
        })

        this.processElement = document.getElementById('process-button');
        this.processElement.onclick = function () {
            that.processForm();
        }
    }

    validateField(field, element) {
        if (field.id === 'confirm-password') {
            const passwordValue = this.fields.find(f => f.id === 'password').element.value;
            field.valid = element.value === passwordValue;
        } else {
            field.valid = element.value && element.value.match(field.regex);
        }

        if (!field.valid) {
            element.classList.add('is-invalid');
        } else {
            element.classList.remove('is-invalid');
        }

        this.validateForm();
    }

    validateForm() {
        const validForm = this.fields.every(item => item.valid);
        if (validForm) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
        return validForm;
    }

    async processForm() {
        if (this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;


            if (this.page === 'signup') {
                const fullName = this.fields.find(item => item.name === 'name').element.value.trim();

                const [name, ...lastNameArr] = fullName.split(' ');
                const lastName = lastNameArr.join(' ');

                try {
                    const result = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: name,
                        lastName: lastName,
                        email: email,
                        password: password,
                        passwordRepeat: this.fields.find(item => item.name === 'confirmPassword').element.value
                    });
                    if (result) {
                        if (result.error || !result.user) {
                            throw new Error(result.message);
                        }

                        location.href = '#/';
                    }
                } catch (error) {
                    return console.log(error);
                }
            }

            try {
                this.commonErrorMeElement = document.getElementById('common-error');
                this.commonErrorMeElement.style.display = 'none';

                const result = await CustomHttp.request(config.host + '/login', 'POST', {
                    email: email,
                    password: password,
                });

                // Проверяем, что ответ пришел и является объектом
                if (!result || typeof result !== 'object') {
                    throw new Error('Некорректный ответ от сервера');
                }

                // Проверяем, есть ли в ответе данные

                if (!result.tokens || !result.tokens.accessToken || !result.tokens.refreshToken ||
                    !result.user || !result.user.name || !result.user.lastName || !result.user.id) {
                    throw new Error(result.message || 'Ошибка авторизации');
                }

                // Сохраняем токены
                Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);

                // Сохраняем информацию о пользователе
                Auth.setUserInfo({
                    fullName: `${result.user.name} ${result.user.lastName}`,
                    userId: result.user.id,
                    email: email
                });

                // Перенаправляем на главную страницу
                location.href = "#/";
            } catch (error) {
                console.log(error);

                // Показываем ошибку
                if (this.commonErrorMeElement) {
                    this.commonErrorMeElement.innerText = error.message;
                    this.commonErrorMeElement.style.display = 'block';
                }
            }

        }
    }
}
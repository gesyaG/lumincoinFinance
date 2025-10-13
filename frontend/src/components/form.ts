import {CustomHttp} from "../services/custom-http";
import {Auth} from "../services/auth";
import {FormFieldType} from "../types/form-field.type";
import {SignupResponseType} from "../types/signup-response.type";
import {LoginResponseType} from "../types/login-response.type";

export class Form {
    private commonErrorMeElement: HTMLElement | null;
    readonly processElement: HTMLElement | null;
    readonly page: 'signup' | 'login';
    private  fields: FormFieldType[] = [];

    constructor(page: 'signup' | 'login') {
        this.commonErrorMeElement = null;
        this.processElement = null;
        this.page = page;

        const accessToken: string | null = localStorage.getItem(Auth.accessTokenKey);
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
        this.fields.forEach((item: FormFieldType) => {
            item.element = document.getElementById(item.id) as HTMLInputElement;
            if (item.element) {
                item.element.onchange = function () {
                    that.validateField.call(that, item, <HTMLInputElement>this);
                }
            }
        })

        this.processElement = document.getElementById('process-button');
        if (this.processElement) {
            this.processElement.onclick = function () {
                that.processForm();
            }
        }
    }

    private validateField(field: FormFieldType, element: HTMLInputElement): void {
        if (field.id === 'confirm-password') {
            const passwordField: FormFieldType | undefined = this.fields.find(f => f.id === 'password');
            const passwordValue: string = passwordField?.element instanceof HTMLInputElement
                ? passwordField.element.value
                : '';

            field.valid = element.value === passwordValue;
        } else {
            const value: string = element.value ?? '';
            const regex: RegExp | null = field.regex;
            let matches: boolean = false;

            if (value && regex) {
                if (regex instanceof RegExp) {
                    matches = regex.test(value);
                } else {
                    try {
                        matches = new RegExp(regex).test(value);
                    } catch {
                        matches = false;
                    }
                }
            }

            field.valid = matches;
        }

        if (!field.valid) {
            element.classList.add('is-invalid');
        } else {
            element.classList.remove('is-invalid');
        }

        this.validateForm();
    }

    private validateForm(): boolean {
        const validForm: boolean = this.fields.every(item => item.valid);
        if (!this.processElement) return false;
        if (validForm) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
        return validForm;
    }

    private async processForm(): Promise<void> {
        if (this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email')?.element?.value;
            const password = this.fields.find(item => item.name === 'password')?.element?.value;


            if (this.page === 'signup') {
                const fullName = this.fields.find(item => item.name === 'name')?.element?.value.trim() ?? '';

                const [name, ...lastNameArr] = fullName.split(' ');
                const lastName = lastNameArr.join(' ');

                try {
                    const result: SignupResponseType = await CustomHttp.request('/signup', 'POST', {
                        name: name,
                        lastName: lastName,
                        email: email,
                        password: password,
                        passwordRepeat: this.fields.find(item => item.name === 'confirmPassword')?.element?.value
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
                if (this.commonErrorMeElement) {
                    this.commonErrorMeElement.style.display = 'none';
                }

                const result: LoginResponseType = await CustomHttp.request('/login', 'POST', {
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
                    email: email ?? ''
                });

                // Перенаправляем на главную страницу
                location.href = "#/";
            } catch (error) {
                console.log(error);
                const err = error as Error;
                // Показываем ошибку
                if (this.commonErrorMeElement) {
                    this.commonErrorMeElement.innerText = err.message;
                    this.commonErrorMeElement.style.display = 'block';
                }
            }

        }
    }
}
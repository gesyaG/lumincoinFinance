import {CustomHttp} from "../services/custom-http.js";

export class Common {

    constructor() {
        this.balance = null;
        this.userNameElement = null;

        this.init();
    }

    async init() {
        try {
            const result = await CustomHttp.request('/balance');
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }

                this.balance = result.balance;
            }

           this.userNameElement = document.getElementById("user-name");

            if (this.userNameElement && localStorage.userInfo) {
            try {
                const userInfo = JSON.parse(localStorage.userInfo); 
                this.userNameElement.textContent = userInfo.fullName;
            } catch (e) {
                console.error("Ошибка при парсинге userInfo:", e);
            }
            }
        } catch (error) {
            return console.log(error);
        }

        this.getBalance();
    }

    getBalance() {
        const balanceElement = document.getElementById('balance');
        balanceElement.innerText = this.balance;
    }
}
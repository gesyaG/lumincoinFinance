import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Common {

    constructor() {
        this.balance = null;

        this.init();
    }

    async init() {
        try {
            const result = await CustomHttp.request(config.host + '/balance');
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }

                this.balance = result.balance;
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
import {CustomHttp} from "../services/custom-http";
import {UserInfoType} from "../types/user-info.type";

export class Common {
    private balance: number | null;
    private userNameElement: HTMLElement | null;

    constructor() {
        this.balance = null;
        this.userNameElement = null;

        this.init();
    }

    private async init(): Promise<void> {
        try {
            const result: { balance: number } = await CustomHttp.request('/balance');
            this.balance = result.balance;
            this.userNameElement = document.getElementById("user-name");

            if (this.userNameElement && localStorage.userInfo) {
                try {
                    const userInfo: UserInfoType | null = JSON.parse(localStorage.userInfo);
                    if (userInfo) {
                        this.userNameElement.textContent = userInfo.fullName;
                    }
                } catch (e) {
                    console.error("Ошибка при парсинге userInfo:", e);
                }
            }
        } catch (error) {
            console.log(error);
            return;
        }

        this.getBalance();
    }

    private getBalance(): void {
        const balanceElement: HTMLElement | null = document.getElementById('balance');
        if (this.balance && balanceElement) {
            balanceElement.innerText = this.balance.toString();
        }
    }
}
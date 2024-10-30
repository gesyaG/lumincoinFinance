import config from "../../config/config.js";

export class Auth {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoKey = 'userInfo';

    static setTokens(accessToken, refreshToken) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    static setUserInfo(info) {
        localStorage.setItem(this.userInfoKey, JSON.stringify(info));
    }

    static setUserEmail(email) {
        localStorage.setItem('email', JSON.stringify(email));
    }

    static redirectIfNotAuthenticated() {
        const accessToken = localStorage.getItem(this.accessTokenKey);
        if (!accessToken) {
            location.href = '#/login'
        }
    }

}
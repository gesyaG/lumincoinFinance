import {Auth} from "./auth.js";
import config from "../../config/config.js";

export class CustomHttp {
    static async request(url, method = 'GET', body = null) {
        const params = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            }
        };

        let token = localStorage.getItem(Auth.accessTokenKey);
        if (token) {
            params.headers['x-auth-token'] = token; 
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        const response = await fetch(config.host + url, params);

        if (response.status < 200 || response.status >= 300) {
            if (response.status === 401) {
                const result = await Auth.processUnauthorizedResponse();
                if (result) {
                    let newToken = localStorage.getItem(Auth.accessTokenKey);
                    if (newToken) {
                        params.headers['x-auth-token'] = newToken; 
                    }
                    return await this.request(url, method, body);
                } else {
                    return null;
                }
            }

            throw new Error(response.message);
        }

        return await response.json();
    }
}
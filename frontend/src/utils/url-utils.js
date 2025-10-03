export class UrlUtils {
    static getUrlParam(param) {
        const hash = window.location.hash;
        const queryString = hash.includes('?') ? hash.split('?')[1] : '';
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get(param);
    }
}

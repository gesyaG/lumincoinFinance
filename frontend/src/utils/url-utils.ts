export class UrlUtils {
    public static getUrlParam(param: string): string | null {
        const hash: string = window.location.hash;
        const queryString: string | undefined = hash.includes('?') ? hash.split('?')[1] : '';
        const urlParams: URLSearchParams = new URLSearchParams(queryString);
        return urlParams.get(param);
    }
}
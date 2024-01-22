import axios from 'axios';

export default class Api {
    private static instance: Api;

    url: string;

    constructor(baseUrl: string) {
        this.url = baseUrl;
    }

    public static getInstance(baseUrl: string | undefined = undefined) {
        return Api.instance || (Api.instance = new Api(baseUrl || ''));
    }
}

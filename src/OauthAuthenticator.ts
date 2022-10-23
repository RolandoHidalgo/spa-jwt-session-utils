import {AxiosAuthUtils} from "./axios-config";
import {saveTokens} from "./index";

export type AuthenticatorOptions = {
    tokenEndpoint: string;
    clientId: string;
    clientSecret: string;
}


export class OauthAuthenticator {
    private options: AuthenticatorOptions;
    private axiosUtils: AxiosAuthUtils;


    constructor(options: AuthenticatorOptions) {
        this.options = options;
        this.axiosUtils = new AxiosAuthUtils(this.options.clientSecret, this.options.clientId);
    }

    public clientCredentialsLogin(userName: string, password: string) {
        const form = new FormData();
        form.append('username', userName);
        form.append('password', password);
        form.append('grant_type', 'password');
        return new Promise((resolve, reject) => {
            this.axiosUtils.loginRequestConfig().post(this.options.tokenEndpoint, form).then((data: any) => {
                const {access_token: accessToken, refresh_token: refreshToken} = data;
                saveTokens({accessToken, refreshToken});
                resolve(data);
            }).catch(error => reject(error))
        })

    }
}

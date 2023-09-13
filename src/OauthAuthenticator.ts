import {AxiosAuthUtils} from "./axios-config";
import {getTokens, saveTokens} from "./tokenUtils";
import  {AxiosInstance} from "axios";
import {TokenData} from "./tokenUtils";

export type AuthenticatorOptions = {
    tokenEndpoint: string;
    clientId: string;
    clientSecret: string;
    onRefreshTokenExpires?: Function;

}


export class OauthAuthenticator {
    private options: AuthenticatorOptions;
    private axiosUtils: AxiosAuthUtils;


    constructor(options: AuthenticatorOptions) {
        this.options = options;
        this.axiosUtils = new AxiosAuthUtils(this.options.clientSecret, this.options.clientId);
    }

    public async clientCredentialsLogin(userName: string, password: string): Promise<TokenData> {
        const form = new FormData();
        form.append('username', userName);
        form.append('password', password);
        form.append('grant_type', 'password');
        return new Promise<TokenData>((resolve, reject) => {
            this.axiosUtils.loginRequestConfig().post(this.options.tokenEndpoint, form).then((data: any) => {
                const {access_token: accessToken, refresh_token: refreshToken} = data;
                saveTokens({accessToken, refreshToken});
                resolve(data);
            }).catch(error => reject(error))
        })

    }

    private storeTokens(tokens: any): void {
        const {access_token: accessToken, refresh_token: refreshToken} = tokens;
        saveTokens({accessToken, refreshToken});
    }

    public refreshToken(): Promise<TokenData> {
        return new Promise<TokenData>((resolve, reject) => {
            this.axiosUtils.refreshTokenRequest(<string>getTokens().refreshToken, this.options.onRefreshTokenExpires).post(this.options.tokenEndpoint).then(data => {
                this.storeTokens(data);
                resolve(data);
            }).catch(error => reject(error))
        })

    }


    public secureRequest(): AxiosInstance {
        const secureRequest = this.axiosUtils.secureRequest(getTokens().accessToken);
        secureRequest.interceptors.response.use((response) => response, async error => {
            if (error.response.status === 401) {

                const data: TokenData = await this.refreshToken();
                error.config.headers.Authorization = `Bearer ${data.accessToken}`;
                secureRequest.request(error.config)

            } else {
                return Promise.reject(error)
            }
        });
        return secureRequest;
    }
}

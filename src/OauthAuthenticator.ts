import {AxiosAuthUtils} from "./axios-config";
import {getTokens, saveTokens} from "./tokenUtils";
import {AxiosInstance, AxiosResponse, isAxiosError} from "axios";
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
        try {
            const form = new FormData();
            form.append('username', userName);
            form.append('password', password);
            form.append('grant_type', 'password');
            const {data} = await this.axiosUtils.loginRequestConfig().post<TokenData, AxiosResponse<TokenData>>(this.options.tokenEndpoint, form);
            saveTokens(data);
            return data;
        } catch (err: any) {
            throw this.parseError(err);
        }


    }

    private parseError(err: any) {
        return isAxiosError(err) ? err.message : 'error happend';
    }

    private storeTokens(tokens: any): void {
        const {access_token: accessToken, refresh_token: refreshToken} = tokens;
        saveTokens({accessToken, refreshToken});
    }

    public async refreshToken(): Promise<TokenData> {
        try {
            const {data} = await this.axiosUtils.refreshTokenRequest(<string>getTokens().refreshToken, this.options.onRefreshTokenExpires)
                .post<TokenData, AxiosResponse<TokenData>>(this.options.tokenEndpoint);
            this.storeTokens(data);
            return data;
        } catch (err: any) {
            throw this.parseError(err)
        }


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

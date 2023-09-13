import axios, {AxiosInstance} from "axios";

axios.defaults.timeout = 30000;

export class AxiosAuthUtils {
    private readonly clientSecret: string;
    private readonly clientId: string;


    constructor(clientSecret: string, clientId: string) {
        this.clientSecret = clientSecret;
        this.clientId = clientId;
    }

    public loginRequestConfig(): AxiosInstance {
        const Oauth2Login = axios.create({
            auth: {
                password: this.clientSecret,
                username: this.clientId
            },

        });
        Oauth2Login.interceptors.request.use(
            (config) => config,
            (error) => Promise.reject(error)
        );

        const responseValidate = (error: any) => {
            if (!error.response) {
                return 'conexion error'
            }

            if (error.response.data.error === 'invalid_grant') {
                return error.response.data.error_description
            } else {
                return error.response.data.error
            }
        };

        Oauth2Login.interceptors.response.use(
            (response) => response,
            (error) => Promise.reject(responseValidate(error))
        );

        return Oauth2Login;
    }

    public refreshTokenRequest(refreshToken: string, onRefreshTokenExpires?): AxiosInstance {
        // Refresh token axios instance and interceptors
        const Oauth2RefreshToken = axios.create({
            auth: {
                password: this.clientSecret,
                username: this.clientSecret
            },
            params: {
                grant_type: 'refresh_token'
            }
        });
        Oauth2RefreshToken.defaults.params.refresh_token = refreshToken;
        Oauth2RefreshToken.interceptors.response.use(
            (response) => response,
            (error) => Promise.reject(responseValidateRefreshToken(error))
        );

        function responseValidateRefreshToken(error: any) {
            if (!error.response) {
                return 'conexion error'
            }

            if (error.response.status === 401) {
                onRefreshTokenExpires?.();
            } else {
                return error.response.data.error
            }
        }

// end of Refresh token axios instance and interceptors

        return Oauth2RefreshToken;
    }

    public secureRequest(token): AxiosInstance {
        const secureRequest = axios.create();
        secureRequest.interceptors.request.use(
            (config) => {
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
                return config
            }
        );
        return secureRequest;
    }
}







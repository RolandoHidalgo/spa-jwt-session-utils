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
                return 'Error en la conexión con el servidor'
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
}

// Axios instances for OAuth2 Login  and interceptors





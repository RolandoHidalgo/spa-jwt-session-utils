/***
 * @description
 * @type TokenData
 * An object representing both, access_token and refresh_token value.
 * */

type TokenData = {
    accessToken: string | null;
    refreshToken?: string | null;
};

const setCookie = (name: any, value: any, expDays = "") => {
    document.cookie = `${name}=${value};path=/`;
};

const getCookie = (cname: string) => {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (const i of ca) {
        let c = i;
        while (c.charAt(0) === " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};

/***
 * @description
 * Usefully for store access and refresh tokens.
 *
 * @param data
 * a TokenData object containing access and refresh token values.
 *
 * */
const saveTokens = (data: TokenData) => {
    localStorage.setItem("access_token", data.accessToken as string);
    if (data.refreshToken) {
        localStorage.setItem("refresh_token", data.refreshToken);
    }
    setCookie("is_auth", true);
};

/***
 * @description
 * Usefully for retrieve access and refresh tokens.
 *
 * @returns TokenData
 * values for access and refresh token
 *
 * */
const getTokens = (): TokenData => {
    return {
        accessToken: localStorage.getItem("access_token"),
        refreshToken: localStorage.getItem("refresh_token"),
    };
};
/***
 * @description
 * Usefully for clear access and refresh tokens.
 *
 * */
const clearStore = () => {
    localStorage.clear();
    setCookie("is_auth", false);
};
/***
 * @description
 * Usefully for know when an user close browser without logout.
 *
 * @returns boolean
 *
 * whether the user did or did not close the browser
 *
 * */
const isUserStillAuth = (): boolean => {
    const isAuthCookie = getCookie("is_auth");
    return isAuthCookie !== "" && isAuthCookie !== "false";
};

/***
 * @description
 * An Enumeration with the fallowing values:
 * USER_NOT_LOGOUT: user close browser but did not log Out.
 * USER_LOGOUT: user did log Out.
 *
 * @param data
 * a TokenData object containing access and refresh token values.
 *
 * */

enum SessionState {
    USER_NOT_LOGOUT,
    USER_LOGOUT,
}

/***
 * @description
 * Usefully for know the state of a session.
 *
 *
 * @returns SessionState.
 *
 * */
const getSessionState = (): SessionState => {
    if (!isUserStillAuth() && getTokens().accessToken) {
        return SessionState.USER_NOT_LOGOUT;
    }
    return SessionState.USER_LOGOUT;
};
/***
 * @description
 * Usefully for know if the user close the browser and did not log out.
 *
 *
 * @returns SessionState.
 *
 * */
const shouldForceLogOut = (): boolean => {
    return getSessionState() === SessionState.USER_NOT_LOGOUT;
};


export {
    saveTokens,
    getTokens,
    SessionState,
    getSessionState,
    isUserStillAuth,
    TokenData,
    clearStore,
    shouldForceLogOut,
};

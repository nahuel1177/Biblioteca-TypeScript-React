/* eslint-disable @typescript-eslint/no-explicit-any */
import lscache from "lscache";
import { IResponseLogin } from "../interfaces/loginInterface";

const tokenkey = "tokenkey";
const loggedInkey = "loggedInkey";
const duration = 86400000;

interface ILocalStorage {
  set: (user: IResponseLogin) => void;
  get: () => IResponseLogin;
  delete: () => void;
  setLoggedIn: (token: string) => void;
  getLoggedIn: () => IResponseLogin;
}

const localStorage: ILocalStorage = {
  set: (user) => {
    lscache.set(tokenkey, user, duration);
  },
  get: () => {
    const data = lscache.get(tokenkey);
    return data;
  },
  delete: () => lscache.flush(),
  setLoggedIn: (token) => lscache.set(loggedInkey, token, duration),
  getLoggedIn: () => lscache.get(loggedInkey),
};
export { localStorage };
import axios, { AxiosError } from "axios";
// import localStorage from './localStorage'

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  timeout: 1000 * 15, // 15 sec
  // headers: {
  //   Accept: 'application/json',
  //   'Content-Type': 'application/json',
  // },
});

api.interceptors.request.use(
  (config) => {
    // const data = localStorage.get() // Before request is sent
    // if (data) {
    //   // eslint-disable-next-line no-param-reassign
    //   config.headers.common.Authorization = `${data.token}`
    // }
    return config;
  },
  (error: AxiosError) => Promise.reject(error) 
);

api.interceptors.response.use(
  (response) => response.data, 
  (error: AxiosError) =>
    Promise.reject(console.log(error))
);

export { api };
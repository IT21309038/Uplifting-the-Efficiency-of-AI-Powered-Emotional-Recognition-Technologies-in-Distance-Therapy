import axios from "axios";

const BaseURL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
    baseURL: BaseURL,
})
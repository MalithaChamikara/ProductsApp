import axios from "axios";
import Config from "react-native-config";

const api = axios.create({
    baseURL: Config.API_BASE_URL,
    timeout: Number(Config.APP_TIMEOUT),
});

// Define a response interceptor to handle errors globally
api.interceptors.response.use(
    res => res,
    err => {
        const message = err.response?.data?.message || err.message || "Something went wrong";
        return Promise.reject(new Error(message));

    }
)

export const fetchProducts     = ()           => api.get('/products');
export const fetchProductById  = (id: number) => api.get(`/products/${id}`);
export const fetchCategories   = ()           => api.get('/categories');
export const fetchByCategory   = (slug: string) => api.get(`/categories/${slug}/products`);
export const searchProducts    = (query: string)  => api.get(`/products/search?q=${encodeURIComponent(query)}`);


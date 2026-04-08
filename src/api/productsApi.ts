import axios from "axios";
import Config from "react-native-config";

const api = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: Number(Config.APP_TIMEOUT),
});

api.interceptors.request.use(request => {
  console.log("[API request]", {
    method: request.method,
    baseURL: request.baseURL,
    url: request.url,
    timeout: request.timeout,
  });

  return request;
});

api.interceptors.response.use(
  response => {
    console.log("[API response]", {
      status: response.status,
      method: response.config.method,
      baseURL: response.config.baseURL,
      url: response.config.url,
    });

    return response;
  },
  err => {
    const isNetworkError = !err.response;
    const message = isNetworkError
      ? `Network request failed. baseURL=${Config.API_BASE_URL || "<missing>"}. If you are using the Android emulator, use http://10.0.2.2:<port> instead of localhost.`
      : err.response?.data?.message || err.message || "Something went wrong";

    console.log("[API error]", {
      message: err.message,
      baseURL: Config.API_BASE_URL,
      url: err.config?.url,
      method: err.config?.method,
      status: err.response?.status,
      data: err.response?.data,
    });

    return Promise.reject(new Error(message));
  }
);

export const fetchProducts = () => api.get('/products');
export const fetchProductById = (id: number) => api.get(`/products/${id}`);
export const fetchCategories = () => api.get('/categories');
export const fetchByCategory = (slug: string) => api.get(`/categories/${slug}/products`);
export const searchProducts = (query: string) => api.get(`/products/search?q=${encodeURIComponent(query)}`);

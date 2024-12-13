// apiClient.ts
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
class ApiClient {
  private instance: AxiosInstance;

  constructor(baseURL: string, config?: AxiosRequestConfig) {
    this.instance = axios.create({
      baseURL,
      ...config, // Allow overriding default config
    });

    // Add interceptors for request/response handling if needed
    this.instance.interceptors.request.use((config) => {
      // e.g., Add auth token
      return config;
    });

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            // Handle HTTP errors (status codes >= 400)
            switch (error.response.status) {
              case 400:
                // Bad Request: Show a specific error message to the user
                console.error('Bad Request:', error.response.data);
                break;
              case 401:
                // Unauthorized: Redirect to login or refresh token
                console.error('Unauthorized:', error.response.data);
                break;
              case 403:
                // Forbidden: Show an access denied message
                console.error('Forbidden:', error.response.data);
                break;
              case 404:
                // Not Found: Show a "resource not found" message
                console.error('Not Found:', error.response.data);
                break;
              case 500:
                // Internal Server Error: Show a generic error message
                console.error('Internal Server Error:', error.response.data);
                break;
              default:
                // Other HTTP error: Show a generic error message
                console.error('HTTP Error:', error.response.data);
            }
          } else if (error.request) {
            // Request was made but no response received
            console.error('No response received:', error.request);
          } else {
            // Something happened in setting up the request
            console.error('Error setting up request:', error.message);
          }
        } else {
          // Not an Axios error, handle other types of errors
          console.error('Unexpected error:', error);
        }

        // Optionally show a generic error notification to the user

        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.get(url, config);
    return response.data;
  }

  public async post<T, B>(url: string, data?: B, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.post(url, data, config);
    return response.data;
  }

  // Add other methods (put, delete, patch) as needed
}

export default ApiClient;

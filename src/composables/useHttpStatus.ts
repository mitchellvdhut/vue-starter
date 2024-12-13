import type { Ref } from 'vue'
import { ref } from 'vue'
import { AxiosError, isAxiosError } from 'axios'
import ApiClient from '@/api/apiClient.ts'

const httpStatusApi = new ApiClient('https://httpstat.us/');

export default function useHttpStatus() {
  const status = ref();
  const loading: Ref<boolean> = ref(false);
  const error: Ref<AxiosError | null> = ref(null);

  const MAX_RETRIES = 3;

  const getStatus = async (statusCode: string) => {
    loading.value = true
    let retries = 0;

    while (retries < MAX_RETRIES) {
      try {

        status.value = await httpStatusApi.get('/' + statusCode)
        break;
      } catch (err) {
        retries++
        error.value = err as AxiosError
        if (
          isAxiosError(err) &&
          (err.response?.status === 500 || // Internal Server Error
            err.code === 'ECONNABORTED' || // Timeout
            err.code === 'ENOTFOUND') // Network error
        ) {
          console.warn(`Retry attempt ${retries} for fetching status ${statusCode}`);
          // You might want to add a delay before retrying (e.g., using setTimeout)
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
        } else {
          // For other errors, don't retry and re-throw the error
          console.error('Error fetching user:', error);
          throw error;
        }
      } finally {
        loading.value = false
      }
    }

    if (retries === MAX_RETRIES) {
      // If the maximum number of retries is reached
      console.error(`Failed to fetch after ${MAX_RETRIES} retries`);
      error.value = new AxiosError('Failed to fetch user. Please try again later.');
    }
  };
  return { status, loading, error, getStatus };
}

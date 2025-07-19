import { ref } from 'vue'
import api from '@/api/api.ts'
import type { Ref } from 'vue'
import type { AxiosError } from 'axios'
import type { Person } from '@/types'

export default function usePeople() {
  const people: Ref<Person[]> = ref<Person[]>([]);
  const loading: Ref<boolean> = ref(false);
  const error: Ref<AxiosError | null> = ref(null);

  const fetchPeople = async () => {
    loading.value = true;
    try {
      people.value = await api.get<Person[]>('/people');
    } catch (err) {
      error.value = err as AxiosError;
    } finally {
      loading.value = false;
    }
  };

  return { people, loading, error, fetchPeople };
}

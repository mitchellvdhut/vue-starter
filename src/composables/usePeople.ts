import { ref } from 'vue'
import api from '@/api/api.ts'
import type { AxiosError } from 'axios'
import type { Person } from '@/types'

export default function usePeople() {
  const people = ref<Person[]>([] as Person[])
  const loading = ref<boolean>(false)
  const error = ref<AxiosError | null>(null)

  const fetchPeople = async () => {
    loading.value = true
    try {
      people.value = await api.get<Person[]>('/people')
    } catch (err) {
      error.value = err as AxiosError
    } finally {
      loading.value = false
    }
  }

  return { people, loading, error, fetchPeople }
}

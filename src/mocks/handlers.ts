// src/mocks/handlers.js
import { http, HttpResponse } from 'msw'

const generatePeople = (count: number) => {
  const people = []
  for (let i = 0; i < count; i++) {
    people.push({
      id: i,
      firstName: `FirstName${i + 1}`,
      lastName: `LastName${i + 1}`,
    })
  }
  return people
}

export const handlers = [
  http.get('https://localhost:8000/people', () => {
    return HttpResponse.json(generatePeople(100))
  }),
]

// export const handlers = [
//   http.get('https://localhost:8000/people', () => {
//     return HttpResponse.json({
//       id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
//       firstName: 'John',
//       lastName: 'Maverick',
//     })
//   }),
// ]

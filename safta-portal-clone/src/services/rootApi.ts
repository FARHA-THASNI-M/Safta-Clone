
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const rootApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dev-portal.safta.sa/api/v1' }),
  endpoints: () => ({}),
})
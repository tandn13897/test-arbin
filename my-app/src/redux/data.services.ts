import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { iotDataType } from '../type/table-type';

export const dataApi = createApi({
    reducerPath: 'dataApi',
    keepUnusedDataFor: 10,
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:4000/'
    }),
    endpoints: build => ({
        getData: build.query<iotDataType[], {}>({
            query:() => 'posts',
        })
    })
})

export const { useGetDataQuery } = dataApi;
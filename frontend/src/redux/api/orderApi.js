import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const orderApi = createApi({
    //reducerPath/reducerName is the name of reducer it should pass in our store as reducer name
    reducerPath:"orderApi",
    //in baseQuery we need to setup our baseurl in BE
    baseQuery:fetchBaseQuery({baseUrl: "/api/v1"}),
    // define our endpoints, here we are fetching data we should use query function
    //query: An endpoint definition that retrieves data
    endpoints:(builder) => ({
        createNewOrder : builder.mutation({
            query(body) {
                return {
                    url:`/orders/new`,
                    method:'POST',
                    body,
                };
            },
        })
       
    }),
});

export const { useCreateNewOrderMutation } = orderApi;
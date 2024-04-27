import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const productApi = createApi({
    //reducerPath/reducerName is the name of reducer it should pass in our store as reducer name
    reducerPath:"productApi",
    //in baseQuery we need to setup our baseurl in BE
    baseQuery:fetchBaseQuery({baseUrl: "/api/v1"}),
    // define our endpoints, here we are fetching data we should use query function
    //query: An endpoint definition that retrieves data
    endpoints:(builder) => ({
        getProducts : builder.query({
            query: (params) =>({
                url: "/products",
                params:{
                    page : params?.page
                }
            }),
        }),
        getProductDetails : builder.query({
            query: (id) => `/products/${id}`,
        }), 
       
    }),
});

export const {  useGetProductsQuery, useGetProductDetailsQuery } = productApi;
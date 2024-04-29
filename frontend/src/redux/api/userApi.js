import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { setUser, setIsAuthenticated, setLoading } from '../features/userSlice';

export const userApi = createApi({
    reducerPath:"userApi",
    baseQuery:fetchBaseQuery({baseUrl: "/api/v1"}),
    tagTypes:["User"],
    endpoints:(builder) => ({
       getMe: builder.query({
        query: () => `/me`,
        transformResponse: (result) => result.user,
        async onQueryStarted(args, { dispatch, queryFulfilled }){
            try {
                const {data} = await queryFulfilled;
                dispatch(setUser(data));
                dispatch(setIsAuthenticated(true));
                dispatch(setLoading(false));
            }catch(error){
                dispatch(setLoading(false));
                console.log(error);
            }
        },
        providesTags:["User"]
       }),
       UpdateProfile: builder.mutation({
            query(body) {
                return {
                    url:'/me/update',
                    method:'PUT',
                    body,
                };
            },
            invalidatesTags:["User"]
       }),
       UploadAvatar: builder.mutation({
            query(body) {
                return {
                    url:'/me/upload_avatar',
                    method:'PUT',
                    body,
                };
            },
            invalidatesTags:["User"]
        }),
        UpdatePassword: builder.mutation({
            query(body) {
                return {
                    url:'/password/update',
                    method:'PUT',
                    body,
                };
            },
            invalidatesTags:["User"]
        }),
        ForgotPassword: builder.mutation({
            query(body) {
                return {
                    url:'/password/forgot',
                    method:'POST',
                    body,
                };
            },
            invalidatesTags:["User"]
        }),
    }),
});

export const { useGetMeQuery,
    useUpdateProfileMutation,
    useUploadAvatarMutation,
    useUpdatePasswordMutation,
    useForgotPasswordMutation
 } = userApi;
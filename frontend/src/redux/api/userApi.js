import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { setUser, setIsAuthenticated, setLoading } from '../features/userSlice';
import UpdateProfile from '../../components/user/UpdateProfile';
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
    }),
});

export const { useGetMeQuery, useUpdateProfileMutation, useUploadAvatarMutation  } = userApi;
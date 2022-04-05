import endpoints from 'constants/endpoints';
import { api } from 'services/api';

const targetApi = api.injectEndpoints({
  endpoints: builder => ({
    createTarget: builder.mutation({
      query: target => ({
        url: endpoints.TARGET,
        method: 'POST',
        body: { target },
      }),
    }),
    getTarget: builder.mutation({
      query: target => ({
        url: endpoints.TARGET,
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useCreateTargetMutation, useGetTargetMutation } = targetApi;

export const selectTarget = state => state.target;

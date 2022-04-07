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
    getTargets: builder.query({
      query: () => ({
        url: endpoints.TARGET,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useCreateTargetMutation, useGetTargetsQuery } = targetApi;

export const selectTarget = state => state.target;

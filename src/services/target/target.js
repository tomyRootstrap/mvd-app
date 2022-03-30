import endpoints from 'constants/endpoints';
import { api } from 'services/api';

const targetApi = api.injectEndpoints({
  endpoints: builder => ({
    createTarget: builder.mutation({
      query: target => ({
        url: endpoints.CREATE_TARGET,
        method: 'POST',
        body: { target },
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useCreateTargetMutation } = targetApi;

export const selectTarget = state => state.target;

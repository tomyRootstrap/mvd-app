import endpoints from 'constants/endpoints';
import { api } from 'services/api';

const profileApi = api.injectEndpoints({
  endpoints: builder => ({
    profilePassword: builder.mutation({
      query: body => ({
        url: endpoints.PROFILE_PASSWORD,
        body: body,
        method: 'PUT',
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useProfilePasswordMutation } = profileApi;

export const selectProfile = state => state.profile;

import endpoints from 'constants/endpoints';
import { api } from 'services/api';

const contactApi = api.injectEndpoints({
  endpoints: builder => ({
    contact: builder.mutation({
      query: body => ({
        url: endpoints.CONTACT,
        body: body,
        method: 'POST',
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useContactMutation } = contactApi;

export const selectContact = state => state.contact;

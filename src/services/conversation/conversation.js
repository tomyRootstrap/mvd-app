import endpoints from 'constants/endpoints';
import { api } from 'services/api';

const conversationApi = api.injectEndpoints({
  endpoints: builder => ({
    getConversation: builder.query({
      query: () => ({
        url: endpoints.CONVERSATION,
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useGetConversationQuery } = conversationApi;

export const selectConversation = state => state.conversation;

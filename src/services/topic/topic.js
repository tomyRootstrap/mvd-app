import endpoints from 'constants/endpoints';
import { api } from 'services/api';

const topicApi = api.injectEndpoints({
  endpoints: builder => ({
    topics: builder.mutation({
      query: () => ({
        url: endpoints.GET_TOPICS,
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useTopicsMutation } = topicApi;

export const selectTopics = state => state.topics;

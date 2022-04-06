import endpoints from 'constants/endpoints';
import { api } from 'services/api';

const topicApi = api.injectEndpoints({
  endpoints: builder => ({
    topics: builder.query({
      query: () => ({
        url: endpoints.GET_TOPICS,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useTopicsQuery } = topicApi;

export const selectTopics = state => state.topics;

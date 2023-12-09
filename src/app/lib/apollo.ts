// /lib/apollo.ts

import { ApolloClient, InMemoryCache } from '@apollo/client'

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        order_items: {
          merge(existing = [], incoming) {
            return [...incoming];
          },
        },
        usersAddress: {
          merge(existing, incoming) {
            return incoming ? incoming : existing;
          },
        },
        category: {
          merge(existing = [], incoming) {
            return [...incoming];
          },
        },
      },
    },
    product: {
      fields: {
        product_image: {
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
        category: {
          merge(existing = [], incoming) {
            return [...incoming];
          },
        },
      },
    },
  },
});

const apolloClient = new ApolloClient({
  uri: '/api/graphql',
  cache,
})


export default apolloClient             
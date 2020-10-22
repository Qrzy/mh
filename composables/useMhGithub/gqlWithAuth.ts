import { graphql } from '@octokit/graphql';

export const gqlWithAuth = graphql.defaults({
  headers: {
    authorization: 'token e3623e679dc4b24ae1b66b7c349b1c635dd1c79f',
  },
});

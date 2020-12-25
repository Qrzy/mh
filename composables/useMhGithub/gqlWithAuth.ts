import { graphql } from '@octokit/graphql';

export const gqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${GH_TOKEN}`,
  },
});

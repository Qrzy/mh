const { graphql } = require('@octokit/graphql');

module.exports = graphql.defaults({
  headers: {
    authorization: `token ${process.env.GH_TOKEN}`,
  },
});

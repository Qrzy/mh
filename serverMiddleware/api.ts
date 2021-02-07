const { graphql } = require('@octokit/graphql');
const bodyParser = require('body-parser');
const express = require('express');

const query = `
query RepoFiles($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    object(expression: "master:") {
      ... on Tree {
        entries {
          name
          type
          #mode
          object {
            ... on Blob {
              byteSize
              #text
              # isBinary
            }
            ... on Tree {
              entries {
                name
                type
                object {
                  ... on Blob {
                    byteSize
                    text
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

const gqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${process.env.GH_TOKEN}`,
  },
});

const getMhGithubRepo = async (mhNumber: string) => {
  const { repository } = await gqlWithAuth(query, {
    owner: 'polskimathandel',
    name: 'PolskiMathandel.github.io',
  });
  return repository.object.entries
    .find((entry: any) => entry.name === `Polski MatHandel #${mhNumber}`)
    ?.object.entries.filter((entry: any) => (entry.name as string).endsWith('.txt'));
};

const app = express();
app.use(bodyParser.json());

// @ts-ignore
app.get('/mhGithubRepo', async (req, res) => {
  const mhNumber = req.query.mhNo;
  const repo = await getMhGithubRepo(mhNumber);
  res.json(repo);
  res.end();
});

module.exports = app;

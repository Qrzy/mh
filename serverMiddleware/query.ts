module.exports = `
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

const gqlWithAuth = require('./gqlWithAuth');
const query = require('./query');

module.exports = async (mhNumber: string) => {
  const { repository } = await gqlWithAuth(query, {
    owner: 'polskimathandel',
    name: 'PolskiMathandel.github.io',
  });
  return repository.object.entries
    .find((entry: any) => entry.name === `Polski MatHandel #${mhNumber}`)
    ?.object.entries.filter((entry: any) => (entry.name as string).endsWith('.txt'));
};

import { computed, Ref, ref } from '@nuxtjs/composition-api';
import { gqlWithAuth } from './gqlWithAuth';
import { query } from './query';
import { UseMhGithub } from './types';

const repoData = ref<any>(null);
const loading = ref(false);
const mhNumber: Ref<number | null> = ref(null);

const GLOBAL_TRADE_LINE_REGEX = /\((?:\w+)\)\s+(?:\d+)\s+receives\s+\((?:\w+)\)\s+(?:\d+)\s+and\s+sends\s+to\s+\((?:\w+)\)\s+(?:\d+)/g;
const TRADE_LINE_DETAILS_REGEX = /\((?<owner>\w+)\)\s+(?<ownerGame>\d+)\s+receives\s+\((?<receivesFrom>\w+)\)\s+(?<receivesGame>\d+)\s+and\s+sends\s+to\s+\((?<sendsTo>\w+)\)\s+(?<sendsFor>\d+)/;

const loadMhRepo = async (): Promise<void> => {
  loading.value = true;
  const { repository } = await gqlWithAuth(query, {
    owner: 'polskimathandel',
    name: 'PolskiMathandel.github.io',
  });
  repoData.value = repository;
  loading.value = false;
};

const getFileName = (file: any): string => file?.name;

const getFileNameWithoutExt = (file: any): string => getFileName(file).replace(/\.[a-z]+$/i, '');

const getFileContent = (file: any) => file?.object?.text;

const setMhNumber = (number: number | null) => (mhNumber.value = number);

const chosenMhFiles = computed(() =>
  repoData.value?.object.entries
    .find((entry: any) => entry.name === `Polski MatHandel #${mhNumber.value}`)
    ?.object.entries.filter((entry: any) => (entry.name as string).endsWith('.txt')),
);

const resultsFiles = computed(() =>
  chosenMhFiles.value?.filter(
    (file: any) => file.name.startsWith('Wyniki wstepne') || file.name.startsWith('Wyniki koncowe'),
  ),
);

const getResultsFileContent = (filename: string | null) =>
  getFileContent(resultsFiles.value?.find((file: any) => file?.name === filename));

const getTrades = (filename: string | null) => {
  const match = getResultsFileContent(filename)?.match(GLOBAL_TRADE_LINE_REGEX);
  return match?.map((line: string) => line.match(TRADE_LINE_DETAILS_REGEX)?.groups);
};

export const useMhGithub = (): UseMhGithub => {
  return {
    repoData: computed(() => repoData.value),
    loadMhRepo,
    loading: computed(() => loading.value),
    setMhNumber,
    chosenMhFiles,
    resultsFiles,
    getFileNameWithoutExt,
    getResultsFileContent,
    getTrades,
  };
};

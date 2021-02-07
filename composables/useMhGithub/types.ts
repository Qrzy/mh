import { ComputedRef } from '@nuxtjs/composition-api';

interface GithubFile {
  name: string;
  object: {
    text: string;
  };
}

export interface MhTrade {
  owner: string;
  ownerGame: string;
  receivesFrom: string;
  receivesGame: string;
  sendsTo: string;
  sendsFor: string;
}

export interface UseMhGithub {
  repoData: ComputedRef<any>;
  loadMhRepo: () => Promise<void>;
  loading: ComputedRef<boolean>;
  setMhNumber: (number: string | null) => void;
  resultsFiles: ComputedRef<GithubFile[]>;
  getFileNameWithoutExt: (file: GithubFile | null) => string;
  getResultsFileContent: (filename: string | null) => string;
  getTrades: (filename: string | null) => MhTrade[];
}

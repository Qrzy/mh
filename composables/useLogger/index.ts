/* eslint-disable no-console */
export const useLogger = () => {
  return {
    info: console.log,
    warn: console.warn,
    error: console.error,
  };
};

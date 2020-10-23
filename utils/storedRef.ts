import { customRef, Ref } from '@nuxtjs/composition-api';
import { storageAdapter } from './storageAdapter';

export const storedRef = <T>(key: string, value: T): Ref<T> => {
  const savedValue = storageAdapter.get<T>(key);
  let actualValue = savedValue ?? value;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return actualValue;
      },
      set(newValue: T) {
        actualValue = newValue;
        storageAdapter.save(key, actualValue);
        trigger();
      },
    };
  });
};

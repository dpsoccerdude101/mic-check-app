import { AES, enc } from 'crypto-js';
import { storeEncryptKey } from 'src/constants/appConstants';

const persist = (config, name: string) => (set, get, api) => {
  const initialState = config(
    (args) => {
      set(args);
      const stringData = JSON.stringify(get());
      const encryptedData = AES.encrypt(stringData, storeEncryptKey).toString();
      window.localStorage.setItem(name, encryptedData);
    },
    get,
    api,
  );
  let restoredState = {};
  if (typeof window !== 'undefined') {
    const stringByteData = localStorage.getItem(name);
    if (stringByteData) {
      const decryptedBytes = AES.decrypt(stringByteData, storeEncryptKey);
      const stringData = decryptedBytes.toString(enc.Utf8);
      restoredState = JSON.parse(stringData);
    }
  }

  return {
    ...initialState,
    ...restoredState,
  };
};

export default persist;

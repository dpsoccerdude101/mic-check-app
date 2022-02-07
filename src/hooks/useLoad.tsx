import { useContext } from 'react';
import { LoadContext } from '../contexts';

const useLoad = () => useContext(LoadContext);

export default useLoad;

import { useContext } from 'react';
import { DataTableContext } from '../contexts';

const useDataTable = () => useContext(DataTableContext);
export default useDataTable;

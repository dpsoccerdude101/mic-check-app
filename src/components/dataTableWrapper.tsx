import DataTableHeader from './dataTableHeader';
import DataTable from './dataTable';
import { Action, Column, ListResponse } from 'src/types';
import PaginationOptions from 'src/types/data-table/pagination-options';

interface DataTableProps<T> {
    headerText: string;
    actionButtonText: string;
    noResultText: string;
    fetchData: (
        rowsPerPage: number,
        skipCount: number
    ) => Promise<ListResponse<T>>;
    onSearch: (
        searchValue: string,
        rowsPerPage: number,
        skipCount: number
    ) => Promise<ListResponse<T>>;
    addHandler: () => void;
    columns: Column[];
    rowActions: Action[];
    paginationOptions?: PaginationOptions
}

const DataTableWrapper = <T,>({
    columns,
    rowActions,
    headerText,
    actionButtonText,
    noResultText,
    fetchData,
    onSearch,
    addHandler,
    paginationOptions
}: DataTableProps<T>) => {
    const defaultPaginationOptions: PaginationOptions = {
        rowsPerPage: [5, 10, 50, 100],
    };

    const options = paginationOptions ? paginationOptions : defaultPaginationOptions;

    return (
        <>
            <DataTableHeader
                onAdd={addHandler}
                headerText={headerText}
                buttonText={actionButtonText}
            />
            <DataTable
                fetchData={fetchData}
                onSearch={onSearch}
                columns={columns}
                rowActions={rowActions}
                noRecordsMessage={noResultText}
                paginationOptions={options}
            />
        </>
    );
};

export default DataTableWrapper;

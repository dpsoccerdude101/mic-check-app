import { Fragment, useCallback, useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  TableSortLabel,
  makeStyles,
  Typography,
  Box,
  debounce,
} from '@material-ui/core';
import CustomLoader from 'src/components/custom/customLoader';
import type {
  Action,
  Column,
  ListResponse,
} from 'src/types';
import { SearchBar } from 'src/components';
import PaginationOptions from 'src/types/data-table/pagination-options';
import { useDataTable } from 'src/hooks';

const useStyles = makeStyles({
    root: {
        marginTop: '20px',
        width: '100%',
    },
    header: {
      fontWeight: 'bold',
    },
    actionsCell: {
      width: '40%'
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px'
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    }
});

type DataTableProps<T> = {
  columns: Column[];
  rowActions: Action[];
  noRecordsMessage: string;
  paginationOptions: PaginationOptions;
  fetchData: (rowsPerPage: number, skipCount: number) => Promise<ListResponse<T>>;
  onSearch: (text: string, rowsPerPage: number, skipCount: number) => Promise<ListResponse<T>>;
};

type Order = 'asc' | 'desc';

const DataTable = <T,>({
    columns,
    noRecordsMessage,
    rowActions,
    paginationOptions,
    fetchData,
    onSearch,
}: DataTableProps<T>) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { reload, setReloadGrid } = useDataTable();

  const [sortOrder, setSortOrder] = useState<Order>('asc');
  const defaultSortColumn = columns.filter(x => x.sortable);
  const [orderBy, setOrderBy] = useState(defaultSortColumn.length > 0 ? defaultSortColumn[0].id : '');
  const [hoverRowId, setHoverRowId] = useState('');

  const [searchText, setSearchText] = useState('');

  const fixedActions = rowActions.filter(p => p.fixed);
  const actions = rowActions.filter(p => !p.fixed);

  const handleSort = (column) => {
    const isAsc = orderBy === column && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const descendingComparator = (a: T, b: T, orderBy: string) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };
  
  const getComparator = (order: Order, orderBy: string): (a: T, b: T) => number => {
      return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const loadData = async (rowsPerPage: number, currentPage: number) => {
    setLoading(true);

    const skip = rowsPerPage * currentPage;
    const data = await fetchData(rowsPerPage, skip);

    setList(data.items);
    setTotalCount(data.totalCount);
    setPage(currentPage)
    setRowsPerPage(rowsPerPage);

    setLoading(false);
  };

  useEffect(() => {
    if (searchText && searchText.length !== 0) {
      searchByName(searchText, rowsPerPage, page, false);
    } else {
      loadData(rowsPerPage, page);
    }
    setReloadGrid(false);
  }, [rowsPerPage, page, reload]);

  const handleChangePage = (e, newPage) => {
      setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
      setRowsPerPage(+e.target.value);
      setPage(0);
  };

  const renderNoResults = () => (
      <Typography variant="h2">{noRecordsMessage}</Typography>
  );

  const searchByName = useCallback(
    debounce(async (text: string, rows: number, currentPage: number, rePaginate: boolean = true) => {
      const skip = rows * currentPage;
      const data = await onSearch(text, rows, skip);
      if (rePaginate && rows >= data.totalCount) {
        setRowsPerPage(5);
        setPage(0);
      } else {
        setPage(currentPage);
        setRowsPerPage(rows);
      }
      setList(data.items);
      setTotalCount(data.totalCount);
    }, 500), []
  );

  const renderTable = () => (
    <Paper className={classes.root}>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} className={classes.header}>
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy == column.id}
                      direction={orderBy === column.id ? sortOrder : 'asc' }
                      onClick={() => handleSort(column.id)}>
                      {column.label}{' '}
                      
                      {orderBy === column.id ? (
                        <Box component="span" className={classes.visuallyHidden}>
                          {sortOrder === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  ) : (
                    <>{column.label}</>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>

            {list
              .slice()
              .sort(getComparator(sortOrder, orderBy))
              .map((row: any) => (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={row.id}
                  onMouseEnter={() => setHoverRowId(row.id) }
                  onMouseLeave={() => setHoverRowId('') }>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (column.id !== 'actions' 
                    ? <TableCell
                        key={column.id}>
                        {column.format
                          ? column.format(value)
                          : value}
                      </TableCell>
                    : <TableCell
                        key={column.id}
                        className={classes.actionsCell}>
                        <div className={classes.actions}>
                          {actions.map((action: Action) => (
                            (hoverRowId === row.id ? <div key={action.id} onClick={async () => action.onClick(row)}>{action.label}</div> : '')
                          ))}
                          {fixedActions.map((action) => (
                            (<div key={action.id} onClick={async () => action.onClick(row)}>{action.label}</div>)
                          ))}
                        </div>
                      </TableCell>);
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={paginationOptions.rowsPerPage}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage} />
    </Paper>
  );

  const renderTableIfNeeded = () => {
      if (loading) return <CustomLoader />;

      if (totalCount > 0) {
          return renderTable();
      }

      return renderNoResults();
  };

  return (
    <Fragment>
      <SearchBar
        placeholder="Search by Name"
        value={searchText}
        onChange={(searchValue: string) => {
          setSearchText(searchValue);
          searchByName(searchValue, rowsPerPage, page);
        }}
        cancelOnEscape={true}
        disabled={false}
        onCloseSearch={() => {
          setSearchText('');
          searchByName('', rowsPerPage, page);
        }} />
        {renderTableIfNeeded()}
    </Fragment>
    );
};

export default DataTable;

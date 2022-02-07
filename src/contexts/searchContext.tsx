import { createContext, FC, useReducer } from 'react';
import { ChildrenProps } from 'src/types';
import PropTypes from 'prop-types';

export interface SearchState {
  isSearchOpen: boolean;
  searchText: string;
}

const initialState: SearchState = {
  isSearchOpen: false,
  searchText: ''
};

interface SearchContextValue extends SearchState {
  setSearchText: (value: string) => void;
  closeSearch: () => void;
  openSearch: () => void;
}

const SearchContext = createContext<SearchContextValue>({
  ...initialState,
  setSearchText: () => { },
  closeSearch: () => { },
  openSearch: () => { }
});

type SetSearchTextAction = {
  type: 'SET_SEARCH_TEXT',
  payload: {
    value: string
  }
};

type CloseSearchAction = {
  type: 'CLOSE_SEARCH'
};

type OpenSearchAction = {
  type: 'OPEN_SEARCH'
};

type Action = SetSearchTextAction | CloseSearchAction | OpenSearchAction;

const handlers: Record<string, (state: SearchState, action: Action) => SearchState> = {
  SET_SEARCH_TEXT: (state: SearchState, action: SetSearchTextAction): SearchState => {
    const { value } = action.payload;
    return {
      ...state,
      searchText: value
    };
  },
  CLOSE_SEARCH: (): SearchState => ({
    isSearchOpen: false,
    searchText: ''
  }),
  OPEN_SEARCH: (state: SearchState): SearchState => ({
    ...state,
    isSearchOpen: true
  })
};

const searchReducer = (state: SearchState, action: Action): SearchState => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

export const SearchProvider: FC<ChildrenProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(searchReducer, initialState);

  const setSearchText = (value: string): void => {
    dispatch({ type: 'SET_SEARCH_TEXT', payload: { value } });
  };

  const closeSearch = (): void => {
    dispatch({ type: 'CLOSE_SEARCH' });
  };

  const openSearch = (): void => {
    dispatch({ type: 'OPEN_SEARCH' });
  };

  return (
    <SearchContext.Provider value={{ ...state, setSearchText, closeSearch, openSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

SearchProvider.propTypes = {
  children: PropTypes.node.isRequired
};
export default SearchContext;

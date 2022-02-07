import { createContext, FC, useReducer } from 'react';
import { ChildrenProps } from 'src/types';
import PropTypes from 'prop-types';
import BandSocialMedia from 'src/types/band/bandSocialMedia';

export interface BandLinksState {
  links: BandSocialMedia[];
}

const initialState: BandLinksState = {
  links: []
};

interface BandLinksContextValue extends BandLinksState {
  addOrUpdateLink: (link: BandSocialMedia) => Promise<void>;
  setLinks: (newLinks: BandSocialMedia[]) => Promise<void>;
}

const BandLinksContext = createContext<BandLinksContextValue>({
  ...initialState,
  addOrUpdateLink: () => Promise.resolve(),
  setLinks: () => Promise.resolve()
});

type AddOrUpdateLinkAction = {
  type: 'ADD_OR_UPDATE_LINK',
  payload: {
    link: BandSocialMedia
  }
};

type SetLinksAction = {
  type: 'SET_LINKS',
  payload: {
    newLinks: BandSocialMedia[]
  }
};

type Action = AddOrUpdateLinkAction | SetLinksAction;

const handlers: Record<string, (state: BandLinksState, action: Action) => BandLinksState> = {
  ADD_OR_UPDATE_LINK: (state: BandLinksState, action: AddOrUpdateLinkAction): BandLinksState => {
    const { link } = action.payload;
    const { links } = state;
    const existentLink = links.find((el) => el.bandId === link.bandId && el.socialMediaId === link.socialMediaId);
    if (!existentLink) {
      const newLinks = [...links, ...[link]];
      return {
        ...state,
        links: newLinks
      };
    }
    const updatedLinks = links;
    updatedLinks[links.findIndex((el) => el.bandId === link.bandId && el.socialMediaId === link.socialMediaId)].url = link.url;
    return {
      ...state,
      links: updatedLinks
    };
  },

  SET_LINKS: (state: BandLinksState, action: SetLinksAction): BandLinksState => {
    const { newLinks } = action.payload;
    return {
      ...state,
      links: newLinks
    };
  }
};

const BandLinksReducer = (state: BandLinksState, action: Action): BandLinksState => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

export const BandLinksProvider: FC<ChildrenProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(BandLinksReducer, initialState);

  const addOrUpdateLink = async (link: BandSocialMedia): Promise<void> => dispatch({ type: 'ADD_OR_UPDATE_LINK', payload: { link } });

  const setLinks = async (newLinks: BandSocialMedia[]): Promise<void> => dispatch({ type: 'SET_LINKS', payload: { newLinks } });

  return (
    <BandLinksContext.Provider value={{ ...state, addOrUpdateLink, setLinks }}>
      {children}
    </BandLinksContext.Provider>
  );
};

BandLinksProvider.propTypes = {
  children: PropTypes.node.isRequired
};
export default BandLinksContext;

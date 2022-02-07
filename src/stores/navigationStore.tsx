import create from 'zustand';
import { isIOS } from 'react-device-detect';
import { navigationStoreLabel } from 'src/constants/appConstants';
import persist from './persist';

interface NavigationState {
  isNavBarVisible: boolean;
  hideNavBar: () => void;
  showNavBar: () => void;

  isSearchBarVisible: boolean;
  hideSearchBar: () => void;
  showSearchBar: () => void;

  isBackArrowVisible: boolean;
  hideBackArrow: () => void;
  showBackArrow: () => void;

  title: string;
  setTitle: (value: string) => void;

  resetNavBar: () => void;
}

const useNavigationStore = create<NavigationState>(
  persist(
    (set) => ({
      isNavBarVisible: true,
      hideNavBar: () => {
        set((state: NavigationState) => ({ ...state, isNavBarVisible: false }));
      },
      showNavBar: () => {
        set((state: NavigationState) => ({ ...state, isNavBarVisible: true }));
      },

      isSearchBarVisible: true,
      hideSearchBar: () => {
        set((state: NavigationState) => ({ ...state, isSearchBarVisible: false }));
      },
      showSearchBar: () => {
        set((state: NavigationState) => ({ ...state, isSearchBarVisible: false }));
      },

      isBackArrowVisible: isIOS,
      hideBackArrow: () => {
        set((state: NavigationState) => ({ ...state, isBackArrowVisible: false }));
      },
      showBackArrow: () => {
        set((state: NavigationState) => ({ ...state, isBackArrowVisible: true }));
      },

      title: null,
      setTitle: (value: string) => {
        set((state: NavigationState) => ({ ...state, title: value }));
      },

      resetNavBar: () => {
        set(() => ({
          title: null,
          isBackArrowVisible: isIOS,
          isSearchBarVisible: true,
          isNavBarVisible: true
        }));
      }
    }),
    navigationStoreLabel
  )
);

export default useNavigationStore;

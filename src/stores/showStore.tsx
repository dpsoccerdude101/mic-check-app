import { Address, Show, ShowBandDto } from 'src/types';
import create from 'zustand';
import MinimumAgeEnum from 'src/components/shows/minimumAgeEnum';
import ManagementTabsEnum from 'src/components/shows/management/managementTabsEnum';

interface ShowState {
  clear: () => void;

  setCurrentShow: (show: Show) => void;

  id: string;
  setId: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;

  date: Date;
  setDate: (value: Date) => void;

  startTime: Date;
  setStartTime: (value: Date) => void;

  endTime: Date;
  setEndTime: (value: Date) => void;

  pictureId: string;
  setPictureId: (newId: string) => void;

  venueName: string;
  setVenueName: (value: string) => void;
  address: Address;
  setAddress: (value: Address) => void;

  minimumAge: MinimumAgeEnum;
  setMinimumAge: (value: MinimumAgeEnum) => void;

  bands: ShowBandDto[];
  addBand: () => void;
  setBands: (value: ShowBandDto[]) => void;
  updateBandShow: (value: ShowBandDto, idx: number) => void;

  changeTab: (value: ManagementTabsEnum) => void;
  selectedTab: ManagementTabsEnum;
}

const emptyShow = {
  id: '',
  name: '',
  description: '',
  date: null,
  bands: [],
  pictureId: null,
  startTime: null,
  endTime: null,
  venueName: '',
  address: null,
  minimumAge: MinimumAgeEnum.All
};

const initialState: ShowState = {
  ...emptyShow,
  setId: () => { },
  setName: () => { },
  setDescription: () => { },
  setDate: () => { },
  setStartTime: () => { },
  setEndTime: () => { },
  setPictureId: () => { },
  setVenueName: () => { },
  setAddress: () => { },
  addBand: () => { },
  setBands: () => { },
  updateBandShow: () => { },
  setMinimumAge: () => { },
  clear: () => { },
  changeTab: () => { },
  selectedTab: ManagementTabsEnum.Details,
  setCurrentShow: () => { },
};

const getDefaultStartTime = (): Date => {
  let defaultDate = new Date();
  const hours = defaultDate.getHours();
  const minutes = defaultDate.getMinutes();
  if (hours > 20 || (hours === 20 && minutes > 25)) {
    const tomorrow = new Date();
    tomorrow.setDate(defaultDate.getDate() + 1);
    defaultDate = tomorrow;
  }
  defaultDate.setHours(20);
  defaultDate.setMinutes(30);
  return defaultDate;
};

const getEndTime = (startTime: Date): Date => {
  const tmp = new Date(startTime);
  // adding one hour
  tmp.setTime(tmp.getTime() + (1 * 60 * 60 * 1000));
  return tmp;
};

const useShowStore = create<ShowState>(
  (set, get) => (
    {
      ...initialState,
      clear: () => {
        set((state) => {
          const tmpStartTime = getDefaultStartTime();
          const tmpEndTime = getEndTime(tmpStartTime);
          return ({
            ...state,
            ...emptyShow,
            date: tmpStartTime,
            startTime: tmpStartTime,
            endTime: tmpEndTime,
            minimumAge: MinimumAgeEnum.All,
            selectedTab: ManagementTabsEnum.Details
          });
        });
      },
      addBand: () => {
        set((state: ShowState) => {
          const oldLineups = state.bands.slice();
          const newLineup: ShowBandDto = { bandId: null, band: null, startTime: null, endTime: null };
          if (oldLineups.length > 0) {
            const latestShowTime = new Date(oldLineups[oldLineups.length - 1].endTime);
            newLineup.startTime = latestShowTime;
            newLineup.endTime = getEndTime(latestShowTime);
          } else {
            const currentStartDate = get().date;
            const currentStartTime = get().startTime;
            currentStartDate.setHours(currentStartTime.getHours());
            newLineup.startTime = currentStartDate || getDefaultStartTime();
            newLineup.endTime = getEndTime(newLineup.startTime);
          }
          const newLineups = [...oldLineups, ...[newLineup]];
          return ({ ...state, bands: newLineups });
        });
      },
      setBands: (value: ShowBandDto[]) => {
        set((state: ShowState) => ({ ...state, bands: value }));
      },
      getLastShowDateTime: () => {
        let lastDate: Date = null;
        const { bands } = get();
        if (bands.length === 0) return null;
        bands.sort((a, b) => (a.endTime.getTime() - b.endTime.getTime()));
        lastDate = bands[0].endTime;
        return lastDate;
      },
      updateBandShow: (value: ShowBandDto, idx: number) => {
        set((state: ShowState) => {
          const newLineups = state.bands.map((item, i) => (i === idx ? value : item));
          return ({ ...state, bands: newLineups });
        });
      },
      setCurrentShow: (show: Show) => {
        set((state: ShowState) => {

          return ({
            ...state,
            id: show.id,
            name: show.name,
            description: show.description,
            date: new Date(show.date),
            startTime: new Date(new Date(show.date).getTime()),
            endTime: new Date(show.endTime),
            pictureId: show.pictureId,
            venueName: show.venueName,
            address: show.address,
            minimumAge: show.minimumAge,
            bands: show.bands
          });
        });
      },
      setMinimumAge: (value: MinimumAgeEnum) => set((state: ShowState) => ({ ...state, minimumAge: value })),
      setDate: (value: Date) => set((state: ShowState) => ({ ...state, date: value })),
      setStartTime: (value: Date) => set((state: ShowState) => ({ ...state, startTime: value })),
      setEndTime: (value: Date) => set((state: ShowState) => ({ ...state, endTime: value })),
      setId: (value: string) => set((state: ShowState) => ({ ...state, id: value })),
      setAddress: (value: Address) => set((state: ShowState) => ({ ...state, address: value })),
      setName: (value: string) => set((state: ShowState) => ({ ...state, name: value })),
      setDescription: (value: string) => set((state: ShowState) => ({ ...state, description: value })),
      setPictureId: (newId: string) => set((state: ShowState) => ({ ...state, pictureId: newId })),
      setVenueName: (value: string) => set((state: ShowState) => ({ ...state, venueName: value })),

      changeTab: (value: ManagementTabsEnum) => {
        set((state: ShowState) => ({ ...state, selectedTab: value }));
      }
    }
  )
);

export default useShowStore;

import { TicketInfo } from 'src/types';
import create from 'zustand';

interface TicketInfoState {
  clear: () => void;
  id?: string;
  showId: string;
  setShowId: (id: string) => void;
  price: number;
  setPrice: (value: number) => void;
  startDate: Date;
  setStartDate: (value: Date) => void;
  endDate: Date;
  setEndDate: (value: Date) => void;
  maximumCapacity: number;
  setMaximumCapacity: (value: number) => void;
  maximumPerUser: number;
  setMaximumPerUser: (value: number) => void;
  name: string;
  setName: (value: string) => void;
  note: string;
  setNote: (value: string) => void;
  clearTicket: () => void;
  setCurrentTicket: (value: TicketInfo) => void,

  tickets: TicketInfo[];
  addTicket: (value: TicketInfo) => void;
  setTickets: (value: TicketInfo[]) => void;
  updateTicket: (id: string, newValue: TicketInfo) => void;

  isTicketFormVisible: boolean;
  showTicketForm: (id?: string) => void;
  hideTicketForm: () => void;
}

const emptyTicket: TicketInfo = {
  id: null,
  showId: '',
  price: 0,
  startDate: new Date(),
  endDate: new Date(),
  maximumCapacity: 1,
  maximumPerUser: 1,
  name: '',
  note: ''
};

const initialState: TicketInfoState = {
  ...emptyTicket,
  clear: () => { },
  setShowId: () => { },
  setPrice: () => { },
  setStartDate: () => { },
  setEndDate: () => { },
  setMaximumCapacity: () => { },
  setMaximumPerUser: () => { },
  setName: () => { },
  setNote: () => { },
  setCurrentTicket: () => { },

  tickets: [],
  clearTicket: () => { },
  addTicket: () => { },
  setTickets: () => { },
  updateTicket: () => { },

  isTicketFormVisible: false,
  showTicketForm: () => { },
  hideTicketForm: () => { }
};

const useTicketInfoStore = create<TicketInfoState>(
  (set) => (
    {
      ...initialState,
      hideTicketForm: () => {
        set((state: TicketInfoState) => ({ ...state, isTicketFormVisible: false }));
      },
      showTicketForm: () => {
        set((state: TicketInfoState) => ({ ...state, isTicketFormVisible: true }));
      },
      clear: () => set((state: TicketInfoState) => ({ ...state, tickets: [], ...emptyTicket })),
      clearTicket: () => set((state: TicketInfoState) => ({ ...state, ...emptyTicket })),
      setShowId: (id: string) => set((state: TicketInfoState) => ({ ...state, showId: id })),
      setPrice: (value: number) => set((state: TicketInfoState) => ({ ...state, price: value })),
      setStartDate: (value: Date) => set((state: TicketInfoState) => ({ ...state, startDate: value })),
      setEndDate: (value: Date) => set((state: TicketInfoState) => ({ ...state, endDate: value })),
      setMaximumCapacity: (value: number) => set((state: TicketInfoState) => ({ ...state, maximumCapacity: value })),
      setMaximumPerUser: (value: number) => set((state: TicketInfoState) => ({ ...state, maximumPerUser: value })),
      setName: (value: string) => set((state: TicketInfoState) => ({ ...state, name: value })),
      setNote: (value: string) => set((state: TicketInfoState) => ({ ...state, note: value })),
      setCurrentTicket: (value: TicketInfo) => {
        set((state: TicketInfoState) => ({
          ...state,
          ...value
        }));
      },
      addTicket: (value: TicketInfo) => set((state: TicketInfoState) => ({ ...state, tickets: [...state.tickets, ...[value]] })),
      setTickets: (value: TicketInfo[]) => {
        set((state: TicketInfoState) => ({ ...state, tickets: value }));
      },
      updateTicket: (id: string, newValue: TicketInfo) => {
        set((state: TicketInfoState) => {
          const newTickets = state.tickets.map((item) => (item.id === id ? newValue : item));
          return ({ ...state, tickets: newTickets });
        });
      }
    })
);

export default useTicketInfoStore;

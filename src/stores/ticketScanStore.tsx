import TicketInstanceDetailsForScan from 'src/types/tickets/ticketInstanceDetailsForScan';
import create from 'zustand';

interface TicketScanState {
  isScanning: boolean;
  isLoading: boolean;

  ticketList: TicketInstanceDetailsForScan[];
  updateTicket: (ticket: TicketInstanceDetailsForScan) => void;
  setTicketList: (list: TicketInstanceDetailsForScan[]) => void;

  setLoading: (newValue: boolean) => void;
  toggleScanner: () => void;
}

const emptyState: any = {
  isScanning: false,
  isLoading: false,
  ticketList: []
};

const initialState: TicketScanState = {
  ...emptyState,
  updateTicket: () => { },
  setTicketList: () => { },

  setLoading: () => { },
  toggleScanner: () => { }
};

const useTicketScanStore = create<TicketScanState>(
  (set) => ({
    ...initialState,
    updateTicket: (ticket: TicketInstanceDetailsForScan) => set((state: TicketScanState) => {
      const { id } = ticket;
      const newList = state.ticketList.map((el) => (el.id === id ? ticket : el));
      return { ...state, ticketList: newList };
    }),

    setTicketList: (list: TicketInstanceDetailsForScan[]) => {
      set((state: TicketScanState) => ({ ...state, ticketList: list }));
    },
    setLoading: (newValue: boolean) => set((state: TicketScanState) => ({ ...state, isLoading: newValue })),
    toggleScanner: () => set((state: TicketScanState) => ({ ...state, isScanning: !state.isScanning }))
  })
);
export default useTicketScanStore;

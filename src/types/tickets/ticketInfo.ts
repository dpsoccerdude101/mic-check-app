type TicketInfo = {
    id?: string;
    showId: string;
    price: number;
    startDate: Date;
    endDate: Date;
    maximumCapacity: number;
    maximumPerUser: number;
    name: string;
    note: string;
};

export default TicketInfo;

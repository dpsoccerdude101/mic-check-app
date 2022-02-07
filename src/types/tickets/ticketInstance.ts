import TicketInfo from './ticketInfo';

type TicketInstance = {
    id: string;
    scannedAt: Date | null;
    ticketInfoId: string;
    ticketInfo: TicketInfo;
    qRCodeHash: string;
    userId: string;
    qrcodeFileId?: string;
    isAllocated?: boolean;
    // bandsSupported: TicketSupportedBandDto[];
};

export default TicketInstance;

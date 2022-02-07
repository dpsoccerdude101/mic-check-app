import ScanResult from './scanResult';

type TicketScanResponse = {
    // isAdmitted: boolean;
    lastScanResult: ScanResult;
    scanCount: number;
    lastScannedAt: Date | null;
    message: string;
};

export default TicketScanResponse;

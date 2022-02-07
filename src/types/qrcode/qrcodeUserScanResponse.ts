type QRCodeUserScanResponse = {
  userId: string;
  username: string;
  email: string;
  fullName: string;
  when: Date;
  showName?: string;
  showTime?: Date;
  showId?: string;
  bandName: string;
  bandId: string
};

export default QRCodeUserScanResponse;

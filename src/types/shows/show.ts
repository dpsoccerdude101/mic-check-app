import type FileModel from '../fileModel';
import type Address from '../address';
import type TicketInfo from '../tickets/ticketInfo';
import ShowBandDto from './showBandDto';

type Show = {
  id?: string;
  address?: Address;
  addressId?: number;
  bandId: string;
  bands: ShowBandDto[];
  creationTime?: Date;
  date: Date;
  endTime?: Date;
  description?: string;
  name: string;
  minimumAge: number;
  picture: FileModel;
  pictureId?: string;
  ticketInfos: TicketInfo[];
  ticketLink: string;
  venueName: string;
};

export default Show;

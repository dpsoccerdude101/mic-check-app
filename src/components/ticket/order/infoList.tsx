import { Box } from '@material-ui/core';
import { TicketInfo } from 'src/types';
import InfoListItem from './infoListItem';

type InfoListProps = {
  infos: TicketInfo[]
};

const InfoList = ({ infos }: InfoListProps) => (
  <Box
    display='flex'
    flexDirection='column'
    flexGrow={1}
    padding={2}
    width='100%'
  >
    {infos.map((info: TicketInfo) => <InfoListItem key={info.id} info={info} />)}
  </Box>
);

export default InfoList;

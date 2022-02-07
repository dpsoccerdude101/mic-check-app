import { ReactElement } from 'react';
import type { ChildrenProps } from 'src/types';
import { Box } from '@material-ui/core';

const RowWrapper = ({ children }: ChildrenProps): ReactElement => (
  <Box
    display='flex'
    justifyContent='space-between'
    alignItems='center'
    height='fit-content'
    width='100%'
  >
    {children}
  </Box>
);

export default RowWrapper;

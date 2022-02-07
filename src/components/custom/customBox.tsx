import { Box, Container } from '@material-ui/core';
import PropTypes from 'prop-types';

const CustomBox = ({ children }) => (
  <Box sx={{ minHeight: '100%' }}>
    <Container maxWidth='xl'>{children}</Container>
  </Box>
);

CustomBox.propTypes = {
  children: PropTypes.node.isRequired
};

export default CustomBox;

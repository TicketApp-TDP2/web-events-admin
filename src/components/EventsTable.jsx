import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
};

function createData(name, location, date, capacity) {
  return { name, location, date, capacity };
}

const rows = [
  createData('Festival de Música en Vivo', 'Palermo, Buenos Aires', '2023-05-24', '150/300'),
  createData('Conferencia Internacional de Tecnología y Innovación', 'Nueva Córdoba, Córdoba', '2023-05-24', '150/300' ),
  createData('Eclair', 'Palermo, Buenos Aires', '2023-05-24', '150/300'),
  createData('Frozen yoghurt', 'Palermo, Buenos Aires', '2023-05-24', '150/300'),
  createData('Gingerbread', 'Palermo, Buenos Aires', '2023-05-24', '150/300'),
  createData('Honeycomb', 'Palermo, Buenos Aires', '2023-05-24', '150/300'),
  createData('Ice cream sandwich', 'Palermo, Buenos Aires', '2023-05-24', '150/300'),
  createData('Jelly Bean', 'Palermo, Buenos Aires', '2023-05-24', '150/300'),
  createData('KitKat', 'Palermo, Buenos Aires', '2023-05-24', '150/300'),
  createData('Lollipop', 'Palermo, Buenos Aires', '2023-05-24', '150/300'),
  createData('Marshmallow', 'Palermo, Buenos Aires', '2023-05-24', '150/300'),
  createData('Nougat', 'Palermo, Buenos Aires', '2023-05-24', '150/300'),
  createData('Oreo', 'Palermo, Buenos Aires', '2023-05-24', '150/300'),
]

const rowsPerPage = 10;

export const EventsTable = () => {
  const [page, setPage] = React.useState(0);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell>Evento</TableCell>
            <TableCell align="center">Ubicación</TableCell>
            <TableCell align="center">Fecha</TableCell>
            <TableCell align="center">Capacidad</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell style={{ width: 160 }} align="center">
                {row.location}
              </TableCell>
              <TableCell style={{ width: 160 }} align="center">
                {row.date}
              </TableCell>
              <TableCell style={{ width: 160 }} align="center">
                {row.capacity}
              </TableCell>
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={3}
              count={rows.length}
              rowsPerPage={10}
              page={page}
              onPageChange={handleChangePage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
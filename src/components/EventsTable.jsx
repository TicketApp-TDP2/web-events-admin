import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { useContext, useEffect, useState } from "react";
import { getEvents } from "../services/eventService";
import { UserContext } from "../providers/UserProvider";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { State } from "./State";

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
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
};

const rowsPerPage = 10;

export const EventsTable = () => {
  const [page, setPage] = React.useState(0);
  const { user } = useContext(UserContext);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("use effect");
    async function fetchData() {
      console.log(user);
      if (user) {
        console.log("user.id: " + user.id);
        getEvents({ organizer: user.id }).then((res) => {
          const data = res.data.filter((event) => event.organizer === user.id);
          setRows(data);
          setIsLoading(false);
        });
      }
      setIsLoading(false);
    }

    fetchData();
  }, [user]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  if (rows.length === 0) {
    return (
      <Box style={{ height: "50em" }}>
        <Paper
          style={{
            padding: 10,
            margin: 10,
            textAlign: "center",
            marginTop: 50,
          }}
        >
          No tienes eventos registrados
        </Paper>
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 4,
      }}
    >
      <Table
        sx={{
          minWidth: 500,
        }}
        aria-label="custom pagination table"
      >
        <TableHead>
          <TableRow>
            <TableCell style={{ width: "20%" }}>Nombre</TableCell>
            <TableCell style={{ width: "20%" }} align="center">
              Ubicación
            </TableCell>
            <TableCell style={{ width: "20%" }} align="center">
              Fecha
            </TableCell>
            <TableCell style={{ width: "20%" }} align="center">
              Vacantes
            </TableCell>
            <TableCell style={{ width: "20%" }} align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow
              key={row.name}
              sx={{ backgroundColor: "#f3f1fc" }}
              hover
              selected
            >
              <TableCell sx={{ fontWeight: "bold" }}>
                <Button
                  onClick={() => {
                    navigate(`/events/${row.id}`);
                  }}
                  underline="hover"
                >
                  {row.name}
                </Button>
              </TableCell>
              <TableCell align="center">{row.location.description}</TableCell>
              <TableCell align="center">{row.date}</TableCell>
              <TableCell align="center">{row.vacants}</TableCell>
              <TableCell align="center">
                <State state={row.state} />
              </TableCell>
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} sx={{ backgroundColor: "#f3f1fc" }} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell />
            <TablePagination
              count={rows.length}
              onPageChange={handleChangePage}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[]}
              labelDisplayedRows={({ from, to, count }) => page + 1}
              labelRowsPerPage={null}
              nextIconButtonProps={{
                "aria-label": "Next Page",
                style: {
                  border: "2px solid",
                  borderRadius: "20%",
                  padding: "1px",
                },
              }}
              backIconButtonProps={{
                "aria-label": "Previous Page",
                style: {
                  border: "2px solid",
                  borderRadius: "20%",
                  padding: "1px",
                },
              }}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

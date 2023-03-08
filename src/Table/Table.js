import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { API_KEY } from '../Api/api_key';

function createData(
  date,
  name,
  id,
  estimated_diameter_min,
  estimated_diameter_max,
  potentially_haz,
  sentry_obj,
) {
  return {
    date,
    name,
    id,
    estimated_diameter_min,
    estimated_diameter_max,
    potentially_haz,
    sentry_obj,
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const [previousApproaches, setPreviousApproaches] = useState([]);
  const [nextApproaches, setNextApproaches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchNeoFromApi(id) {
    setIsLoading(true);
    const API_URL = `https://api.nasa.gov/neo/rest/v1/neo/${id}?api_key=${API_KEY}`
    const res = await fetch(API_URL);
    const json = await res.json();
    const closeApproachData = json.close_approach_data;
    const indexOfSearchedDate = closeApproachData.findIndex((approach) => approach.close_approach_date === row.date);

    // set previous approaches
    let prevAppr = [];
    for (let i = 1; i <= 5; i++) {
      if (closeApproachData[indexOfSearchedDate - i]) {
        const prev = closeApproachData[indexOfSearchedDate - i].close_approach_date.split('-').reverse().join('/');
        prevAppr.push(prev);
      } else break;
    }
    setPreviousApproaches(prevAppr);

    // set next approaches
    let nextAppr = [];
    for (let i = 1; i <= 5; i++) {
      if (closeApproachData[indexOfSearchedDate + i]) {
        const next = closeApproachData[indexOfSearchedDate + i].close_approach_date.split('-').reverse().join('/');
        nextAppr.push(next);
      } else break;
    }
    setNextApproaches(nextAppr);
    setIsLoading(false);
  }
  
  const toggleDrawer = () => {
    if (!open) {
      fetchNeoFromApi(row.id);
      setOpen(!open);
    } else {
      setOpen(!open);
    }
  }

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={toggleDrawer}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{`${Math.round(row.estimated_diameter_min)} - ${Math.round(row.estimated_diameter_max)}`}</TableCell>
        <TableCell align="right">{row.potentially_haz.toString()}</TableCell>
        <TableCell align="right">{row.sentry_obj.toString()}</TableCell>
      </TableRow>
      {/* <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Approaches
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Previous 5 approaches</TableCell>
                    <TableCell>Next 5 approaches</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.approaches.map((approachRow) => (
                    <TableRow key={approachRow.name}>
                      <TableCell component="th" scope="row">
                        "Previous five data"
                      </TableCell>
                      <TableCell component="th" scope="row">
                        "Next five Data"
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow> */}
    </React.Fragment>
  );
}

export default function CollapsibleTable({ data }) {
  const createRows = () => {
    const numOfDays = Object.keys(data).length;
    let rows = [];
    for (let i = 0; i < numOfDays; i++) {
      const date = Object.keys(data)[i];
      Object.values(data)[i].forEach((neo) => {
          const rowData = createData(date, neo.name, neo.id, neo.estimated_diameter.meters.estimated_diameter_min, neo.estimated_diameter.meters.estimated_diameter_max, neo.is_potentially_hazardous_asteroid, neo.is_sentry_object);
          rows.push(rowData);
      });
    }
    return rows.reverse();
  };

  const rows = createRows();

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell align="right">Estimated diameter (m)</TableCell>
            <TableCell align="right">Potentially hazardous?</TableCell>
            <TableCell align="right">Sentry object?</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            return <Row key={row.id} row={row} />
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
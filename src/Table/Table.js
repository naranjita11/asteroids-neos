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

function createData(
  name,
  estimated_diameter_min,
  estimated_diameter_max,
  potentially_haz,
  sentry_obj,
) {
  return {
    name,
    estimated_diameter_min,
    estimated_diameter_max,
    potentially_haz,
    sentry_obj,
    approaches: [
      {
        previousFive: [],
      },
      {
        nextFive: [],
      },
    ],
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
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
  let fullDataArray = [];

  if (Object.keys(data).length !== 0) {
    fullDataArray = [];
    const numOfDays = Object.keys(data).length;
    const dataWithoutDates = Object.values(data);
    for (let i = 0; i < numOfDays; i++) {
        const neosForThisDay = dataWithoutDates[i];
        fullDataArray = [...fullDataArray, ...neosForThisDay];
    }
    console.log('fullDataArray:', fullDataArray);
  }

  const createRows = () => {
    return fullDataArray.map((neo) => {
        return createData(neo.name, neo.estimated_diameter.meters.estimated_diameter_min, neo.estimated_diameter.meters.estimated_diameter_max, neo.is_potentially_hazardous_asteroid, neo.is_sentry_object);
    })
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
          {rows.map((row, i) => {
            return <Row key={row.name} row={row} />
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
import { useState } from 'react';
import './App.css';
import Typography from '@mui/material/Typography';
import { DatePicker  } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import CollapsibleTable from './Table/Table';
import { API_KEY } from './Api/api_key';

function App() {
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);
  const [elementCount, setElementCount] = useState(undefined);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [data, setData] = useState(undefined);
  const [displayErrMessage, setDisplayErrMessage] = useState(false);

  const setValue = (val, text) => {
    const month = val.$M + 1;
    const oneDigitMonth = month.toString().length === 1;
    const oneDigitDay = val.$D.toString().length === 1;
    const DATE = `${val.$y}-${oneDigitMonth ? '0'+month : month}-${oneDigitDay ? '0'+val.$D : val.$D}`;
    text === "start" ? setStartDate(DATE) : setEndDate(DATE);
  };

  async function fetchDataFromApi() {
    const API_URL = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`;
    setDisplayErrMessage(false);
    try {
      let res = await fetch(API_URL);
      if (!res.ok) {
        setIsFetchingData(false);
        setElementCount(undefined);
        setData(undefined);
        const error = await res.json();
        throw new Error(error.error_message);
      } else {
        const json = await res.json();
        setIsFetchingData(false);
        setElementCount(json.element_count);
        setData(json.near_earth_objects);
      }
    } catch (e) {
      setDisplayErrMessage(true);
      console.error(e);
    }
  }

  const onClick = () => {
    setIsFetchingData(true);
    fetchDataFromApi();
  }

  return (
    <>
      <Typography
        variant='h3'
        gutterBottom
      >
      Hello asteroids!
      </Typography>
      <Typography
        gutterBottom
        className='subtitle'
      >
        Choose a start and end date (up to 7 days apart) to discover which asteroids are nearby...
      </Typography>
      <div className="form-container">
        <DatePicker
          onChange={(newValue) => setValue(newValue, "start")}
          label="Start date"
          slotProps={{
            textField: {
              helperText: 'DD/MM/YYYY',
            },
          }}
          style={{
            backgroundColor: 'white',
          }}
        />
        <DatePicker
          onChange={(newValue) => setValue(newValue, "end")}
          label="End date"
          slotProps={{
            textField: {
              helperText: 'DD/MM/YYYY',
            },
          }}
        />
        <Button
          variant="contained"
          color="success"
          onClick={onClick}
          disabled={isFetchingData}
        >
          Find asteroids
        </Button>
      </div>
      {displayErrMessage &&
        <Typography className='error-text'>Something went wrong - please try again</Typography>}
      {isFetchingData &&
        <Typography className='fetching-text'>Fetching data - please wait...</Typography>}
      {elementCount &&
        <Typography variant='h5' className='info-text'>
          {`There are ${elementCount} asteroids nearby:`}
        </Typography>}
      {data && <CollapsibleTable
        data={data}
      />}
    </>
  );
}

export default App;

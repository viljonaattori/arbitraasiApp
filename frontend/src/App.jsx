import React, { useState, useEffect } from 'react';
import { 
  DataGrid 
} from '@mui/x-data-grid';
import { 
  createTheme, 
  ThemeProvider, 
  CssBaseline, 
  Typography, 
  Container, 
  Box 
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CalculatorModal from './components/CalculatorModal';

// Luo tumma teema
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    success: {
      main: '#4caf50',
    },
    error: {
      main: '#f44336',
    },
  },
});

// Funktio Tuotto % -sarakkeen renderointiin
const handleProfitRender = (params) => {
  const isPositive = params.value > 0;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', color: isPositive ? 'success.main' : 'error.main' }}>
      {isPositive ? <ArrowUpwardIcon fontSize="small" sx={{ mr: 0.5 }} /> : <ArrowDownwardIcon fontSize="small" sx={{ mr: 0.5 }} />}
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
        {params.value.toFixed(2)}%
      </Typography>
    </Box>
  );
};

// Funktio Ottelu-sarakkeen renderointiin (esim. kertoimien erottelu)
const handleEventRender = (params) => {
  const [event, team] = params.value.split(':');
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
        {team}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {event}
      </Typography>
    </Box>
  );
};

// Funktio Vetojen renderointiin (esim. bookkerin ja kertoimen erottelu)
const handleBetRender = (params) => {
  if (!params.value) return null;
  const [bookie, bet] = params.value.split('(');
  const [team, odds] = bet.replace(')', '').split('@');
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {bookie}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
        {team} <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 'bold' }}>(@{odds})</Typography>
      </Typography>
    </Box>
  );
};

const App = () => {
  const [rows, setRows] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/')
      .then(res => res.json())
      .then(data => setRows(data))
      .catch(err => console.error(err));
  }, []);

  const handleRowClick = (params) => {
    setSelectedMatch(params.row);
    setModalOpen(true);
  };

  // Määrittele sarakkeet
  const columns = [
    { field: 'time', headerName: 'Aika', width: 90 },
    { field: 'event', headerName: 'Ottelu', flex: 1, renderCell: handleEventRender },
    { field: 'profit', headerName: 'Tuotto %', width: 140, renderCell: handleProfitRender },
    { field: 'bookieA', headerName: 'Veto A', width: 230, renderCell: handleBetRender },
    { field: 'bookieB', headerName: 'Veto B', width: 230, renderCell: handleBetRender },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          ArbiHunter – Vedonlyönnin Arbitraasiseuranta
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ mb: 3, color: 'text.secondary' }}>
          Oikea-aikaiset arbitraasimahdollisuudet API-rajapinnasta.
        </Typography>
        
        <Box sx={{ height: 600, width: '100%', boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper', overflow: 'hidden' }}>
          <DataGrid 
            rows={rows} 
            columns={columns} 
            onRowClick={handleRowClick} 
            sx={{ cursor: 'pointer', border: 'none' }}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 100 },
              },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
          />
        </Box>

        {/* Laskuri-ikkuna */}
        <CalculatorModal 
          open={modalOpen} 
          onClose={() => setModalOpen(false)} 
          match={selectedMatch} 
        />
      </Container>
    </ThemeProvider>
  );
};

export default App;
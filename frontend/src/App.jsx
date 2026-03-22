import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Typography, LinearProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { darkTheme } from './theme'; // Tuodaan teema

const columns = [
  { field: 'time', headerName: 'Aika', width: 100 },
  { field: 'event', headerName: 'Ottelu', flex: 1 },
  { field: 'profit', headerName: 'Tuotto %', width: 120, renderCell: (p) => <strong>{p.value}%</strong> },
  { field: 'bookieA', headerName: 'Veto A', width: 200 },
  { field: 'bookieB', headerName: 'Veto B', width: 200 },
];

function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080')
      .then(res => res.json())
      .then(data => {
        setRows(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">ArbiHunter API Data</Typography>
        
        {loading && <LinearProgress sx={{ mb: 2 }} />}
        
        <div style={{ height: 500, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} loading={loading} />
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default App;
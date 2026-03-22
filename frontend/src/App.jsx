import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  Container, Typography, Box, AppBar, Toolbar, Grid, 
  Card, CardContent, Chip, Stack, LinearProgress
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4caf50',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: { fontWeight: 700 },
  },
});

// --- FEIKKIDATA TESTAUSTA VARTEN (Korvataan myöhemmin backend-haulla) ---
const mockArbitrageData = [
  { id: 1, sport: 'Jalkapallo', event: 'Valioliiga: ManU - Liverpool', profit: 2.15, bookieA: 'Unibet (1@2.10)', bookieB: 'Pinnacle (2@2.05)', time: '14:30' },
  { id: 2, sport: 'Tennis', event: 'ATP Dubai: Nadal - Djokovic', profit: 1.89, bookieA: 'Bet365 (1@1.95)', bookieB: 'William Hill (2@2.01)', time: '16:00' },
  { id: 3, sport: 'Jalkapallo', event: 'La Liga: Barcelona - Real Madrid', profit: 3.01, bookieA: 'Pinnacle (X@3.50)', bookieB: 'NordicBet (12@1.45)', time: '21:00' },
  { id: 4, sport: 'Jääkiekko', event: 'Liiga: Tappara - HIFK', profit: 0.95, bookieA: 'Veikkaus (1@2.40)', bookieB: 'Unibet (X2@1.75)', time: '18:30' },
  { id: 5, sport: 'Koripallo', event: 'NBA: Lakers - Celtics', profit: 2.55, bookieA: 'GGBet (2@2.20)', bookieB: 'Pinnacle (1@1.90)', time: '03:00' },
];
// ---------------------------------------------------------------------

function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simuloidaan datan hakua backendistä
  useEffect(() => {
    // Tässä kohtaa tekisimme fetch('http://localhost:8080')
    const timer = setTimeout(() => {
      setRows(mockArbitrageData);
      setLoading(false);
    }, 1500); // 1.5 sekunnin viive latauksen simuloimiseksi

    return () => clearTimeout(timer);
  }, []);

  const columns = [
    { field: 'time', headerName: 'Aika', width: 80 },
    { field: 'sport', headerName: 'Laji', width: 120, renderCell: (params) => (
      <Stack direction="row" alignItems="center" spacing={1}>
        <SportsSoccerIcon fontSize="small" color="action" />
        <Typography variant="body2">{params.value}</Typography>
      </Stack>
    )},
    { field: 'event', headerName: 'Ottelu / Tapahtuma', flex: 1 },
    { field: 'profit', headerName: 'Tuotto %', width: 110, renderCell: (params) => (
      <Chip 
        label={`${params.value.toFixed(2)}%`} 
        color={params.value > 2 ? "success" : "primary"} // Yli 2% tuotto on vihreä
        variant="filled"
        size="small"
      />
    )},
    { field: 'bookieA', headerName: 'Veto A', width: 180 },
    { field: 'bookieB', headerName: 'Veto B', width: 180 },
  ];

  const totalOpportunities = rows.length;
  const avgProfit = rows.length > 0 ? (rows.reduce((sum, row) => sum + row.profit, 0) / rows.length).toFixed(2) : 0;
  const maxProfit = rows.length > 0 ? Math.max(...rows.map(row => row.profit)).toFixed(2) : 0;

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <TrendingUpIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            ArbiHunter Pro
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Päivitetty: Juuri nyt
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        
        {loading && <LinearProgress sx={{ mb: 2 }} />}

        <Grid container spacing={3}>
          
          {/* Yhteenvetokortit */}
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Kohteita Löytynyt</Typography>
                <Typography variant="h4">{loading ? '--' : totalOpportunities}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Keskimääräinen Tuotto</Typography>
                <Typography variant="h4" color="primary.main">{loading ? '--' : `${avgProfit}%`}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Paras Tuotto</Typography>
                <Typography variant="h4" color="success.main">{loading ? '--' : `${maxProfit}%`}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Arbitraasitaulukko */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
              Aktiiviset Arbitraasikohteet
            </Typography>
            <Card elevation={3} sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                loading={loading}
                disableSelectionOnClick
                initialState={{
                  sorting: {
                    sortModel: [{ field: 'profit', sort: 'desc' }],
                  },
                }}
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-cell:focus': { outline: 'none' },
                }}
              />
            </Card>
          </Grid>

        </Grid>

        <Box sx={{ pt: 4, pb: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            © 2024 ArbiHunter Pro - Muista pelata vastuullisesti.
          </Typography>
        </Box>

      </Container>
    </ThemeProvider>
  );
}

export default App;
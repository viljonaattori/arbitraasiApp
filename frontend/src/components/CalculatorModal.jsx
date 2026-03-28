import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Typography, Grid, Divider, Box 
} from '@mui/material';

const CalculatorModal = ({ open, onClose, match }) => {
  const [totalStake, setTotalStake] = useState(100);

  // Jos riviä ei ole valittu, ei näytetä mitään
  if (!match) return null;

  // Kaivetaan kertoimet tekstin seasta (esim. "Unibet (Tiimi@2.15)" -> 2.15)
  // parseFloat hoitaa homman, vaikka perässä olisi sulku
  const k1 = parseFloat(match.bookieA.split('@')[1]);
  const k2 = parseFloat(match.bookieB.split('@')[1]);

  // Arbitraasi-matematiikka: lasketaan panokset kertoimien painoarvon mukaan
  const individualStake1 = ( (1/k1) / (1/k1 + 1/k2) ) * totalStake;
  const individualStake2 = totalStake - individualStake1;
  
  // Odotettu kokonaispalautus ja nettotuotto
  const totalReturn = individualStake1 * k1;
  const profit = totalReturn - totalStake;
  const isPositive = profit > 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        💰 Panoslaskuri
      </DialogTitle>
      
      <DialogContent dividers>
        <Typography variant="h6" align="center" gutterBottom color="primary">
          {match.event}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <TextField
            label="Kokonaispanos (€)"
            type="number"
            value={totalStake}
            onChange={(e) => setTotalStake(Number(e.target.value))}
            sx={{ width: '50%' }}
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3} sx={{ textAlign: 'center', mb: 2 }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {match.bookieA.split('(')[0]}
            </Typography>
            <Typography variant="h6" color="primary">
              Kerroin: {k1}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
              {individualStake1.toFixed(2)} €
            </Typography>
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {match.bookieB.split('(')[0]}
            </Typography>
            <Typography variant="h6" color="primary">
              Kerroin: {k2}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
              {individualStake2.toFixed(2)} €
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ 
          mt: 3, p: 2, 
          bgcolor: isPositive ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)', 
          border: '1px solid',
          borderColor: isPositive ? 'success.main' : 'error.main',
          borderRadius: 2, 
          textAlign: 'center' 
        }}>
          <Typography variant="body1" color="text.secondary">
            Garanteroitu palautus: {totalReturn.toFixed(2)} €
          </Typography>
          <Typography variant="h4" color={isPositive ? 'success.main' : 'error.main'} sx={{ fontWeight: 'bold', mt: 1 }}>
            Voitto: {profit > 0 ? '+' : ''}{profit.toFixed(2)} €
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="inherit" fullWidth>
          Sulje
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CalculatorModal;
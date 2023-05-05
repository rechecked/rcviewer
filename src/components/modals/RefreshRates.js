import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Card from '@mui/material/Card';

import { refreshRates } from '../../config';

function RefreshRates({ open, setOpen }) {

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose}>
      <DialogTitle>Refresh Rates</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          These are the refresh rates for each of the dashboard tabs. These rates are currently static.
        </DialogContentText>
        <TableContainer variant="outlined" component={Card}>
          <Table size="small" aria-label="refresh rates table">
            <TableHead>
              <TableRow>
                <TableCell>Component</TableCell>
                <TableCell>Refresh Rate (seconds)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(refreshRates).map((key, index) => (
                <TableRow key={index}>
                  <TableCell>{key}</TableCell>
                  <TableCell>{refreshRates[key] / 1000}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default RefreshRates;
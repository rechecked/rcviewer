import { useState } from 'react';
import parse from 'shell-quote/parse';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { useDashboard } from '../../context/dashboard';
import PluginOutput from '../PluginOutput';
import { buildApiURL } from '../../utils/network';

function RunPlugin({ plugin, open, setOpen }) {

  const { dashboardAgent } = useDashboard();

  const [loading, setLoading] = useState(false);
  const [checkData, setCheckData] = useState({});
  const [args, setArgs] = useState('');

  const handleClose = () => {
    setOpen(false);
    // Give the modal a bit to close before wiping data so it doesn't blink out
    setTimeout(() => {
      setArgs('');
      setCheckData({});
      setLoading(false);
    }, 200);
  };

  const handleRunPlugin = async () => {
    setLoading(true);
    const resp = await fetch(buildApiURL(dashboardAgent, 'plugins', {
      plugin: plugin,
      arg: parse(args)
    }));
    const data = await resp.json();
    setCheckData(data);
    setLoading(false);
  };

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={handleClose}
      scroll="paper"
      sx={{
         "& .MuiDialog-container": {
            alignItems: "flex-start",
         },
      }}
      PaperProps={{ sx: { mt: '200px', maxHeight: 'calc(100% - 300px)' } }}
      onKeyUp={(e) => {
        const ENTER = 13;
        if (e.keyCode === ENTER) {
          handleRunPlugin();
        }
      }}
    >
      <DialogTitle>Run a Plugin</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ marginBottom: 2 }}>
          Run a plugin to test actual output and see an example of the plugin and arguments sent via check_rcagent.py or using the passive check YAML config.
        </DialogContentText>
        <Grid container spacing={2}>
          <Grid item sx={{ flex: "auto" }}>
            <TextField
              label="Plugin Command"
              size="small"
              value={args}
              onChange={(e) => setArgs(e.target.value)}
              fullWidth
              autoFocus
              InputProps={{
                startAdornment: <InputAdornment position="start">{plugin}</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs="auto">
            <Button sx={{ height: 40 }} color="secondary" variant="outlined" onClick={handleRunPlugin}>Run Plugin</Button>
          </Grid>
        </Grid>
        <PluginOutput loading={loading} checkData={checkData} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default RunPlugin;
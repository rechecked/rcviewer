import { Fragment, useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';

import { useAgents } from '../../context/agents';

function AddAgentsButton() {

  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <Button color="secondary" onClick={() => setOpen(true)}>Add Agents</Button>
      <AddAgentsModal open={open} setOpen={setOpen} />
    </Fragment>
  );
}

function AddAgentsModal({ open, setOpen }) {

  const { addAgent } = useAgents();

  const [hosts, setHosts] = useState('');
  const [protocol, setProtocol] = useState('https:');
  const [port, setPort] = useState('5995');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  
  const handleClose = () => {
    setOpen(false);
    setError('');
    setHosts('');
    setToken('');
    setPort('');
    setProtocol('https:');
  };

  const handleSubmit = () => {
    if (hosts.trim() === '') {
      setError('Must enter at least one hostname or address.');
      return;
    }
    hosts.split("\n").forEach(host => {
      const cleanHost = host.trim()
      if (cleanHost === '') {
        return;
      }
      // Add each host
      const agent = {
        protocol: protocol,
        hostname: cleanHost,
        port: port,
        token: token
      };
      addAgent(agent);
    });
    handleClose();
  };

  return (
    <Dialog fullWidth open={open} onClose={handleClose} onKeyUp={(e) => {
      const ENTER = 13;
      if (e.keyCode === ENTER && e.target.nodeName !== 'TEXTAREA') {
        handleSubmit();
      }
    }}>
      <DialogTitle>Add Agents</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ marginBottom: 3 }}>
          You can add multiple agents by adding one per line into the hostname field. Each agent will be added with the same token.
        </DialogContentText>
        {error && <Alert severity="error" sx={{ marginBottom: 4 }}>{error}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              size="small"
              label="Hostnames or Addresses"
              type="text"
              value={hosts}
              onChange={e => setHosts(e.target.value)}
              fullWidth
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              size="small"
              label="Protocol"
              value={protocol}
              onChange={e => setProtocol(e.target.value)}
              fullWidth
            >
              <MenuItem key="https:" value="https:">
                HTTPS
              </MenuItem>
              <MenuItem key="http:" value="http:">
                HTTP
              </MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              size="small"
              label="Port"
              type="text"
              value={port}
              onChange={e => setPort(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              size="small"
              label="Token"
              type="text"
              value={token}
              onChange={e => setToken(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit}>Add Agents</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddAgentsButton;
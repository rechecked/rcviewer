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

import CustomIconButton from './CustomIconButton';
import { useAgents } from '../../context/agents';
import { useDashboard } from '../../context/dashboard';

function EditAgentButton({ agent }) {

  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <CustomIconButton type="edit" onClick={() => setOpen(true)} />
      <EditAgentModal agent={agent} open={open} setOpen={setOpen} />
    </Fragment>
  );
}

function EditAgentModal({ agent, open, setOpen }) {

  const { editAgent, removeRecentAgent } = useAgents();
  const { dashboardAgent, setDashboardAgent } = useDashboard();

  const [protocol, setProtocol] = useState(agent.protocol);
  const [port, setPort] = useState(agent.port);
  const [token, setToken] = useState(agent.token);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const tmpAgent = {
      protocol: protocol,
      hostname: agent.hostname,
      port: port,
      token: token
    };
    editAgent(tmpAgent);

    // Remove agent from the recent agents list to ensure data is the same
    removeRecentAgent(agent.hostname);

    // Disconnect dashboard if the agent changed... this is necessary to
    // ensure the changes actually take place in the UI and aren't confusing
    if (dashboardAgent.hostname === agent.hostname) {
      setDashboardAgent({});
    }

    handleClose();
  };

  return (
    <Dialog fullWidth open={open} onClose={handleClose} onKeyUp={(e) => {
      const ENTER = 13;
      if (e.keyCode === ENTER) {
        handleSubmit();
      }
    }}>
      <DialogTitle>Edit Agent</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ marginBottom: 3 }}>
          Edit the agent information. Hostname/address cannot be changed.
        </DialogContentText>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              size="small"
              label="Hostname/Address"
              type="text"
              value={agent.hostname}
              fullWidth
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
        <Button color="secondary" onClick={handleSubmit}>Save Changes</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAgentButton;
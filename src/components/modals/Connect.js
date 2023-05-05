import { useState, Fragment } from 'react';
import { useNavigate } from "react-router-dom";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';

import { useDashboard } from '../../context/dashboard';
import { buildApiURL} from '../../utils/network';

function VerifySSLDialog({ url, open, onClose }) {
  return (
    <Dialog open={open} fullWidth maxWidth="lg" onClose={onClose}>
      <DialogTitle>Verify Connection</DialogTitle>
      <DialogContent>
        A popup is going to appear that will ask you to verify connection. Make sure popup blocker is turned off for this site if you have one.
      </DialogContent>
    </Dialog>
  );
}

function Connect() {
  const { setDashboardAgent } = useDashboard();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [verify, setVerify] = useState(false);
  const [loading, setLoading] = useState(false);
  const [protocol, setProtocol] = useState('https:');
  const [hostname, setHostname] = useState('');
  const [hostnameError, setHostnameError] = useState(false);
  const [port, setPort] = useState('5995');
  const [token, setToken] = useState('');
  const [tokenError, setTokenError] = useState(false);
  const [tokenHelperText, setTokenHelperText] = useState('');
  const [url, setUrl] = useState('');
  const [info, setInfo] = useState('');
  const [error, setError] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {

    setError('');

    // Validate the form fields
    if (hostname === "") {
      setHostnameError(true);
      return;
    }

    setLoading(true);

    const agent = {
      protocol: protocol,
      hostname: hostname,
      port: port,
      token: token
    };

    // Test connection and see if we are good to go
    const url = buildApiURL(agent, 'system');
    setUrl(url); // set url but maybe not needed to do this like this
    var start = window.performance.now();
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.status === "error") {
          setTokenError(true);
          setTokenHelperText(data.message);
          return;
        }

        // Clear errors
        setHostnameError(false);
        setTokenError(false);
        setTokenHelperText('');

        // Set agent and avigate to dashboard
        setDashboardAgent(agent);
        navigate("/dashboard");
      })
      .catch(error => {
        var end = window.performance.now();
        var total = end - start;
        // it's likely that we are having an SSL error, so pop up window to confirm ssl exception
        if (agent.protocol === "https:" && total < 500) {
          var top = (window.innerHeight - 600) / 2;
          var left = (window.innerWidth - 400) / 2;
          window.open(url,'_blank',`height=600,width=400,top=${top},left=${left},titlebar=Security Confirmation`);
        }
        setError("Could not connect to agent. Verify it is running and credentials are correct.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onHostnameChange = (e) => {
    setHostnameError(false);
    setTokenError(false);
    var addr = e.target.value;
    try {
      var u = new URL(e.target.value);
      setHostname(u.hostname);
      if (u.protocol === "http:" || u.protocol === "https:") {
        setProtocol(u.protocol);
      }
      if (u.Port) {
        setPort(u.Port);
      }
      const t = u.searchParams.get("token");
      if (t !== null) {
        setToken(t);
      }
    } catch (err) {
      setHostname(addr);
    }

    // Give out warning if someone uses localhost
    if (addr === "localhost") {
      setInfo('Some browsers do not allow localhost. You may see a popup and but not be able to connect. We recommend using local IPs or hostnames.');
    } else {
      setInfo('');
    }

  };
  
  return (
    <Fragment>
      <Button color="secondary" onClick={handleClickOpen}>Connect</Button>
      <Dialog open={open} onClose={handleClose} onKeyUp={(e) => {
        const ENTER = 13;
        if (e.keyCode === ENTER) {
          handleSubmit();
        }
      }}>
        <DialogTitle>Connect to Agent</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ marginBottom: 3 }}>
            Enter agent information to conncet and view dashboard. Copy/paste the whole URL
            including token into the hostname to auto-complete the form.
          </DialogContentText>
          {error && <Alert sx={{ mb: 4 }} severity="error">{error}</Alert>}
          {info && <Alert sx={{ mb: 4 }} severity="info">{info}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs="auto">
              <Box width={100}>
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
              </Box>
            </Grid>
            <Grid item xs>
              <TextField
                autoFocus
                error={hostnameError}
                size="small"
                label="Hostname/Address"
                type="text"
                fullWidth
                value={hostname}
                onChange={onHostnameChange}
              />
            </Grid>
            <Grid item xs="auto">
              <Box width={100}>
                <TextField
                  size="small"
                  label="Port"
                  type="text"
                  value={port}
                  onChange={e => setPort(e.target.value)}
                  fullWidth
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={tokenError}
                helperText={tokenHelperText}
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
          <LoadingButton color="secondary" onClick={handleSubmit} loading={loading} loadingIndicator="Connecting...">Connect and View</LoadingButton>
        </DialogActions>
      </Dialog>
      <VerifySSLDialog url={url} open={verify} onClose={() => setVerify(false)} />
    </Fragment>
  );
}

export default Connect;

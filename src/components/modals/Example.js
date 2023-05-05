import { Fragment, useState, useEffect } from 'react';
import copy from 'copy-to-clipboard';
import parse from 'shell-quote/parse';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import LaunchIcon from '@mui/icons-material/Launch';

import { ucFirst } from '../../utils/common';
import { buildApiURL } from '../../utils/network';
import { useDashboard } from '../../context/dashboard';
import PluginOutput from '../PluginOutput';
import { ServicesSelect, ServicesStatusSelect } from '../forms';

function Example({open, setOpen, type, data, settings}) {

  const [checkType, setCheckType] = useState('active');
  const [warning, setWarning] = useState('');
  const [critical, setCritical] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkData, setCheckData] = useState({});
  const [args, setArgs] = useState('');
  const [against, setAgainst] = useState('');
  const [expected, setExpected] = useState('');

  useEffect(() => {
    setAgainst(data.against ?? '');
    setExpected(data.expected ?? '');
  }, [data])

  const { dashboardAgent } = useDashboard();

  const getCheckURL = (pretty = false) => {
    let params = buildOptions(type, data, true);
    if (pretty) {
      params['pretty'] = 1;
    }
    return buildApiURL(dashboardAgent, type, { ...params, check: 1 });
  };

  const handleCheck = async () => {
    setLoading(true);
    const resp = await fetch(getCheckURL());
    const tmp = await resp.json();
    setCheckData(tmp);
    setLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
    // Give the modal a bit to close before wiping data so it doesn't blink out
    setTimeout(() => {
      setCheckData({});
      setLoading(false);
      setWarning('');
      setCritical('');
      setCheckType('active');
      setArgs('');
      setAgainst('');
      setExpected('');
    }, 200);
  };

  const getServiceName = (type) => {
    switch (type) {
      case 'load':
        return `Current ${ucFirst(type)}`;
      case 'system/users':
        return `Current Users`;
      case 'plugins':
        return 'Plugin Check';
      default:
        return `${ucFirst(type)} Usage`;
    }
  };

  const buildOptions = (type, data, thresholds = false) => {
    let options = {};
    switch (type) {
      case 'disk':
        options['path'] = data.path;
        break;
      case 'network':
        options['name'] = data.name;
        break;
      case 'services':
        options['against'] = against;
        options['expected'] = expected;
        break;
      case 'plugins':
        options['plugin'] = data.plugin;
        options['arg'] = parse(args);
        break;
      default:
        break;
    }

    // Add threshold options to options object
    if (thresholds) {
      if (warning.trim()) {
        options['warning'] = warning.trim();
      }
      if (critical.trim()) {
        options['critical'] = critical.trim();
      }
    }

    if (data.units) {
      options['units'] = data.units;
    }

    return options;
  };

  const buildActiveCheck = (data) => {
    const endpoint = type === 'plugins' ? `-p ${data.plugin}` : `-e ${type}`;

    let connStr = `-H ${dashboardAgent.hostname}`;
    if (data.port && data.port !== 5995) {
      connStr += ` -P ${data.port}`;
    }

    let extraOpts = '';
    if (warning.trim()) {
      extraOpts += ` -w ${warning.trim()}`;
    }
    if (critical.trim()) {
      extraOpts += ` -c ${critical.trim()}`;
    }
    if (data.units) {
      extraOpts += ` -u ${data.units}`;
    }

    const options = buildOptions(type, data);
    
    var query = '';
    Object.keys(options).forEach(key => {
      if (key === 'units' || key === 'plugin') { return; } // Skip these keys because they are set above as actual args for the check
      if (Array.isArray(options[key])) {
        options[key].forEach(val => {
          if (val) {
            extraOpts += ` --arg='${val.replaceAll("'", "\\'")}'`;
          }
        })
      } else {
        let str = `${key}=${options[key]}`;
        query += ` -q '${str.replaceAll("'", "\\'")}'`;
      }
    });

    return `python check_rcagent.py ${connStr} -t ${dashboardAgent.token} ${endpoint}${query}${extraOpts}`;
  };

  const buildPassiveCheck = (data) => {

    let options = buildOptions(type, data, true);

    // Add options if there are any including warning/critical
    var optStr = '';
    if (Object.keys(options).length > 0) {
      optStr = `\n  options:`;
      Object.keys(options).forEach(key => {
        if (Array.isArray(options[key])) {
          let tmpStr = '';
          options[key].forEach(val => {
            if (val) {
              tmpStr += `\n      - ${val}`;
            }
          });
          if (tmpStr !== '') {
            optStr += `\n    arg:${tmpStr}`;
          }
        } else {
          optStr += `\n    ${key}: ${options[key]}`;
        }
      });
    }

    return (
      <pre style={{ margin: 0 }}>{`- hostname: $HOST
  servicename: ${getServiceName(type)}
  interval: 5m
  endpoint: ${type}${optStr}`}
    </pre>
    );
  };

  const getFields = () => {
    switch (type) {
      case 'plugins':
        return (
          <Grid item xs={6}>
            <TextField size="small" label="Arguments" value={args} onChange={e => setArgs(e.target.value)} fullWidth />
          </Grid>
        );
      case 'services':
        return (
          <Fragment>
            <Grid item xs={3}>
              <ServicesSelect agent={dashboardAgent} name={against} setName={setAgainst} />
            </Grid>
            <Grid item xs={3}>
              <ServicesStatusSelect label="Expected Status" agent={dashboardAgent} status={expected} setStatus={setExpected} />
            </Grid>
          </Fragment>
        );
      default:
        return (
          <Fragment>
            <Grid item xs={3}>
              <TextField size="small" label="Warning" value={warning} onChange={e => setWarning(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={3}>
              <TextField size="small" label="Critical" value={critical} onChange={e => setCritical(e.target.value)} fullWidth />
            </Grid>
          </Fragment>
        );
    }
  };

  return (
    <Dialog fullWidth maxWidth="lg"
      scroll="paper"
      sx={{
         "& .MuiDialog-container": {
            alignItems: "flex-start",
         },
      }}
      PaperProps={{ sx: { mt: '200px', maxHeight: 'calc(100% - 300px)' } }}
      open={open} onClose={handleClose}
    >
      <DialogTitle>Example Check</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          View an example active (check_rcagent.py) or passive check definition and a response.
        </DialogContentText>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              select
              size="small"
              label="Check Type"
              value={checkType}
              onChange={e => setCheckType(e.target.value)}
              fullWidth
            >
              <MenuItem key="active" value="active">
                Active Check
              </MenuItem>
              <MenuItem key="passive" value="passive">
                Passive Check
              </MenuItem>
            </TextField>
          </Grid>
          {getFields()}
        </Grid>
        <ExampleCheckOutput output={checkType === 'active' ? buildActiveCheck(data) : buildPassiveCheck(data)} />
        {checkType === 'passive' && (
          <DialogContentText sx={{ mt: 2 }}>
            The above YAML config should got in the <code>checks</code> section inside your <code>config.yml</code> file.
          </DialogContentText>
        )}
        <PluginOutput loading={loading} checkData={checkData} />
      </DialogContent>
      <DialogActions>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item>
            <Stack direction="row" spacing={2}>
              <Button color="secondary" onClick={handleCheck}>Run Check</Button>
              <Button color="secondary" component={Link} href={getCheckURL(true)}
                target="_blank" rel="noopener noreferrer" underline="none"
                endIcon={<LaunchIcon fontSize="small" />}
              >
                Open Check URL
              </Button>
            </Stack>
          </Grid>
          <Grid item>
            <Button onClick={handleClose}>Close</Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
}

function ExampleCheckOutput({ output }) {

  const [text, setText] = useState('Copy');

  const handleCopy = () => {
    copy(output);
    setText('Copied!');
    setTimeout(() => setText('Copy'), 600);
  };

  return (
    <Card variant="outlined" sx={{ p: 2, mt: 2, position: 'relative' }}>
      <Button sx={{ position: 'absolute', top: 12, right: 12 }} onClick={handleCopy} color="secondary" size="small">{text}</Button>
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{output}</pre>
    </Card>
  );
}

export default Example;
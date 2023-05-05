import { useState, useEffect, useMemo } from 'react';
import copy from 'copy-to-clipboard';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import LaunchIcon from '@mui/icons-material/Launch';
import RefreshIcon from '@mui/icons-material/Refresh';
import { debounce } from '@mui/material/utils';

import LoadingCircle from '../layout/LoadingCircle';
import { PluginSelect, DiskSelect, NetworkSelect,
  ServicesSelect, ServicesStatusSelect, ProcessSelect } from '../forms';
import { buildApiURL } from '../../utils/network';
import { useAgent } from '../../hooks/useAgent';

const ENDPOINT_DEF = [
  {
    label: 'CPU',
    endpoint: 'cpu',
    paths: [
      {
        label: 'Percent',
        path: 'percent',
      }
    ],
    os: 'all',
    check: true,
    units: false
  },
  {
    label: 'Memory',
    endpoint: 'memory',
    paths: [
      {
        label: 'Virtual',
        path: 'virtual'
      },
      {
        label: 'Swap',
        path: 'swap'
      }
    ],
    os: 'all',
    check: true,
    units: true
  },
  {
    label: 'Disk',
    endpoint: 'disk',
    paths: false,
    os: 'all',
    check: true,
    units: true
  },
  {
    label: 'Services',
    endpoint: 'services',
    paths: false,
    os: 'all',
    check: true,
    units: false
  },
  {
    label: 'Processes',
    endpoint: 'processes',
    paths: false,
    os: 'all',
    check: true,
    units: false
  },
  {
    label: 'Plugins',
    endpoint: 'plugins',
    paths: false,
    os: 'all',
    check: false,
    units: false
  },
  {
    label: 'Network',
    endpoint: 'network',
    paths: false,
    os: 'all',
    check: true,
    units: true
  },
  {
    label: 'System',
    endpoint: 'system',
    emptyPaths: true,
    paths: [
      {
        label: 'Users',
        path: 'users',
        check: true
      }
    ],
    os: 'all',
    check: false,
    units: false
  },
  {
    label: 'Load',
    endpoint: 'load',
    paths: false,
    os: 'unix',
    check: true,
    units: false
  },
];

function APIViewer({ agent }) {

  const [endpoint, setEndpoint] = useState('cpu');
  const [path, setPath] = useState('percent');
  const [plugin, setPlugin] = useState('');
  const [check, setCheck] = useState(false);
  const [units, setUnits] = useState('');
  const [diskPath, setDiskPath] = useState('');
  const [against, setAgainst] = useState('');
  const [expected, setExpected] = useState('');
  const [name, setName] = useState('');
  const [warning, setWarning] = useState('');
  const [critical, setCritical] = useState('');
  const [delta, setDelta] = useState(false);
  const [json, setJson] = useState('');
  const [loading, setLoading] = useState(false);

  const fullpath = [endpoint];
  if (path) {
    fullpath.push(path);
  }
  let opts = { pretty: 1 };
  if (plugin !== '') {
    opts.plugin = plugin;
  }
  if (check) {
    opts.check = 1;
    if (warning) {
      opts.warning = warning;
    }
    if (critical) {
      opts.critical = critical;
    }
    if (against) {
      opts.against = against;
    }
    if (expected) {
      opts.expected = expected;
    }
  }
  if (units) {
    opts.units = units;
  }
  if (diskPath) {
    opts.path = diskPath;
  }
  if (delta) {
    opts.delta = 1;
  }
  if (name) {
    opts.name = name;
  }
  
  const url = buildApiURL(agent, fullpath.join('/'), opts);

  const fetchUrlData = useMemo(
    () => debounce(
      async (url) => {
        setLoading(true);
        const resp = await fetch(url);
        const data = await resp.json();
        setJson(JSON.stringify(data, null, 4));
        setLoading(false);
      },
      300
    ),
    []
  );

  // Fetch the actual URL data
  useEffect(() => {
    fetchUrlData(url);
  }, [url, fetchUrlData]);

  const updateEndpoint = (e) => {
    setEndpoint(e.target.value);
    setPlugin('');
    setDiskPath('');
    setUnits('');
    setDelta(false);
    setCheck(false);
    setWarning('');
    setCritical('');
    setAgainst('');
    setExpected('');
    setName('');
    switch (e.target.value) {
      case 'cpu':
        setPath('percent');
        break;
      case 'memory':
        setPath('virtual');
        break;
      default:
        setPath('');
        break;
    }
  };

  const currentDef = ENDPOINT_DEF.find(o => o.endpoint === endpoint);
  const currentPathDef = currentDef.paths ? currentDef.paths.find(o => o.path === path) : [];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4} md={2}>
        <Stack spacing={2}>
          <EndpointSelect agent={agent} endpoint={endpoint} setEndpoint={updateEndpoint} />
          <PathSelect endpoint={endpoint} paths={currentDef?.paths} allowEmpty={currentDef?.emptyPaths} path={path} setPath={setPath} />
          {endpoint === 'disk' && (<DiskSelect agent={agent} diskPath={diskPath} setDiskPath={setDiskPath} />)}
          {endpoint === 'network' && (<NetworkSelect agent={agent} network={name} setNetwork={setName} />)}
          {endpoint === 'processes' && (<ProcessSelect allowEmpty agent={agent} name={name} setName={setName} />)}
          {endpoint === 'plugins' && (<PluginSelect agent={agent} plugin={plugin} setPlugin={setPlugin} />)}
          {currentDef?.units && (
            <TextField
              select
              size="small"
              label="Units"
              value={units}
              onChange={e => setUnits(e.target.value)}
              fullWidth
            >
              <MenuItem key="" value="">&nbsp;</MenuItem>
              <MenuItem key="kB" value="kB">kB</MenuItem>
              <MenuItem key="KiB" value="KiB">KiB</MenuItem>
              <MenuItem key="MB" value="MB">MB</MenuItem>
              <MenuItem key="MiB" value="MiB">MiB</MenuItem>
              <MenuItem key="GB" value="GB">GB</MenuItem>
              <MenuItem key="GiB" value="GiB">GiB</MenuItem>
              <MenuItem key="TB" value="TB">TB</MenuItem>
              <MenuItem key="TiB" value="TiB">TiB</MenuItem>
            </TextField>
          )}
          {endpoint === 'network' && (
            <FormGroup>
              <FormControlLabel control={<Checkbox checked={delta} onChange={(e) => setDelta(e.target.checked)} />} label="Use delta" />
            </FormGroup>
          )}
          {(currentDef?.check || currentPathDef?.check) && (
            <>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={check} onChange={(e) => setCheck(e.target.checked)} />} label="Send as check" />
              </FormGroup>
              {endpoint === 'services' && check && (<ServicesSelect label="Against Service" agent={agent} name={against} setName={setAgainst} />)}
              {endpoint === 'services' && check && (<ServicesStatusSelect label="Expected Status" agent={agent} status={expected} setStatus={setExpected} />)}
              {check && endpoint !== 'services' && (
                <TextField
                  size="small"
                  label="Warning"
                  value={warning}
                  onChange={e => setWarning(e.target.value)}
                  fullWidth
                />
              )}
              {check && endpoint !== 'services' && (
                <TextField
                  size="small"
                  label="Critical"
                  value={critical}
                  onChange={e => setCritical(e.target.value)}
                  fullWidth
                />
              )}
            </>
          )}
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => fetchUrlData(url)} fullWidth>Refresh</Button>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={8} md={10}>
        <Card variant="outlined" sx={{ height: 'calc(100vh - 325px)' }}>
          <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" sx={{ padding: 1 }}>
            <pre style={{ paddingLeft: 5, margin: 0, fontSize: 13 }}>{url}</pre>
            <Stack direction="row" spacing={1}>
              <CopyButton url={url} />
              <IconButton color="secondary" size="small" component={Link} href={url} target="_blank" rel="noopener noreferrer" underline="none">
                <LaunchIcon fontSize="inherit" />
              </IconButton>
            </Stack>
          </Stack>
          <Divider />
          <Box sx={{ padding: 1.5, height: 'calc(100% - 45px)', overflow: 'auto' }}>
            {loading ? <LoadingCircle /> : (
              <pre style={{ margin: 0, fontSize: 13, whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{json}</pre>
            )}
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}

function EndpointSelect({ agent, endpoint, setEndpoint }) {

  const { data: systemInfo } = useAgent(agent); 

  const allOSEndpoints = ENDPOINT_DEF.filter(o => o.os === 'all');
  const unixOnlyEndpoints = ENDPOINT_DEF.filter(o => o.os === 'unix');
  const winOnlyEndpoints = ENDPOINT_DEF.filter(o => o.os === 'win');

  return (
    <TextField
      select
      label="Endpoint"
      size="small"
      value={endpoint}
      onChange={setEndpoint}
      fullWidth
    >
      {allOSEndpoints.map(o => (
        <MenuItem value={o.endpoint} key={o.endpoint}>{o.label}</MenuItem>
      ))}
      {systemInfo?.os !== 'windows' && unixOnlyEndpoints.length > 0 && (<ListSubheader>Unix Only</ListSubheader>)}
      {systemInfo?.os !== 'windows' && unixOnlyEndpoints.length > 0 && unixOnlyEndpoints.map(o => (
        <MenuItem value={o.endpoint} key={o.endpoint}>{o.label}</MenuItem>
      ))}
      {systemInfo?.os === 'windows' && winOnlyEndpoints.length > 0 && (<ListSubheader>Windows Only</ListSubheader>)}
      {systemInfo?.os === 'windows' && winOnlyEndpoints.length > 0 && winOnlyEndpoints.map(o => (
        <MenuItem value={o.endpoint} key={o.endpoint}>{o.label}</MenuItem>
      ))}
    </TextField>
  );
}

function PathSelect({ endpoint, paths, path, setPath, allowEmpty }) {

  if (!paths) {
    return;
  }

  return (
    <TextField
      select
      label="Path"
      size="small"
      value={path}
      onChange={(e) => setPath(e.target.value)}
      fullWidth
    >
      {allowEmpty && (<MenuItem value="">&nbsp;</MenuItem>)}
      {paths.map(o => (
        <MenuItem value={o.path} key={o.path}>{o.label}</MenuItem>
      ))}
    </TextField>
  );
}

function CopyButton({ url }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copy(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 600);
  };

  return (
    <IconButton color={!copied ? "secondary" : ""} size="small" onClick={handleCopy}>
      {copied ? <CheckIcon fontSize="inherit" /> : <ContentCopyIcon fontSize="inherit" />}
    </IconButton>
  );
}

export default APIViewer;
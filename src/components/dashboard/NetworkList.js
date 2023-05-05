import { useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import LoadingCircle from '../layout/LoadingCircle';
import { ExampleCheckButton } from '../buttons';
import { useNetwork } from '../../hooks/useAgent';
import { formatBytes } from '../../utils/common';

function NetworkList({ agent }) {

  const [units, setUnits] = useState('kB');
  const [showAll, setShowAll] = useState(false);
  const [delta, setDelta] = useState(true);

  const { isLoading, data: networks } = useNetwork(agent);

  if (isLoading) {
    return <LoadingCircle />;
  }

  const getFilteredNetworks = (networks) => {
    return networks.filter(network => {
      if (!showAll && (network.bytesSent === 0 && network.bytesRecv === 0)) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      return parseFloat(b.bytesSent + b.bytesRecv) - parseFloat(a.bytesSent + a.bytesRecv);
    });
  };

  const filteredNetworks = networks ? getFilteredNetworks(networks) : [];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Box width={120}>
            <TextField
              select
              size="small"
              label="Set units"
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
          </Box>
          <Stack direction="row" spacing={1}>
            <FormGroup>
              <FormControlLabel control={<Checkbox checked={delta} onChange={(e) => setDelta(e.target.checked)} />} label="Show delta" />
            </FormGroup>
            <FormGroup>
              <FormControlLabel control={<Checkbox checked={showAll} onChange={(e) => setShowAll(e.target.checked)} />} label="Show all interfaces" />
            </FormGroup>
          </Stack>
        </Stack>
      </Grid>
      {networks.length > 0 && filteredNetworks.map((network, key) => (
        <Grid item key={network.name} xs={12}>
          <NetworkCard network={network} units={units} delta={delta} />
        </Grid>
      ))}
    </Grid>
  );
}

function NetworkCard({ network, units, delta }) {

  let ipv4 = [];
  let ipv6 = [];

  for (let i = 0; i < network.addrs.length; i++) {
    const ip = network.addrs[i].addr.split('/')[0];
    if (ip.indexOf(':') !== -1) {
      ipv6.push(ip);
    } else {
      ipv4.push(ip);
    }
  }

  const fmtRecv = formatBytes(delta ? network.inPerSec : network.bytesRecv, units);
  const fmtSent = formatBytes(delta ? network.outPerSec : network.bytesSent, units);

  return (
    <Card variant="outlined" sx={{ padding: 2 }}>
      <Grid container alignItems="center">
        <Grid item xs={6}>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{network.name}</Typography>
              {network.bytesSent === 0 && network.bytesRecv === 0 ? <Typography variant="body2">No traffic</Typography> : null}
            </Stack>
            <Box>
              <Typography variant="body2">IPv4: {ipv4.join(', ')}</Typography>
              {ipv6.length > 0 && (<Typography variant="body2">IPv6: {ipv6.join(', ')}</Typography>)}
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <ArrowUpwardIcon color={(delta && network.outPerSec > 0) || (!delta && network.bytesSent > 0) ? 'secondary' : ''} fontSize="small" />
                <Box>Sent: {delta ? `${fmtSent}/s` : fmtSent}</Box>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <ArrowDownwardIcon color={(delta && network.inPerSec > 0) || (!delta && network.bytesRecv > 0) ? 'secondary' : ''} fontSize="small" />
                <Box>Recieved: {delta ? `${fmtRecv}/s` : fmtRecv}</Box>
              </Stack>
            </Stack>
            <Box>
              <ExampleCheckButton variant="outlined" size="small" type="network" data={{ name: network.name, units: units }}>Example Check</ExampleCheckButton>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}

export default NetworkList;
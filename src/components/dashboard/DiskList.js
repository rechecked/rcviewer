import { Fragment, useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import LinearProgress from '@mui/material/LinearProgress';

import LoadingCircle from '../layout/LoadingCircle';
import { useDisk } from '../../hooks/useAgent';
import { ExampleCheckButton } from '../buttons';

function DiskList({ agent }) {

  const [units, setUnits] = useState('GiB');

  const { isLoading, data: disks } = useDisk(agent, units);

  if (isLoading) {
    return <LoadingCircle />;
  }

  return (
    <Fragment>
      <Stack spacing={2}>
        <Stack direction="row" spacing={3} alignItems="center" justifyContent="space-between">
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
              <MenuItem key="MB" value="MB">MB</MenuItem>
              <MenuItem key="MiB" value="MiB">MiB</MenuItem>
              <MenuItem key="GB" value="GB">GB</MenuItem>
              <MenuItem key="GiB" value="GiB">GiB</MenuItem>
              <MenuItem key="TB" value="TB">TB</MenuItem>
              <MenuItem key="TiB" value="TiB">TiB</MenuItem>
            </TextField>
          </Box>
        </Stack>
        {disks && disks.map(disk => (
          <DiskCard key={disk.path} disk={disk} units={units} />
        ))}
      </Stack>
    </Fragment>
  );
}

function DiskCard({ disk, units }) {
  return (
    <Card variant="outlined" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Stack direction="row" spacing={3} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center" divider={<Divider orientation="vertical" flexItem />}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{disk.path}</Typography>
              {disk.path !== disk.device ? <Typography variant="body2">{disk.device}</Typography> : null}
              <Typography variant="body2">{disk.fstype}</Typography>
            </Stack>
            <ExampleCheckButton size="small" variant="outlined" type="disk" data={{ ...disk, units: units }} />
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={3} justifyContent="space-between">
            <Typography>{disk.free.toFixed(2)} {disk.units} Free</Typography>
            <Typography>{disk.used.toFixed(2)} {disk.units} / {disk.total.toFixed(2)} {disk.units}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <DiskUsageProgress usage={disk.usedPercent} />
        </Grid>
      </Grid>
    </Card>
  );
}

function DiskUsageProgress({ usage }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress color="secondary" variant="determinate" value={usage} />
      </Box>
      <Box sx={{ minWidth: usage >= 100 ? 91 : 83 }}>
        <Typography variant="body2" color="text.secondary">{`${usage.toFixed(2)}% Used`}</Typography>
      </Box>
    </Box>
  );
}

export default DiskList;
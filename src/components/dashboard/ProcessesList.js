import { useState } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import { useProcesses } from '../../hooks/useAgent';
import LoadingCircle from '../layout/LoadingCircle';
import { SortTableHeader } from '../table';
import { getComparator } from '../../utils/table';
import { ExampleCheckButton } from '../buttons';

const headerCells = [
  {
    label: 'PID'
  },
  {
    label: 'Name',
    id: 'name',
    sortable: true
  },
  {
    label: 'Username',
    id: 'username',
    sortable: true
  },
  {
    label: 'CPU Usage %',
    id: 'cpuPercent',
    sortable: true,
    tooltip: 'CPU usage is like linux top, so it can be over 100% if it uses more than one core'
  },
  {
    label: 'Memory Usage %',
    id: 'memPercent',
    sortable: true
  }
];

function ProcessesList({ agent }) {

  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('cpuPercent');
  const [filter, setFilter] = useState('');
  const [warning, setWarning] = useState('');
  const [critical, setCritical] = useState('');

  const { isLoading, data } = useProcesses(agent);

  if (isLoading) {
    return <LoadingCircle />;
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const shouldHighlight = (name, cpu, memory) => {
    let highlight = false;
    let color = '';
    let text = '';
    if (filter !== '' && name.toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
      highlight = true;
    }
    if (warning && (cpu > warning || memory > warning)) {
      highlight = false;
      color = 'warning.light';
      text = 'warning.contrastText';
    }
    if (critical && (cpu > critical || memory > critical)) {
      highlight = false;
      color = 'error.light';
      text = 'error.contrastText';
    }
    return [highlight, color, text];
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <TextField
            size="small"
            label="Highlight Name"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
          <TextField
            size="small"
            label="Highlight Warning"
            value={warning}
            onChange={e => setWarning(e.target.value)}
          />
          <TextField
            size="small"
            label="Highlight Critical"
            value={critical}
            onChange={e => setCritical(e.target.value)}
          />
          <Box>
            <ExampleCheckButton variant="outlined" size="small" type="processes">Example Check</ExampleCheckButton>
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <TableContainer variant="outlined" component={Card}>
          <Table size="small" aria-label="top process list table">
            <SortTableHeader columns={headerCells} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
            <TableBody>
              {data && data.processes?.length > 0 ? data.processes.slice().sort(getComparator(order, orderBy)).map(p => {
                const [highlight, color, text] = shouldHighlight(p.name, p.cpuPercent ?? 0, p.memPercent ?? 0);
                return (
                  <TableRow sx={{ bgcolor: color }} selected={highlight} hover={color === ''} key={p.pid}>
                    <TableCell sx={{ color: text }}>{p.pid}</TableCell>
                    <TableCell sx={{ color: text }}>{p.name}</TableCell>
                    <TableCell sx={{ color: text }}>{p.username}</TableCell>
                    <TableCell sx={{ color: text }}>{p.cpuPercent?.toFixed(2)}</TableCell>
                    <TableCell sx={{ color: text }}>{p.memPercent?.toFixed(2)}</TableCell>
                  </TableRow>
                );
              }) : (
                <TableRow>
                  <TableCell colSpan={5}>No processes to show</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}

export default ProcessesList;
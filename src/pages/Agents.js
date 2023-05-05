import { useState } from 'react';
import TimeAgo from 'react-timeago';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';

import { useAgents } from '../context/agents';
import Page from '../components/layout/Page';
import { ConnectButton, ConfirmButton, CustomIconButton,
  AddAgentsButton, EditAgentButton } from '../components/buttons';
import ImportExport from '../components/modals/ImportExport';
import { SortTableHeader } from '../components/table';
import { getComparator } from '../utils/table';

const headerCells = [
  {
    id: 'connect',
  },
  {
    id: 'hostname',
    label: 'Hostname (Address)',
    sortable: true
  },
  {
    id: 'os',
    label: 'Operating System',
    sortable: true
  },
  {
    id: 'lastConnected',
    label: 'Last Connected'
  },
  {
    id: 'version',
    label: 'Version'
  },
  {
    id: 'edit'
  },
  {
    id: 'delete'
  }
];

function Manage() {

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('hostname');
  //const [page, setPage] = useState(0);
  //const [rowsPerPage, setRowsPerPage] = useState(10);

  const { agents, clearAgents, removeAgent } = useAgents();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleDeleteAll = () => {
    clearAgents();
  };

  const data = agents.stored.slice().sort(getComparator(order, orderBy));

  return (
    <Page>
      <Grid container justifyContent="left" spacing={5}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2}>
              <Typography variant="h5" style={{ fontWeight: 'bold' }}>Manage Agents</Typography>
              <AddAgentsButton />
            </Stack>
            <Stack direction="row" spacing={2}>
              <ImportExport />
              <ConfirmButton
                onConfirm={handleDeleteAll}
                disabled={data.length === 0}
                label="Delete All"
                buttonLabel="Confirm Delete"
                title="Delete all agents?"
                description="You can delete all agents from your local browser storage. If you are going to need this list of agents again, it's recommneded to export them first."
              />
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <TableContainer variant="outlined" component={Card}>
            <Table aria-label="rcagent list table">
              <SortTableHeader columns={headerCells} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
              <TableBody>
                {data.length > 0 ? data.map(a => (
                  <TableRow key={a.hostname}>
                    <TableCell padding="checkbox">
                      <ConnectButton agent={a} />
                    </TableCell>
                    <TableCell>{a.hostname}</TableCell>
                    <TableCell>{a.os}</TableCell>
                    <TableCell>{a.lastConnect ? <>Used <TimeAgo date={a.lastConnect} /></> : "-"}</TableCell>
                    <TableCell>{a.version}</TableCell>
                    <TableCell padding="checkbox">
                      <EditAgentButton agent={a} />
                    </TableCell>
                    <TableCell padding="checkbox">
                      <CustomIconButton type="delete" onClick={() => removeAgent(a.hostname)} />
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={3}>No agents saved in local storage. Import an agents file or add agents.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Page>
  );
}

export default Manage;
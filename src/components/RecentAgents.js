import { Fragment } from 'react';
import TimeAgo from 'react-timeago';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { ConnectButton, CustomIconButton, AddAgentButton } from './buttons';
import { useAgents } from '../context/agents';

function RecentAgents() {

  const { agents, clearRecentAgents, removeRecentAgent, setRecentDisabled } = useAgents();

  const toggleDisableRecent = () => {
    setRecentDisabled(!agents.recentDisabled);
    clearRecentAgents();
  };

  return (
    <Fragment>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 1 }}>
        <Stack direction="row" spacing={2}>
          <Typography variant="h6">Recently Connected Agents</Typography>
          <Tooltip placement="top" title={agents.recentDisabled ? "Enable recent agents functionality" : "Disable recent agents functionality"}>
            <IconButton size="small" onClick={toggleDisableRecent}>
              {agents.recentDisabled ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Stack>
        <Button size="small" color="secondary"
          onClick={() => clearRecentAgents()}
          disabled={agents.recent?.length === 0}>
          Clear All
        </Button>
      </Stack>
      <TableContainer variant="outlined" component={Card}>
        <Table aria-label="recent agents table">
          <TableBody>
            {agents.recent?.length > 0 ? agents.recent.map((row) => (
              <TableRow key={row.hostname}>
                <TableCell padding="checkbox">
                  <ConnectButton agent={row} />
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.hostname}
                </TableCell>
                <TableCell>
                  Used <TimeAgo date={row.lastConnect} />
                </TableCell>
                <TableCell padding="checkbox">
                  {agents.stored?.filter(o => o.hostname === row.hostname).length === 0 && (
                    <AddAgentButton agent={row} />
                  )}
                </TableCell>
                <TableCell padding="checkbox">
                  <CustomIconButton type="delete" onClick={() => removeRecentAgent(row.hostname)} />
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell>
                  {agents.recentDisabled ? "Recent agents functionality is currently disabled." : "No recently connected agents."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
}

export default RecentAgents;

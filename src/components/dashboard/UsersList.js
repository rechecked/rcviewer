import { useState } from 'react';
import moment from 'moment';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { useUsers } from '../../hooks/useAgent';
import LoadingCircle from '../layout/LoadingCircle';
import { ExampleCheckButton } from '../buttons';

function UsersList({ agent, os }) {

  const [filters, setFilters] = useState({ username: '' }); 

  const { isLoading, data: users } = useUsers(agent);

  if (isLoading) {
    return <LoadingCircle />;
  }

  const updateFilters = (value, key) => {
    setFilters(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

   const getUsers = () => {
    return users.filter(user => {
        for (const key in filters) {
          if (user[key] === undefined || !user[key].toLowerCase().includes(filters[key].toLowerCase())) {
            return false;
          }
        }
        return true;
      }
    );
  };

  const filteredUsers = getUsers();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <TextField
            size="small"
            label="Filter by username"
            value={filters.username}
            onChange={e => updateFilters(e.target.value, 'username')}
          />
          <ExampleCheckButton size="small" variant="outlined" type="system/users" />
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <TableContainer variant="outlined" component={Card}>
          {os === "windows" ? <WindowsUserList users={filteredUsers} /> : <LinuxUserList users={filteredUsers} />}
        </TableContainer>
      </Grid>
    </Grid>
  );
}

function WindowsUserList({ users }) {
  return (
    <Table aria-label="windows users list table">
      <TableHead>
        <TableRow>
          <TableCell>Username</TableCell>
          <TableCell>Domain</TableCell>
          <TableCell>Local</TableCell>
          <TableCell>Admin</TableCell>
          <TableCell>Login Time</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.length > 0 ? users.map((u, i) => (
          <TableRow key={i}>
            <TableCell>{u.username}</TableCell>
            <TableCell>{u.domain} {u.dnsDomainName && `(${u.dnsDomainName})`}</TableCell>
            <TableCell>{u.isLocal ? "Yes" : "No"}</TableCell>
            <TableCell>{u.isAdmin ? "Yes" : "No"}</TableCell>
            <TableCell>{moment(u.logonTime).format('LLL')}</TableCell>
          </TableRow>
        )) : (
          <TableRow>
            <TableCell colSpan={5}>No users to show</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function LinuxUserList({ users }) {
  return (
    <Table aria-label="linux users list table">
      <TableHead>
        <TableRow>
          <TableCell>User</TableCell>
          <TableCell>Terminal</TableCell>
          <TableCell>Host</TableCell>
          <TableCell>Started</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.length > 0 ? users.map((u, i) => (
          <TableRow key={i}>
            <TableCell>{u.user}</TableCell>
            <TableCell>{u.terminal}</TableCell>
            <TableCell>{u.host}</TableCell>
            <TableCell>{moment(u.started*1000).format('LLL')}</TableCell>
          </TableRow>
        )) : (
          <TableRow>
            <TableCell colSpan={4}>No users to show</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default UsersList;
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
//import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Card from '@mui/material/Card';

import { usePlugins } from '../../hooks/useAgent';
import LoadingCircle from '../layout/LoadingCircle';
import { RunPluginButton, ExampleCheckButton } from '../buttons';
import { SortTableHeader } from '../table';

const headerCells = [
  {
    label: 'Available Plugins',
    colSpan: 3
  }
];

function PluginsList({ agent }) {

  const { isLoading, data } = usePlugins(agent);

  if (isLoading) {
    return <LoadingCircle />;
  }

  return (
    <TableContainer variant="outlined" component={Card}>
      <Table aria-label="plugins list table">
        <SortTableHeader columns={headerCells} />
        <TableBody>
          {data && data.plugins.length > 0 ? data.plugins.map(plugin => (
            <TableRow key={plugin}>
              <TableCell padding="checkbox">
                <RunPluginButton plugin={plugin} />
              </TableCell>
              <TableCell>{plugin}</TableCell>
              <TableCell padding="none" sx={{ textAlign: 'right', p: 1 }}>
                <ExampleCheckButton variant="outlined" size="small" type="plugins" data={{ plugin: plugin }} />
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={3}>No plugins have been added.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PluginsList;
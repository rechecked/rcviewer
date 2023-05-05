import { useState } from 'react';
//import { TableVirtuoso } from 'react-virtuoso';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';

import { useServices } from '../../hooks/useAgent';
import ServicesWarning from '../alerts/ServicesWarning';
import LoadingCircle from '../layout/LoadingCircle';
import { SortTableHeader } from '../table';
import { ExampleCheckButton } from '../buttons';
import { ServicesStatusSelect } from '../forms';

const headerCells = [
  {
    label: 'Service Name'
  },
  {
    label: 'Service Status',
    colSpan: 2
  }
];

function ServicesList({ agent }) {

  // Filters
  const [filters, setFilters] = useState({ name: '', status: '' });

  const { isLoading, data: services } = useServices(agent);

  if (isLoading) {
    return <LoadingCircle />;
  }

  const updateFilters = (value, key) => {
    setFilters(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  const getServices = () => {
    return services.filter(service => {
        for (const key in filters) {
          if (service[key] === undefined || !service[key].toLowerCase().includes(filters[key].toLowerCase())) {
            return false;
          }
        }
        return true;
      }
    );
  };

  const filteredServices = getServices();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ServicesWarning services={services} />
        <Stack direction="row" spacing={2}>
          <TextField
            size="small"
            label="Filter by name"
            value={filters.name}
            onChange={e => updateFilters(e.target.value, 'name')}
          />
          <Box width={200}>
            <ServicesStatusSelect allowEmpty agent={agent} status={filters.status} setStatus={value => updateFilters(value, 'status')} />
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <TableContainer variant="outlined" component={Card}>
          <Table aria-label="services list table">
            <SortTableHeader columns={headerCells} />
            <TableBody>
              {filteredServices.length > 0 ? filteredServices.map(o => (
                <TableRow hover key={o.name}>
                  <TableCell>{o.name}</TableCell>
                  <TableCell>{o.status}</TableCell>
                  <TableCell padding="none" sx={{ textAlign: 'right', p: 1 }}>
                    <ExampleCheckButton variant="outlined" size="small" type="services" data={{ against: o.name, expected: o.status }}>Example Check</ExampleCheckButton>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={2}>No services to show</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}

export default ServicesList;
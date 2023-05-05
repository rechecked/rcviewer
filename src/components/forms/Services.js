import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import { useServices } from '../../hooks/useAgent';

function ServicesSelect({ agent, name, setName, label }) {

  const { data: services } = useServices(agent);

  return (
    <TextField
      select
      size="small"
      label={label ? label : "Service Name"}
      value={name}
      onChange={e => setName && setName(e.target.value)}
      fullWidth
    >
      {services && [...new Set(services.map(o => o.name))].map(name => (
        <MenuItem key={name} value={name}>
          {name}
        </MenuItem>
      ))}
    </TextField>
  );
}

function ServicesStatusSelect({ agent, status, setStatus, label, allowEmpty }) {

  const { data: services } = useServices(agent);

  return (
    <TextField
      select
      size="small"
      label={ label ? label : "Filter by status"}
      value={status}
      onChange={e => setStatus && setStatus(e.target.value)}
      fullWidth
    >
      {allowEmpty && (<MenuItem key="" value="">&nbsp;</MenuItem>)}
      {services && [...new Set(services.map(o => o.status))].map(status => (
        <MenuItem key={status} value={status}>
          {status}
        </MenuItem>
      ))}
    </TextField>
  );
}

export { ServicesSelect, ServicesStatusSelect };
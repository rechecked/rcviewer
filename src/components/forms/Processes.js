import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import { useProcesses } from '../../hooks/useAgent';

function ProcessSelect({ agent, name, setName, label, allowEmpty }) {

  const { data } = useProcesses(agent);

  return (
    <TextField
      select
      size="small"
      label={label ? label : "Process Name"}
      value={name}
      onChange={e => setName && setName(e.target.value)}
      fullWidth
    >
      {allowEmpty && (<MenuItem value="">&nbsp;</MenuItem>)}
      {data && data.processes && [...new Set(data.processes.map(o => o.name))].map(name => {
        if (name === "") { return null; }
        return (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        );
      })}
    </TextField>
  );
}

export { ProcessSelect };
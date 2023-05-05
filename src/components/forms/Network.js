import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import { useNetwork } from '../../hooks/useAgent';

function NetworkSelect({ agent, network, setNetwork }) {

  const { data: networks } = useNetwork(agent);

  return (
    <TextField
      select
      label="Netowrk"
      size="small"
      value={network}
      onChange={e => setNetwork && setNetwork(e.target.value)}
      fullWidth
    >
      <MenuItem value="">&nbsp;</MenuItem>
      {networks && networks.map(n => (
        <MenuItem value={n.name} key={n.name}>{n.name} </MenuItem>
      ))}
    </TextField>
  );
}

export { NetworkSelect };
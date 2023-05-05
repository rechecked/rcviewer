import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import { usePlugins } from '../../hooks/useAgent';

function PluginSelect({ agent, plugin, setPlugin }) {

  const { data } = usePlugins(agent);

  return (
    <TextField
      select
      label="Plugin Name"
      size="small"
      value={plugin}
      onChange={e => setPlugin && setPlugin(e.target.value)}
      fullWidth
    >
      <MenuItem value="">&nbsp;</MenuItem>
      {data && data.plugins && data.plugins.map(p => (
        <MenuItem value={p} key={p}>{p}</MenuItem>
      ))}
    </TextField>
  );
}

export { PluginSelect };
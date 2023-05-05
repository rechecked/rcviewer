import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import { useDisk } from '../../hooks/useAgent';

function DiskSelect({ agent, diskPath, setDiskPath }) {

  const { data: disks } = useDisk(agent);

  return (
    <TextField
      select
      label="Disk Path"
      size="small"
      value={diskPath}
      onChange={e => setDiskPath && setDiskPath(e.target.value)}
      fullWidth
    >
      <MenuItem value="">&nbsp;</MenuItem>
      {disks && disks.map(d => (
        <MenuItem value={d.path} key={d.path}>{d.path}</MenuItem>
      ))}
    </TextField>
  );
}

export { DiskSelect };
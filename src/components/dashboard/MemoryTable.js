import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import LoadingCircle from '../layout/LoadingCircle';

function MemoryTable({ os, mem }) {
  if (!mem) {
    return (
      <Stack sx={{ pl: 10, pr: 10 }}>
        <LoadingCircle />
      </Stack>
    );
  }
  return (
    <Stack sx={{ pl: 10, pr: 10 }}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body1">Used</Typography>
        <Typography variant="body1">{mem.used.toFixed(2)} {mem.units}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body1">Free</Typography>
        <Typography variant="body1">{mem.free.toFixed(2)} {mem.units}</Typography>
      </Stack>
      {os !== "windows" && os !== undefined && mem.available !== undefined && (
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1">Available</Typography>
          <Typography variant="body1">{mem.available.toFixed(2)} {mem.units}</Typography>
        </Stack>
      )}
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body1">Total</Typography>
        <Typography variant="body1">{mem.total.toFixed(2)} {mem.units}</Typography>
      </Stack>
    </Stack>
  );
}

export default MemoryTable;
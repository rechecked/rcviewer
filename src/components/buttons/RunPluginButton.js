import { Fragment, useState } from 'react';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

import RunPlugin from '../modals/RunPlugin';

function RunPluginButton({ plugin }) {

  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <Tooltip placement="top" title="Run plugin">
        <IconButton onClick={() => setOpen(true)} aria-label="run plugin">
          <PlayCircleOutlineIcon />
        </IconButton>
      </Tooltip>
      <RunPlugin plugin={plugin} open={open} setOpen={setOpen} />
    </Fragment>
  );
}

export default RunPluginButton;
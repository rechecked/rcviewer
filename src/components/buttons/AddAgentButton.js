import { useState, useEffect } from 'react';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CheckIcon from '@mui/icons-material/Check';

import { useAgents } from '../../context/agents';

function AddAgentButton({ agent }) {

  const [added, setAdded] = useState(false);
  const [isAlreadyAdded, setIsAlreadyAdded] = useState(true);

  const { agents, addAgent } = useAgents();

  useEffect(() => {
    if (agents.stored?.filter(a => a.name === agent.name).length === 0) {
      setIsAlreadyAdded(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddAgent = () => {
    addAgent(agent);
    setAdded(true);
  };

  if (isAlreadyAdded) {
    return;
  }

  return (
    <Tooltip title="Add agent">
      <IconButton disabled={added ? true : false} onClick={handleAddAgent} aria-label="add agent">
        {added ? <CheckIcon /> : <AddOutlinedIcon />}
      </IconButton>
    </Tooltip>
  );
}

export default AddAgentButton;
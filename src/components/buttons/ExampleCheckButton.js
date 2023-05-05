import Button from '@mui/material/Button';

import { useExample } from '../../context/example';

function ExampleCheckButton({ type, data, ...props }) {

  const { showExampleCheck } = useExample();
  
  return (
    <Button {...props} onClick={() => showExampleCheck(type, data)}>Example Check</Button>
  );
}

export default ExampleCheckButton;
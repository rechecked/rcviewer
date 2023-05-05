import { useState, createContext, useContext } from 'react';
import Example from '../components/modals/Example';

const ExamplesContext = createContext();

export function useExample() {
  return useContext(ExamplesContext);
}

export function ExampleProvider(props) {

  const [open, setOpen] = useState(false);
  const [type, setType] = useState('');
  const [data, setData] = useState({});

  const showExampleCheck = (type, data) => {
    setType(type);
    if (data) {
      setData(data);
    }
    setOpen(true);
  };

  return (
    <ExamplesContext.Provider value={{ showExampleCheck }}>
      {props.children}
      <Example open={open} setOpen={setOpen} type={type} data={data} />
    </ExamplesContext.Provider>
  );
}

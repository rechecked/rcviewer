import React, { createContext, useContext, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { setLocalStorage, getLocalStorage } from '../utils/common';
import { useAgents } from '../context/agents';

const DashboardContext = createContext();

export function useDashboard() {
  return useContext(DashboardContext);
}

export function DashboardProvider(props) {
  const { addRecentAgent } = useAgents();
  const queryClient = useQueryClient();

  const d = getLocalStorage("dashboardAgent", "JSON");
  const [dashboardAgent, setAgent] = useState(d === null ? {} : d);

  const setDashboardAgent = (agent) => {
    setAgent(agent);
    setLocalStorage("dashboardAgent", JSON.stringify(agent));
    addRecentAgent(agent);
    queryClient.cancelQueries({ queryKey: ['agent'] });
    queryClient.removeQueries({ queryKey: ['agent'] });
  };

  return (
    <DashboardContext.Provider value={{ dashboardAgent, setDashboardAgent }}>
      {props.children}
    </DashboardContext.Provider>
  );
}

import React, { createContext, useContext, useState } from 'react';
import { setLocalStorage, getLocalStorage, isEmpty } from '../utils/common';

const AgentsContext = createContext();

export function useAgents() {
  return useContext(AgentsContext);
}

export function AgentsProvider(props) {
  const a = getLocalStorage("agents", "JSON");
  const [agents, setAgents] = useState(a === null ? { recent: [], stored: [] } : a);

  const updateAgents = (key, update) => {
    setAgents((prevState, currProps) => {
      var newAgents = { ...prevState, [key]: update };
      setLocalStorage("agents", JSON.stringify(newAgents));
      // Do api connection post here in future
      return newAgents;
    }); 
  };

  // === Recent Agents ===

  // Add a recently connected agent to the list
  const addRecentAgent = (agent) => {
    if (isEmpty(agent)) {
      return;
    }

    var recent = agents.recent;
    if (!Array.isArray(recent)) {
      recent = []; // Just verify we are using an array, since it won't work otherwise
    }

    // Find agent and update it
    for (var i = 0; i < recent.length; i++) {
      if (recent[i].hostname === agent.hostname) {
        recent.splice(i, 1);
      }
    }

    // Add agent if it doesn't exist in recent agents list
    agent.lastConnect = Date.now();
    recent.unshift(agent);

    // Make sure we aren't over the limit (5 recent agents)
    if (recent.length > 5) {
      recent = recent.slice(0, 5);
    } 

    updateAgents("recent", recent);
  };

  const clearRecentAgents = () => {
    updateAgents("recent", []);
  };

  const removeRecentAgent = (hostname) => {
    updateAgents("recent", agents.recent.filter(o => o.hostname !== hostname));
  };

  // === Stored Agents ===

  const addAgent = (agent) => {
    var stored = agents.stored;
    if (!Array.isArray(stored)) {
      stored = []; // Just verify we are using an array, since it won't work otherwise
    }

    // Verify agent is valid and throw error if not
    const cleanAgent = makeCleanAgent(agent);

    // Find agent and skip if we don't need to add it
    for (var i = 0; i < stored.length; i++) {
      if (stored[i].hostname === cleanAgent.hostname) {
        return;
      }
    }

    stored.push(cleanAgent);
    updateAgents("stored", stored);
  };

  const editAgent = (agent) => {
    var stored = agents.stored;

    for (var i = 0; i < stored.length; i++) {
      if (stored[i].hostname === agent.hostname)  {
        // Update agent info
        stored[i] = { ...stored[i], ...agent };
      }
    }

    updateAgents("stored", stored);
  };

  const removeAgent = (hostname) => {
    updateAgents("stored", agents.stored.filter(o => o.hostname !== hostname));
  };

  const importAgents = (imported) => {
    
    // Verify array or return an exception
    if (!Array.isArray(imported)) {
      throw new Error('Import object must be an array');
    }

    // Loop through array and verify that each agent has the data we need
    // and import each agent separately
    let errors = 0;
    imported.forEach(obj => {

      try {
        addAgent(obj);
      } catch (e) {
        errors++;
      }

    });

    return [imported.length, errors];
  };

  const clearAgents = () => {
    updateAgents("stored", []);
  };

  return (
    <AgentsContext.Provider value={{
      agents,
      updateAgents,
      importAgents,
      clearAgents,
      addRecentAgent,
      clearRecentAgents,
      removeRecentAgent,
      addAgent,
      editAgent,
      removeAgent
    }}>
      {props.children}
    </AgentsContext.Provider>
  );
}

function makeCleanAgent(obj) {
  let tmpAgent = {};

  const reqKeys = ['protocol', 'hostname', 'port', 'token'];
  const optKeys = ['lastConnect', 'os', 'platform', 'version']

  // Verify required keys and add to clean agent
  reqKeys.forEach(key => {
    if (!(key in obj)) {
      throw new Error('Agent object missing required field');
    }
    tmpAgent[key] = obj[key];
  });

  // Add optional fields (don't error if it doesn't exist)
  optKeys.forEach(key => {
    if (key in obj) {
      tmpAgent[key] = obj[key];
    }
  })

  return tmpAgent;
}

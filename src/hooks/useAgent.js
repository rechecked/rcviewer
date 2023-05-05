import { useQuery } from '@tanstack/react-query';

import { isEmpty } from '../utils/common';
import { buildApiURL} from '../utils/network';
import { refreshRates } from '../config';

const fetchSystem = async (agent, signal) => {
  if (isEmpty(agent)) {
    return {};
  }

  // Connect and get data
  const [resp, verResp] = await Promise.all([
    fetch(buildApiURL(agent, 'system'), { signal }),
    fetch(buildApiURL(agent, 'system/version'), { signal })
  ]);
  var data = await resp.json();
  const version = await verResp.json();
  data.version = version.version;
  return data;
};

const fetchOverview = async (agent, signal) => {
  if (isEmpty(agent)) {
    return {};
  }

  // Connect and get data
  try {
    const [resp, respMem, respSwap] = await Promise.all([
      fetch(buildApiURL(agent, 'cpu/percent'), { signal }),
      fetch(buildApiURL(agent, 'memory/virtual'), { signal }),
      fetch(buildApiURL(agent, 'memory/swap'), { signal })
    ]);
    var data = {};
    data.cpu = await resp.json();
    data.mem = await respMem.json();
    data.swap = await respSwap.json();
    return data;
  } catch (error) {
    console.log("Error: ", error);
  }

  return {};
};

const fetchDisk = async (agent, units, signal) => {
  if (isEmpty(agent)) {
    return {};
  }

  // Connect and get data
  try {
    const [resp] = await Promise.all([
      fetch(buildApiURL(agent, 'disk', {
        units: units
      }), { signal })
    ]);
    const data = await resp.json();
    return data;
  } catch (error) {
    console.log("Error: ", error);
  }

  return {};
};

const fetchNetwork = async (agent, signal) => {
  if (isEmpty(agent)) {
    return {};
  }

  // Connect and get data
  try {
    const [resp] = await Promise.all([
      fetch(buildApiURL(agent, 'network', {
        delta: 1,
        units: 'B'
      }), { signal })
    ]);
    const data = await resp.json();
    return data;
  } catch (error) {
    console.log("Error: ", error);
  }

  return {};
};

const fetchProcesses = async (agent, signal) => {
  if (isEmpty(agent)) {
    return {};
  }

  // Connect and get data
  try {
    const [resp] = await Promise.all([
      fetch(buildApiURL(agent, 'processes'), { signal })
    ]);
    const data = await resp.json();
    return data;
  } catch (error) {
    console.log("Error: ", error);
  }

  return {};
};

const fetchServices = async (agent, signal) => {
  if (isEmpty(agent)) {
    return {};
  }

  // Connect and get data
  try {
    const [resp] = await Promise.all([
      fetch(buildApiURL(agent, 'services'), { signal })
    ]);
    const data = await resp.json();
    return data;
  } catch (error) {
    console.log("Error: ", error);
  }

  return {};
};

const fetchUsers = async (agent, signal) => {
  if (isEmpty(agent)) {
    return {};
  }

  // Connect and get data
  try {
    const [resp] = await Promise.all([
      fetch(buildApiURL(agent, 'system/users'), { signal })
    ]);
    const data = await resp.json();
    return data;
  } catch (error) {
    console.log("Error: ", error);
  }

  return {};
};

const fetchPlugins = async (agent, signal) => {
  if (isEmpty(agent)) {
    return {};
  }

  // Connect and get data
  try {
    const [resp] = await Promise.all([
      fetch(buildApiURL(agent, 'plugins'), { signal })
    ]);
    const data = await resp.json();
    return data;
  } catch (error) {
    console.log("Error: ", error);
  }

  return {};
};

export function useAgent(agent) {
  return useQuery({
    queryKey: ['agent'],
    queryFn: ({ signal }) => fetchSystem(agent, signal),
    refetchOnWindowFocus: false
  });
}

export function useAgentOverview(agent) {
  return useQuery({
    queryKey: ['agent', 'overview'],
    queryFn: ({ signal }) => fetchOverview(agent, signal),
    refetchInterval: refreshRates.OVERVIEW
  });
}

export function useDisk(agent, units = '') {
  return useQuery({
    queryKey: ['agent', 'disk', units],
    queryFn: ({ signal }) => fetchDisk(agent, units, signal),
    refetchInterval: refreshRates.DISK
  });
}

export function useNetwork(agent) {
  return useQuery({
    queryKey: ['agent', 'network'],
    queryFn: ({ signal }) => fetchNetwork(agent, signal),
    refetchInterval: refreshRates.NETWORK
  });
}

export function useProcesses(agent) {
  return useQuery({
    queryKey: ['agent', 'processes'],
    queryFn: ({ signal }) => fetchProcesses(agent, signal),
    refetchInterval: refreshRates.PROCESSES
  });
}

export function useServices(agent) {
  return useQuery({
    queryKey: ['agent', 'services'],
    queryFn: ({ signal }) => fetchServices(agent, signal),
    refetchInterval: refreshRates.SERVICES
  });
}

export function useUsers(agent) {
  return useQuery({
    queryKey: ['agent', 'users'],
    queryFn: ({ signal }) => fetchUsers(agent, signal),
    refetchInterval: refreshRates.USERS
  });
}

export function usePlugins(agent) {
  return useQuery({
    queryKey: ['agent', 'plugins'],
    queryFn: ({ signal }) => fetchPlugins(agent, signal),
    refetchInterval: refreshRates.PLUGINS
  });
}

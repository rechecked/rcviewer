
const buildApiURL = (agent, path, args = {}) => {
  const apiUrl = `${agent.protocol}//${agent.hostname}:${agent.port}/status/`;
  const params = { token: agent.token, ...args };
  const strParams = `?${Object.keys(params).map(i => {
    if (Array.isArray(params[i])) {
      return "arg="+params[i].join('&arg=');
    }
    return `${i}=${params[i]}`;
  }).join('&')}`;
  return apiUrl+path+strParams;
};

export { buildApiURL };
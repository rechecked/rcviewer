
function isEmpty(value) {
  return value === undefined ||
         value === null ||
         (typeof value === "object" && Object.keys(value).length === 0) ||
         (typeof value === "string" && value.trim().length === 0);
}

function ucFirst(string) {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return string;
}

function setLocalStorage(name, value) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(name, value);
  }
}

function delLocalStorage(name) {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(name);
  }
}

function getLocalStorage(name, type) {
  if (typeof localStorage !== 'undefined') {
    const item = localStorage.getItem(name);
    if (type === "JSON") {
      return JSON.parse(item);
    }
    return item;
  }
  return null;
}

function platformName(platform) {
  switch (platform) {
    case 'darwin':
      return 'macOS';
    case 'centos':
      return 'CentOS';
    default:
      return ucFirst(platform);
  }
}

function formatBytes(bytes, unit = 'B', decimal = 2) {
  if (unit === 'B' || unit === '') {
    return `${bytes} B`;
  }

  let k = 1000;
  let e = 'kMGTPE';
  let u = 'B';
  if (unit.indexOf('i') >= 0) {
    k = 1024;
    e = 'KMGTPE';
    u = 'iB';
  }

  let exp = 0;
  let div = k;
  let ex = `${e.charAt(exp)}${u}`;
  for (let i = bytes / k; unit !== ex && exp < 6; i /= k) {
    div *= k;
    exp++
    ex = `${e.charAt(exp)}${u}`;
  }

  return `${parseFloat(bytes / div).toFixed(decimal)} ${unit}`;
}

export { isEmpty, ucFirst, setLocalStorage, getLocalStorage, delLocalStorage, formatBytes, platformName };
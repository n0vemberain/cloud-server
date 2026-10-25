import os from 'os';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      // IPv4, non-internal
      if (net.family === 'IPv4' && !net.internal) {
        addresses.push({
          interface: name,
          address: net.address
        });
      }
    }
  }

  // Prioritize en0 (standard Wi-Fi on Mac)
  addresses.sort((a, b) => {
    if (a.interface === 'en0') return -1;
    if (b.interface === 'en0') return 1;
    return a.interface.localeCompare(b.interface);
  });

  return addresses;
}

export async function getMacMetrics() {
  const localIps = getLocalIpAddresses();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  let battery = { percent: null, status: 'Unknown', isCharging: false };
  let disk = { total: '0 GB', used: '0 GB', free: '0 GB', percentUsed: 0 };

  // Fetch battery details on macOS
  try {
    const { stdout } = await execPromise('pmset -g batt');
    const percentMatch = stdout.match(/(\d+)%/);
    if (percentMatch) {
      battery.percent = parseInt(percentMatch[1], 10);
      const isCharging = stdout.includes('charging') && !stdout.includes('discharging');
      const isAc = stdout.includes('AC Power') || stdout.includes('AC attached');
      battery.isCharging = isCharging || isAc;
      battery.status = stdout.includes('discharging') ? 'Discharging' : (isCharging ? 'Charging' : 'Full / AC');
    }
  } catch (err) {
    // pmset might not be available or fail (e.g. desktop Mac without battery)
  }

  // Fetch disk usage on root macOS filesystem
  try {
    const { stdout } = await execPromise('df -k /');
    const lines = stdout.trim().split('\n');
    if (lines.length > 1) {
      const parts = lines[1].trim().split(/\s+/);
      // Filesystem, 1024-blocks, Used, Available, Capacity, ...
      const totalBlocks = parseInt(parts[1], 10);
      const usedBlocks = parseInt(parts[2], 10);
      const availBlocks = parseInt(parts[3], 10);

      const totalGb = (totalBlocks / 1024 / 1024).toFixed(1);
      const usedGb = (usedBlocks / 1024 / 1024).toFixed(1);
      const freeGb = (availBlocks / 1024 / 1024).toFixed(1);
      const pct = Math.round((usedBlocks / totalBlocks) * 100);

      disk = {
        total: `${totalGb} GB`,
        used: `${usedGb} GB`,
        free: `${freeGb} GB`,
        percentUsed: pct
      };
    }
  } catch (err) {
    // ignore
  }

  return {
    hostname: os.hostname(),
    model: os.cpus()[0]?.model || 'Apple Silicon / Intel',
    cpuCores: os.cpus().length,
    uptimeSeconds: os.uptime(),
    memory: {
      total: `${(totalMem / (1024 * 1024 * 1024)).toFixed(1)} GB`,
      used: `${(usedMem / (1024 * 1024 * 1024)).toFixed(1)} GB`,
      free: `${(freeMem / (1024 * 1024 * 1024)).toFixed(1)} GB`,
      percentUsed: Math.round((usedMem / totalMem) * 100)
    },
    battery,
    disk,
    network: localIps
  };
}

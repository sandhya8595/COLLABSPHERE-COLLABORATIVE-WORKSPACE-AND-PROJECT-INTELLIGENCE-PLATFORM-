const levels = {
  info: '\x1b[36mINFO\x1b[0m',
  warn: '\x1b[33mWARN\x1b[0m',
  error: '\x1b[31mERROR\x1b[0m',
};

const timestamp = () => new Date().toISOString();

const log = (level, message) => {
  console.log(`[${timestamp()}] ${levels[level]}: ${message}`);
};

module.exports = {
  info: (msg) => log('info', msg),
  warn: (msg) => log('warn', msg),
  error: (msg) => log('error', msg),
};

const fs = require('fs');
const path = require('path');

const buildFileUrl = (req, filename) => {
  return `${req.protocol}://${req.get('host')}/uploads/files/${filename}`;
};

const deletePhysicalFile = (relativePath) => {
  const fullPath = path.join(process.cwd(), relativePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

const bytesToMB = (bytes) => Math.round((bytes / (1024 * 1024)) * 100) / 100;

module.exports = { buildFileUrl, deletePhysicalFile, bytesToMB };

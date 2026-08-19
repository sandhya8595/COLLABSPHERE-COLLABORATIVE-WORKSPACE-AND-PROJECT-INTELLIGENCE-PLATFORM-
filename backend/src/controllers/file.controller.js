const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const { File, FileVersion, Workspace } = require('../models');
const { buildFileUrl, deletePhysicalFile, bytesToMB } = require('../services/file.service');
const { pushNotification } = require('../sockets/notification.socket');

// POST /api/v1/files/upload
const uploadFile = catchAsync(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file provided.');

  const { workspaceId, folderId } = req.body;

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw new ApiError(404, 'Workspace not found.');

  const sizeMB = bytesToMB(req.file.size);
  if (workspace.storageUsedMB + sizeMB > workspace.storageQuotaMB) {
    deletePhysicalFile(`uploads/files/${req.file.filename}`);
    throw new ApiError(413, 'Storage quota exceeded for this workspace.');
  }

  const file = await File.create({
    name: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    path: `uploads/files/${req.file.filename}`,
    url: buildFileUrl(req, req.file.filename),
    workspace: workspaceId,
    folder: folderId || null,
    owner: req.user._id,
  });

  workspace.storageUsedMB += sizeMB;
  await workspace.save();

  await req.audit('file_upload', 'File', file._id, { size: req.file.size });

  res.status(201).json(new ApiResponse(201, { file }, 'File uploaded successfully.'));
});

// POST /api/v1/files/folders
const createFolder = catchAsync(async (req, res) => {
  const { name, workspaceId, folderId } = req.body;

  const folder = await File.create({
    name,
    originalName: name,
    mimeType: 'folder',
    size: 0,
    path: '',
    url: '',
    workspace: workspaceId,
    folder: folderId || null,
    isFolder: true,
    owner: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, { folder }, 'Folder created.'));
});

// GET /api/v1/files?workspaceId=...&folderId=...
const listFiles = catchAsync(async (req, res) => {
  const { workspaceId, folderId = null } = req.query;
  if (!workspaceId) throw new ApiError(400, 'workspaceId query param is required.');

  const files = await File.find({
    workspace: workspaceId,
    folder: folderId === 'null' || !folderId ? null : folderId,
  })
    .populate('owner', 'firstName lastName avatar')
    .sort({ isFolder: -1, updatedAt: -1 });

  res.status(200).json(new ApiResponse(200, { files }));
});

// GET /api/v1/files/:id
const getFileDetails = catchAsync(async (req, res) => {
  const file = await File.findById(req.params.id).populate('owner', 'firstName lastName avatar');
  if (!file) throw new ApiError(404, 'File not found.');

  const versions = await FileVersion.find({ file: file._id })
    .populate('uploadedBy', 'firstName lastName avatar')
    .sort('-createdAt');

  res.status(200).json(new ApiResponse(200, { file, versions }));
});

// POST /api/v1/files/:id/versions  (upload a new version of an existing file)
const uploadNewVersion = catchAsync(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file provided.');

  const file = await File.findById(req.params.id);
  if (!file) throw new ApiError(404, 'File not found.');
  if (file.isLocked) throw new ApiError(423, 'File is locked and cannot be updated.');

  // Archive current version
  await FileVersion.create({
    file: file._id,
    path: file.path,
    url: file.url,
    size: file.size,
    versionLabel: req.body.versionLabel || `Version ${new Date().toLocaleDateString()}`,
    uploadedBy: file.owner,
  });

  // Update file with new content
  file.path = `uploads/files/${req.file.filename}`;
  file.url = buildFileUrl(req, req.file.filename);
  file.size = req.file.size;
  await file.save();

  await req.audit('file_version_upload', 'File', file._id);

  res.status(200).json(new ApiResponse(200, { file }, 'New version uploaded.'));
});

// POST /api/v1/files/:id/versions/:versionId/restore
const restoreVersion = catchAsync(async (req, res) => {
  const version = await FileVersion.findById(req.params.versionId);
  if (!version) throw new ApiError(404, 'Version not found.');

  const file = await File.findByIdAndUpdate(
    req.params.id,
    { path: version.path, url: version.url, size: version.size },
    { new: true }
  );

  res.status(200).json(new ApiResponse(200, { file }, 'File restored to selected version.'));
});

// PATCH /api/v1/files/:id/lock
const toggleLock = catchAsync(async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) throw new ApiError(404, 'File not found.');

  file.isLocked = !file.isLocked;
  file.lockedBy = file.isLocked ? req.user._id : null;
  await file.save();

  res.status(200).json(new ApiResponse(200, { file }, file.isLocked ? 'File locked.' : 'File unlocked.'));
});

// POST /api/v1/files/:id/share
const shareFile = catchAsync(async (req, res) => {
  const { userId, access = 'view' } = req.body;
  const file = await File.findById(req.params.id);
  if (!file) throw new ApiError(404, 'File not found.');

  const existing = file.permissions.find((p) => p.user.toString() === userId);
  if (existing) {
    existing.access = access;
  } else {
    file.permissions.push({ user: userId, access });
  }
  await file.save();

  await pushNotification({
    recipient: userId,
    sender: req.user._id,
    type: 'file_uploaded',
    title: `${req.user.firstName} shared "${file.originalName}" with you`,
    entityType: 'File',
    entityId: file._id,
  });

  res.status(200).json(new ApiResponse(200, { file }, 'File shared.'));
});

// GET /api/v1/files/:id/download
const trackDownload = catchAsync(async (req, res) => {
  const file = await File.findByIdAndUpdate(
    req.params.id,
    { $inc: { downloadCount: 1 } },
    { new: true }
  );
  if (!file) throw new ApiError(404, 'File not found.');

  res.status(200).json(new ApiResponse(200, { url: file.url }, 'Download tracked.'));
});

// DELETE /api/v1/files/:id
const deleteFile = catchAsync(async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) throw new ApiError(404, 'File or folder not found.');

  const deleteRecursive = async (item) => {
    if (item.isFolder) {
      const children = await File.find({ folder: item._id });
      for (const child of children) {
        await deleteRecursive(child);
      }
    } else if (item.path) {
      deletePhysicalFile(item.path);
      const workspace = await Workspace.findById(item.workspace);
      if (workspace) {
        workspace.storageUsedMB = Math.max(0, workspace.storageUsedMB - bytesToMB(item.size));
        await workspace.save();
      }
    }
    await FileVersion.deleteMany({ file: item._id });
    await item.deleteOne();
  };

  await deleteRecursive(file);
  await req.audit('file_delete', 'File', file._id);

  res.status(200).json(new ApiResponse(200, null, 'File or folder deleted.'));
});

module.exports = {
  uploadFile,
  createFolder,
  listFiles,
  getFileDetails,
  uploadNewVersion,
  restoreVersion,
  toggleLock,
  shareFile,
  trackDownload,
  deleteFile,
};

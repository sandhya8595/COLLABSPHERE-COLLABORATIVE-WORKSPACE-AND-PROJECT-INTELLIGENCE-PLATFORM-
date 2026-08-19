const express = require('express');
const { body } = require('express-validator');
const projectController = require('../controllers/project.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Project name is required.'),
    body('workspaceId').notEmpty().withMessage('workspaceId is required.'),
  ],
  validate,
  projectController.createProject
);

router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.patch('/:id', projectController.updateProject);
router.delete('/:id', projectController.archiveProject);

module.exports = router;

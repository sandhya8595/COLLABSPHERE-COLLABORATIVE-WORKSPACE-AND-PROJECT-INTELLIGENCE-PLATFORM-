/**
 * Seed script — creates a demo organization, workspace, admin user,
 * a sample project with a Kanban board, and a general chat channel.
 *
 * Usage: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const logger = require('./logger');
const {
  User,
  Organization,
  Workspace,
  Project,
  Board,
  Column,
  Task,
  Chat,
} = require('../models');
const { ROLES } = require('../config/constants');

const seed = async () => {
  await connectDB();

  const existing = await User.findOne({ email: 'admin@collabsphere.co' });
  if (existing) {
    logger.info('Seed data already exists. Skipping.');
    await mongoose.disconnect();
    return;
  }

  logger.info('Seeding demo data...');

  const admin = await User.create({
    firstName: 'Alex',
    lastName: 'Mercer',
    email: 'admin@collabsphere.co',
    password: 'Password123!',
    jobTitle: 'Lead Product Designer',
    isEmailVerified: true,
  });

  const organization = await Organization.create({
    name: 'Acme Design Co.',
    slug: 'acme-design-co',
    owner: admin._id,
    members: [{ user: admin._id, role: 'org_admin' }],
  });

  const workspace = await Workspace.create({
    name: 'Acme Design Co.',
    slug: 'acme-design',
    description: 'Enterprise workspace for the Acme Design team.',
    organization: organization._id,
    owner: admin._id,
    members: [{ user: admin._id, role: ROLES.WORKSPACE_ADMIN }],
  });

  const project = await Project.create({
    name: 'Project Alpha',
    description: 'Core platform revamp',
    workspace: workspace._id,
    status: 'active',
    createdBy: admin._id,
    members: [{ user: admin._id, role: 'owner' }],
  });

  const board = await Board.create({
    name: 'Project Alpha Board',
    project: project._id,
    activeSprint: 'Week 42',
  });

  const columnNames = ['To Do', 'In Progress', 'Review', 'Done'];
  const columns = await Column.insertMany(
    columnNames.map((name, idx) => ({ name, board: board._id, order: idx }))
  );
  board.columnOrder = columns.map((c) => c._id);
  await board.save();

  const sampleTask = await Task.create({
    title: 'Design System Architecture',
    description: 'Draft initial token hierarchy and layout primitives for the new v2 framework.',
    board: board._id,
    column: columns[0]._id,
    priority: 'high',
    createdBy: admin._id,
  });
  columns[0].taskOrder = [sampleTask._id];
  await columns[0].save();

  await Chat.create({
    name: 'general',
    type: 'channel',
    workspace: workspace._id,
    members: [admin._id],
    createdBy: admin._id,
  });

  logger.info('Seed complete!');
  logger.info(`Login with: admin@collabsphere.co / Password123!`);

  await mongoose.disconnect();
};

seed().catch((err) => {
  logger.error(`Seed failed: ${err.message}`);
  process.exit(1);
});

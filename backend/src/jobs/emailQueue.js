/**
 * Lightweight in-memory email queue.
 *
 * The original spec called for BullMQ + Redis, but per project requirements
 * this stack avoids Redis entirely. For a single-instance deployment this
 * in-memory queue with retry/backoff is sufficient. If you later need
 * multi-instance durability, swap this for BullMQ backed by Redis or
 * Mongo-backed `agenda` without changing the call sites below.
 */
const { sendEmail } = require('../services/email.service');
const logger = require('../utils/logger');

const queue = [];
let isProcessing = false;

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

const processQueue = async () => {
  if (isProcessing || queue.length === 0) return;
  isProcessing = true;

  while (queue.length > 0) {
    const job = queue.shift();
    try {
      await sendEmail(job.payload);
    } catch (err) {
      logger.error(`Email job failed (attempt ${job.attempts + 1}): ${err.message}`);
      if (job.attempts + 1 < MAX_RETRIES) {
        job.attempts += 1;
        setTimeout(() => {
          queue.push(job);
          processQueue();
        }, RETRY_DELAY_MS * job.attempts);
      } else {
        logger.error(`Email job permanently failed after ${MAX_RETRIES} attempts.`);
      }
    }
  }

  isProcessing = false;
};

const enqueueEmail = (payload) => {
  queue.push({ payload, attempts: 0 });
  processQueue();
};

module.exports = { enqueueEmail };

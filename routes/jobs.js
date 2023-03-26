const express = require("express");
const router = new express.Router();
const Job = require("../models/job");
const { ensureAdmin } = require("../middleware/auth");

// Get a list of all jobs
router.get("/", async function (req, res, next) {
  try {
    const {title, minSalary, hasEquity} = req.query;
    const jobs = await Job.findAll(title, minSalary, hasEquity);
    return res.json({ jobs });
  } catch (err) {
    return next(err);
  }
});

// Get a specific job by its ID
router.get("/:id", async function (req, res, next) {
  try {
    const job = await Job.get(req.params.id);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

// Create a new job (admin only)
router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const job = await Job.create(req.body);
    return res.status(201).json({ job });
  } catch (err) {
    return next(err);
  }
});

// Update a job by its ID (admin only)
router.patch("/:id", ensureAdmin, async function (req, res, next) {
  try {
    const job = await Job.update(req.params.id, req.body);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

// Delete a job by its ID (admin only)
router.delete("/:id", ensureAdmin, async function (req, res, next) {
  try {
    await Job.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

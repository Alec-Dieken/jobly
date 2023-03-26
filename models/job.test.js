"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("create", function () {
  test("should create a new job", async function () {
    const job = await Job.create({
      title: "Software Engineer",
      salary: 120000,
      equity: 0.1,
      companyHandle: "c1",
    });

    expect(job).toEqual({
      id: expect.any(Number),
      title: "Software Engineer",
      salary: 120000,
      equity: "0.1",
      companyHandle: "c1",
    });
  });

  test("should throw BadRequestError if company doesn't exist", async function () {
    try {
      await Job.create({
        title: "Software Engineer",
        salary: 120000,
        equity: 0.1,
        companyHandle: "invalid",
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

describe("findAll", function () {
  test("should return all jobs", async function () {
    // Create sample jobs
    await Job.create({
      title: "Software Engineer",
      salary: 120000,
      equity: 0.1,
      companyHandle: "c1",
    });
    await Job.create({
      title: "Web Developer",
      salary: 80000,
      equity: 0.05,
      companyHandle: "c1",
    });

    const jobs = await Job.findAll();
    expect(jobs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: "Software Engineer" }),
        expect.objectContaining({ title: "Web Developer" }),
      ])
    );
  });
});

describe("get", function () {
  test("should return a specific job", async function () {
    const createdJob = await Job.create({
      title: "Software Engineer",
      salary: 120000,
      equity: 0.1,
      companyHandle: "c1",
    });
    const jobId = createdJob.id;

    const job = await Job.get(jobId);
    expect(job).toEqual(createdJob);
  });

  test("should throw NotFoundError if job doesn't exist", async function () {
    try {
      await Job.get(99999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("update", function () {
  test("should update a specific job", async function () {
    const createdJob = await Job.create({
      title: "Software Engineer",
      salary: 120000,
      equity: 0.1,
      companyHandle: "c1",
    });
    const jobId = createdJob.id;

    const updatedJob = await Job.update(jobId, {
      title: "Senior Software Engineer",
      salary: 150000,
      equity: 0.15,
    });

    expect(updatedJob).toEqual({
      id: jobId,
      title: "Senior Software Engineer",
      salary: 150000,
      equity: "0.15",
      companyHandle: "c1",
    });
  });

  test("should throw NotFoundError if job doesn't exist", async function () {
    try {
      await Job.update(99999, {
        title: "Senior Software Engineer",
        salary: 150000,
        equity: 0.15,
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("remove", function () {
  test("should remove a specific job", async function () {
    const createdJob = await Job.create({
      title: "Software Engineer",
      salary: 120000,
      equity: 0.1,
      companyHandle: "c1",
    });
    const jobId = createdJob.id;

    await Job.remove(jobId);
    try {
      await Job.get(jobId);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("should throw NotFoundError if job doesn't exist", async function () {
    try {
      await Job.remove(99999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

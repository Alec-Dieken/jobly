const request = require("supertest");
const app = require("../app");
const Job = require("../models/job");
const Company = require("../models/company");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u3Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET /jobs", function () {
  test("works for anonymous users with no filters", async function () {
    const resp = await request(app).get("/jobs");
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      jobs: [
        {
          id: expect.any(Number),
          title: "Job1",
          salary: 100000,
          equity: "0",
          companyHandle: "c1",
        },
        {
          id: expect.any(Number),
          title: "Job2",
          salary: 120000,
          equity: "0.05",
          companyHandle: "c2",
        },
      ],
    });
  });

  test("works with title filter", async function () {
    const resp = await request(app).get("/jobs").query({ title: "1" });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      jobs: [
        {
          id: expect.any(Number),
          title: "Job1",
          salary: 100000,
          equity: "0",
          companyHandle: "c1",
        },
      ],
    });
  });

  // Add more tests for minSalary and hasEquity filters
});

describe("GET /jobs/:id", function () {
  test("works for anonymous users", async function () {
    const job = await Job.create({
      title: "Software Engineer",
      salary: 80000,
      equity: 0.01,
      companyHandle: "c1",
    });
    const resp = await request(app).get(`/jobs/${job.id}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      job: {
        id: expect.any(Number),
        title: "Software Engineer",
        salary: 80000,
        equity: "0.01",
        companyHandle: "c1",
      },
    });
  });

  test("returns 404 if job is not found", async function () {
    const resp = await request(app).get(`/jobs/0`);
    expect(resp.statusCode).toEqual(404);
    expect(resp.body.error.message).toEqual("No job with id: 0");
  });
});

describe("POST /jobs", function () {
  test("works for admins", async function () {
    const company = await Company.create({
      handle: "c4",
      name: "C4",
      numEmployees: 10,
      description: "Desc4",
    });
    const resp = await request(app)
      .post("/jobs")
      .send({
        title: "Job4",
        salary: 150000,
        equity: 0,
        companyHandle: "c4",
      })
      .set("authorization", `Bearer ${u3Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      job: {
        id: expect.any(Number),
        title: "Job4",
        salary: 150000,
        equity: "0",
        companyHandle: "c4",
      },
    });
  });

  test("does not work for non-admins", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send({
        title: "Job4",
        salary: 150000,
        equity: 0,
        companyHandle: "c1",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
    expect(resp.body.error.message).toEqual("Unauthorized");
  });
});

describe("PATCH /jobs/:id", function () {
  test("works for admins", async function () {
    const job = await Job.create({
      title: "Software Engineer",
      salary: 80000,
      equity: 0.01,
      companyHandle: "c1",
    });
    const resp = await request(app)
      .patch(`/jobs/${job.id}`)
      .send({ title: "Updated Title" })
      .set("authorization", `Bearer ${u3Token}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      job: {
        id: job.id,
        title: "Updated Title",
        salary: 80000,
        equity: "0.01",
        companyHandle: "c1",
      },
    });
  });

  test("returns 404 if job is not found", async function () {
    const resp = await request(app)
      .patch(`/jobs/0`)
      .send({ title: "Updated Title" })
      .set("authorization", `Bearer ${u3Token}`);
    expect(resp.statusCode).toEqual(404);
    expect(resp.body.error.message).toEqual("No job with id: 0");
  });
});

describe("DELETE /jobs/:id", function () {
  test("works for admins", async function () {
    const job = await Job.create({
      title: "Software Engineer",
      salary: 80000,
      equity: 0.01,
      companyHandle: "c1",
    });
    const resp = await request(app)
      .delete(`/jobs/${job.id}`)
      .set("authorization", `Bearer ${u3Token}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({ deleted: job.id.toString() });
  });

  test("does not work for non-admins", async function () {
    const job = await Job.create({
      title: "Software Engineer",
      salary: 80000,
      equity: 0.01,
      companyHandle: "c1",
    });
    const resp = await request(app)
      .delete(`/jobs/${job.id}`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
    expect(resp.body.error.message).toEqual("Unauthorized");
  });

  test("returns 404 if job is not found", async function () {
    const resp = await request(app)
      .delete(`/jobs/0`)
      .set("authorization", `Bearer ${u3Token}`);
    expect(resp.statusCode).toEqual(404);
    expect(resp.body.error.message).toEqual("No job with id: 0");
  });
});

// Add tests for other routes: GET /jobs/:id, POST /jobs, PATCH /jobs/:id, DELETE /jobs/:id

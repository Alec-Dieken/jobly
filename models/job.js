"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Job {
  static async create({ title, salary, equity, companyHandle }) {
    const {
      rows: [company],
    } = await db.query(`SELECT handle FROM companies WHERE handle = $1`, [
      companyHandle,
    ]);
    if (!company)
      throw new BadRequestError(`Company not found: ${companyHandle}`);

    const {
      rows: [job],
    } = await db.query(
      `
      INSERT INTO jobs (title, salary, equity, company_handle)
      VALUES ($1, $2, $3, $4)
      RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
      [title, salary, equity, companyHandle]
    );

    return job;
  }

  static async findAll(title, minSalary, hasEquity, companyHandle) {
    let whereClauses = [];
    let queryValues = [];
  
    if (title) {
      queryValues.push(`%${title}%`);
      whereClauses.push(`title ILIKE $${queryValues.length}`);
    }
  
    if (minSalary !== undefined) {
      queryValues.push(minSalary);
      whereClauses.push(`salary >= $${queryValues.length}`);
    }
  
    if (hasEquity) {
      whereClauses.push(`equity > 0`);
    }
  
    if (companyHandle) {
      queryValues.push(companyHandle);
      whereClauses.push(`company_handle = $${queryValues.length}`);
    }
  
    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
    const jobsRes = await db.query(
      `SELECT id,
              title,
              salary,
              equity,
              company_handle AS "companyHandle"
       FROM jobs
       ${whereClause}
       ORDER BY title`,
      queryValues
    );
  
    return jobsRes.rows;
  }
  
  

  static async get(id) {
    const jobsRes = await db.query(
      `SELECT id,
                  title,
                  salary,
                  equity,
                  company_handle AS "companyHandle"
           FROM jobs
           WHERE id = $1`,
      [id]
    );

    const job = jobsRes.rows[0];

    if (!job) throw new NotFoundError(`No job with id: ${id}`);

    return job;
  }

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE jobs
                      SET ${setCols}
                      WHERE id = ${idVarIdx}
                      RETURNING id,
                                title,
                                salary,
                                equity,
                                company_handle AS "companyHandle"`;
    const result = await db.query(querySql, [...values, id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job with id: ${id}`);

    return job;
  }

  static async remove(id) {
    const result = await db.query(
      `DELETE FROM jobs WHERE id = $1 RETURNING id`,
      [id]
    );
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job with id: ${id}`);

    return job;
  }
}

module.exports = Job;
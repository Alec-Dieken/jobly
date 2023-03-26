const { BadRequestError } = require("../expressError");

// This function is used to build an SQL query string
// and parameter values for a partial update operation
// in our Jobly PostgreSQL database

function sqlForPartialUpdate(dataToUpdate, jsToSql = {}) {

  // Get an array of the keys from the dataToUpdate object
  const keys = Object.keys(dataToUpdate);

  // If there are no keys in the dataToUpdate object, throw a BadRequestError with a message
  if (keys.length === 0) throw new BadRequestError("No data");

  // Create an array of column names and values to update.
  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  // Return an object containing the SQL query string and parameter values.
  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };

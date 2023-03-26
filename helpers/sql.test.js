const { sqlForPartialUpdate } = require("./sql");
const { BadRequestError } = require("../expressError");

describe("sqlForPartialUpdate", () => {
  test("should generate correct SQL query and values for valid input", () => {
    const dataToUpdate = {
      firstName: "John",
      lastName: "Doe",
      age: 30,
    };

    const jsToSql = {
      firstName: "first_name",
      lastName: "last_name",
    };

    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(result.setCols).toEqual('"first_name"=$1, "last_name"=$2, "age"=$3');
    expect(result.values).toEqual(["John", "Doe", 30]);
  });

  test("should throw BadRequestError if dataToUpdate is empty", () => {
    const dataToUpdate = {};
    const jsToSql = {};

    expect(() => sqlForPartialUpdate(dataToUpdate, jsToSql)).toThrow(BadRequestError);
    expect(() => sqlForPartialUpdate(dataToUpdate, jsToSql)).toThrow("No data");
  });

  test("should generate correct SQL query and values for input with no jsToSql", () => {
    const dataToUpdate = {
      title: "Software Engineer",
      salary: 100000,
    };

    const result = sqlForPartialUpdate(dataToUpdate);

    expect(result.setCols).toEqual('"title"=$1, "salary"=$2');
    expect(result.values).toEqual(["Software Engineer", 100000]);
  });
});


const { SCHEMA_NAME, SCHEMA_CODES } = require("../utilities/constants");
const { pool } = require("../../pool_connection");
const { TABLE_NAMES } = require("../utilities/constants");

async function schemaFuncs() {
  // Create the SCHEMA with user auth if it doesn't exist
  let createSql = `CREATE SCHEMA IF NOT EXISTS ${SCHEMA_NAME}`;

  // Log the SQL statement to console
  console.log("\ncreateSql:", createSql);
  await pool.query(createSql, (createErr, createRes) => {
    if (createErr) {
      console.log("CREATE SCHEMA ERROR:", createErr.code, "--", SCHEMA_CODES[createErr.code]);
      console.log("ERROR code:", createErr.code);
      console.log("ERROR detail:", createErr.detail);
    }

    if (createRes) {
      console.log("\nCREATE SCHEMA RESULT:", createRes.command);

      let createTableSql = `CREATE TABLE ${SCHEMA_NAME}.${TABLE_NAMES.organisations}(
        id TEXT primary key,
        org_name TEXT,
        org_domain TEXT,
        org_location TEXT
      );`;

      console.log("\ncreateTableSql:", createTableSql);

      pool.query(createTableSql, (tableErr, tableRes) => {
        if (tableErr) {
          console.log("CREATE TABLE ERROR:", tableErr.code, "--", SCHEMA_CODES[tableErr.code]);
          console.log("createTableSql:", tableErr);
        }

        if (tableRes) {
          console.log("\nCREATE TABLE RESULT:", tableRes);
        }
      });
    }
  });
}

module.exports = {
  schemaFuncs,
};

const { google } = require("googleapis");
const { makeId } = require("../util");

// Replace with your API key
const API_PATH = "days-until-the-singularity-e3df25d4d411.json";

// Replace with the ID of your Google Sheet
const SPREADSHEET_ID = "10DP5gIYiCLo_wxyHoMDm19WCxjgkWG7EHA0igNKpZFQ";

async function authenticate() {
  console.log("authenticating...");
  const auth = new google.auth.GoogleAuth({
    keyFilename: API_PATH,
    // key: API_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const authClient = await auth.getClient();
  console.log("authClient received");
  const client = google.sheets({
    version: "v4",
    auth: authClient,
  });
  console.log("authentication succeeded");
  return client;
}

const appendRowAuth = (client) => (row) => {
  // Call the API to add a new row to the sheet
  return client.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet1", // The name of the sheet where you want to add the todo
    insertDataOption: "INSERT_ROWS",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [row], // The todo will be added as the first column of a new row
    },
  });
};

const addTodoAuth = (client) => async (todo) => {
  const readTodo = () => todo[1];

  appendRowAuth(client)(todo).then(() => console.log(`Added ${readTodo()}`));
};

const removeTodoAuth = (client) => async (row) => {
  // Call the API to delete the specified row from the sheet
  await client().spreadsheets.values.clear({
    spreadsheetId: SPREADSHEET_ID,
    range: `Sheet1!A${row}:Z${row}`, // The range of cells to delete, from A to Z in the specified row
  });
};

// Example usage: delete the todo in row 3
// deleteTodo(3);

const insertBoldRowAuth = (client) => async (headers, rowIndex) => {
  // Get a reference to the current sheet
  const spread = await client.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
  });

  console.log("sheet");
  console.log(spread.data.sheets);
  const [sheet] = spread.data.sheets;
  sheet.id = sheet.properties.sheetId;

  const requests = [];

  // Add a request to insert a new row at the specified index
  requests.push({
    insertDimension: {
      range: {
        sheetId: sheet.id,
        startIndex: rowIndex,
        endIndex: rowIndex + 1,
        dimension: "ROWS",
      },
      inheritFromBefore: false,
    },
  });

  const getUserEnteredData = (arr) =>
    arr.map((item) => ({
      userEnteredValue: {
        stringValue: item,
      },
    }));
  console.log(headers);
  // Add a request to set the text of each cell in the new row to bold
  requests.push({
    updateCells: {
      range: {
        sheetId: sheet.id,
        startRowIndex: rowIndex,
        endRowIndex: rowIndex + 1,
        startColumnIndex: 0,
        endColumnIndex: headers.length,
      },
      rows: {
        values: getUserEnteredData(headers),
      },
      // values: getUserEnteredData(headers)
      fields: "userEnteredValue",
    },
  });

  //  requests[updateCells][range][startColumnIndex]
  // Execute the requests to insert the row and set the cell formatting
  console.log(requests);
  console.log("Try batch update");
  await client.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    resource: {
      requests: requests,
    },
  });
};

class Client {
  constructor(instance) {
    this.todos = [];
    this.instance = instance;

    this.addTodo = addTodoAuth(this.instance);
    this.removeTodo = removeTodoAuth(this.instance);

    this.makeHeader = insertBoldRowAuth(this.instance);

    this.markDone = async (id) => {
      const props = Object.getOwnPropertyNames(
        Object.getPrototypeOf(this.instance.spreadsheets)
      );
      const values = Object.getOwnPropertyNames(
        Object.getPrototypeOf(this.instance.spreadsheets.values)
      );
      console.log(props);
      console.log(values);
      const spread = await this.instance.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `Sheet1!A${1}:F${10}`,
      });

      console.log(spread.data.values);
      const { values: twoDimArray } = spread.data;
      let ids = [];
      twoDimArray.forEach((row) => {
        if (row[0]) ids.push(row[0]);
        if (row[0] === id) row[4] = "Complete";
      });
      console.log(ids);
    };
  }
}

module.exports = { Client, authenticate };

async function main() {
  const instance = await authenticate();
  const jeep = new Client(instance);

  // const request = {
  //   repeatCell: {
  //     range: {
  //       startIndex
  //     },
  //     cell: {
  //       userEnteredFormat: {
  //         backgroundColor: {
  //           red: 1,
  //           green: 0.5,
  //           blue: 0.5,
  //         },
  //       },
  //     },
  //     fields: "userEnteredFormat(backgroundColor)",
  //   },
  // };

  // const response = await instance.spreadsheets.batchUpdate({
  //   spreadsheetId: SPREADSHEET_ID,
  //   resource: {
  //     requests: [request],
  //   },
  // });

  await jeep.makeHeader(["ID", "Jeep Repair Todo", "CreatedAt", "Due Date"], 0);
  // await jeep.addTodo([
  //   makeId(),
  //   "Look at 1999 - 2004 Jeeps",
  //   new Date().toLocaleString(),
  // ]);
  // ]);
}

// main();

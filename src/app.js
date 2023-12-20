const csv = require("csvtojson");
const path = require("path");
const fs = require("fs").promises;
// const inputFilePath = path.join(__dirname, "../io/test-input.csv");
const inputFilePath = path.join(__dirname, "../io/healthday-40k-redirects.csv");
const outputFilePath = path.join(__dirname, "../io/output.json");

// const healthdayEnBaseUrl = "https://www.healthday.com";

async function main() {
  const redirects = await getJsonData(inputFilePath);
  // console.log("** redirects >> ", redirects);

  const jsonOutput = redirects.reduce(
    (acc, redirect) => {
      const sourceUrl = redirect.source;
      const destinationUrl = redirect.destination;
      acc.redirectUrls.push({ sourceUrl, destinationUrl, statusCode: `NumberInt(301)` });
      return acc;
    },
    {
      redirectUrls: [],
    }
  );
  await fs.writeFile(outputFilePath, JSON.stringify(jsonOutput))
}

main();

function getJsonData(filePath) {
  return new Promise((resolve, reject) => {
    try {
      csv()
        .fromFile(filePath)
        .then((jsonObj) => {
          resolve(jsonObj);
        });
    } catch (err) {
      reject(err);
    }
  });
}

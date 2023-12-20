const csv = require("csvtojson");
const path = require("path");
const fs = require("fs").promises;
const inputFilePath = path.join(__dirname, "../io/test-redirects.csv");
// const inputFilePath = path.join(__dirname, "../io/healthday-40k-redirects.csv");
const outputFilePath = path.join(__dirname, "../io/output.csv");

const healthdayEnBaseUrl = "https://www.healthday.com";

async function main() {
  const redirects = await getJsonData(inputFilePath);
  const finalData = redirects.reduce((accum, redirect) => {
    const url = new URL(redirect.Slug);
    const srcUrl = `${healthdayEnBaseUrl}${url.pathname}`;
    const destUrl = `${url.origin}${url.pathname}`;
    accum += `${srcUrl},${destUrl}\n`;
    return accum;
  }, `source,destination\n`);
  await fs.writeFile(outputFilePath, finalData);
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

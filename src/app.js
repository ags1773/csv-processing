const csv = require("csvtojson");
const path = require("path");
const fs = require("fs").promises;
const inputFilePath = path.join(
  __dirname,
  "../io/Untitled spreadsheet - Sheet1.csv"
);
const _ = require("lodash");

const outputFilePath = path.join(__dirname, "../io/redirects.csv");

async function main() {
  const redirects = await getJsonData(inputFilePath);
  console.log(`[INFO] Processing ${redirects.length} entries`);
  const sourceUrls = [];
  const duplicates = [];
  const output = redirects.reduce((acc, redirect) => {
    if (
      redirect.sourceUrl.startsWith("https://resident.com/") &&
      redirect.destinationUrl === "/"
    ) {
      const sourceUrl = new URL(redirect.sourceUrl);
      if (sourceUrls.includes(sourceUrl.pathname)) {
        duplicates.push(sourceUrl.pathname);
        // throw new Error(`Duplicate source URL ${sourceUrl.pathname}`);
      } else sourceUrls.push(sourceUrl.pathname);
      acc += `${
        decodeURIComponent(sourceUrl.pathname).endsWith("/")
          ? decodeURIComponent(sourceUrl.pathname).slice(0, -1)
          : decodeURIComponent(sourceUrl.pathname)
      },/,301,5548,resident\n`;
    } else {
      throw new Error(`*** Problem in >> ${redirect}`);
    }
    return acc;
  }, "sourceUrl,destinationUrl,statusCode,boldPublisher_id,domainKey\n");
  if (duplicates.length) {
    console.error("Duplicate entries found, aborting");
    console.log(duplicates);
    return;
  }
  await fs.writeFile(outputFilePath, output);
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

const csv = require("csvtojson");
const path = require("path");
const fs = require("fs").promises;
const inputFilePath = path.join(
  __dirname,
  "../io/Kamadenu.Del.Tag.Redirection.csv"
);
const _ = require("lodash");

const outputFilePath = path.join(__dirname, "../io/redirects.csv");

async function main() {
  const redirects = await getJsonData(inputFilePath);
  console.log(`[INFO] Processing ${redirects.length} entries`);
  const sourceUrls = [];
  const output = redirects.reduce((acc, redirect) => {
    if (
      redirect.Source_URL.startsWith("/topic") &&
      redirect.Destination_URL === "https://kamadenu.hindutamil.in"
    ) {
      if (sourceUrls.includes(redirect.Source_URL))
        throw new Error(`Duplicate source URL ${redirect.Source_URL}`);
      else sourceUrls.push(redirect.Source_URL);
      acc += `${redirect.Source_URL},/,301,2399,kamadenu\n`;
    } else {
      throw new Error("Doesn't start with /topic");
    }
    return acc;
  }, "sourceUrl,destinationUrl,statusCode,boldPublisher_id,domainKey\n");
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

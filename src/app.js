const csv = require("csvtojson");
const path = require("path");
const fs = require("fs").promises;

async function main() {
  const pathToInputFile = path.join(
    __dirname,
    "../io/ahead-asset-correction-query-results.csv"
  );
  const pathToOutputFile = path.join(__dirname, "../io/output.csv");
  const dataJson = await getJsonData(pathToInputFile);
  const filteredData = dataJson
    .filter((row) => row.date !== "2022-03-29")
    .sort((a, b) => Number(a.date.slice(8)) - Number(b.date.slice(8)))
    .reduce((acc, row) => {
      acc += `"${row.referer_domain}","${row.total_requests}","${row.total_bytes}","${row.hit_count}","${row.date}"\n`;
      return acc;
    }, `"referer_domain","total_requests","total_bytes","hit_count","date"\n`);
  await fs.writeFile(pathToOutputFile, filteredData);
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

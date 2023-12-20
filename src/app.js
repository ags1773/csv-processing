const csv = require("csvtojson");
const path = require("path");
const fs = require("fs").promises;

async function main() {
  const pathToOutputFile = path.join(__dirname, "../io/output.csv");
  const assetDataJson = await getJsonData(
    path.join(__dirname, "../io/daily-asset-requests-for-ahead.csv")
  );
  const addendumDataJson = await getJsonData(
    path.join(__dirname, "../io/addendum.csv")
  );
  const finalAssetData = getQtAcePubs().reduce((accum, publisher) => {
    accum += getDates().reduce((acc, date) => {
      const existingData = assetDataJson.find(
        (data) => data.publisher_name === publisher && data.date === date
      );
      const addendumData = addendumDataJson.find(
        (data) => data.publisher_name === publisher && data.date === date
      );
      if (existingData || addendumData) {
        acc += `\n`
      } else {
        console.log(`Data not found for ${publisher} on ${date}`)
      }
      return acc;
    }, "");
    return accum;
  }, `publisher_name,total_requests,total_bytes,hit_count,date\n`);
  await fs.writeFile(pathToOutputFile, finalAssetData);
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

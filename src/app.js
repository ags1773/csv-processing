const csv = require("csvtojson");
const path = require("path");
const fs = require("fs").promises;

async function main() {
  const pathToOutputFile = path.join(__dirname, "../io/output.csv");
  const publisherData = await getJsonData(
    path.join(__dirname, "../io/publisher.csv")
  );
  const publisherDomains = publisherData.map((data) => data.domain_url);
  const assetData = (
    await getJsonData(path.join(__dirname, "../io/ahead-asset-data.csv"))
  )
    .filter((data) => publisherDomains.includes(data.referer_domain))
    .map((data) => {
      const { name: publisherName } = publisherData.find(
        (pubData) => pubData.domain_url === data.referer_domain
      );
      return { publisher_name: publisherName, ...data };
    })
    .reduce((acc, row) => {
      acc += `"${row.publisher_name}","${row.referer_domain}","${row.total_requests}","${row.total_bytes}","${row.hit_count}","${row.date}"\n`;
      return acc;
    }, `"publisher_name","referer_domain","total_requests","total_bytes","hit_count","date"\n`);

  await fs.writeFile(pathToOutputFile, assetData);
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

// const assetData = dataJson
//     .filter((row) => row.date !== "2022-03-29")
//     .sort((a, b) => Number(a.date.slice(8)) - Number(b.date.slice(8)))
//     .reduce((acc, row) => {
//       acc += `"${row.referer_domain}","${row.total_requests}","${row.total_bytes}","${row.hit_count}","${row.date}"\n`;
//       return acc;
//     }, `"referer_domain","total_requests","total_bytes","hit_count","date"\n`);

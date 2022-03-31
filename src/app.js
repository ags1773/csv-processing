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
      if (existingData && addendumData) {
        acc += `${existingData.publisher_name},${String(
          Number(existingData.total_requests) +
            Number(addendumData.total_requests)
        )},${String(
          Number(existingData.total_bytes) + Number(addendumData.total_bytes)
        )},${String(
          Number(existingData.hit_count) + Number(addendumData.hit_count)
        )},${existingData.date}\n`;
      }
      return acc;
    });
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

// const assetData = dataJson
//     .filter((row) => row.date !== "2022-03-29")
//     .sort((a, b) => Number(a.date.slice(8)) - Number(b.date.slice(8)))
//     .reduce((acc, row) => {
//       acc += `"${row.referer_domain}","${row.total_requests}","${row.total_bytes}","${row.hit_count}","${row.date}"\n`;
//       return acc;
//     }, `"referer_domain","total_requests","total_bytes","hit_count","date"\n`);

function getQtAcePubs() {
  return [
    "ajel",
    "anweshanam",
    "barandbench",
    "barandbench-hindi",
    "barandbench-kannada",
    "bettorsinsider",
    "bhoomitoday",
    "climatedesk",
    "corner",
    "crimetak",
    "dailynewsnepal",
    "dainikgomantak",
    "deshdoot",
    "dharmadispatch",
    "eastmojo",
    "ejan",
    "esakal",
    "evoindia",
    "fastbikesindia",
    "ficl",
    "foodtechbiz",
    "forbesga",
    "ftcftcftc",
    "gomantaktimes",
    "greaterkashmir",
    "greatkarunadu",
    "happenings",
    "hindustanreads",
    "iglobalnews",
    "indiaglobalbusiness",
    "kamadenu",
    "knocksense",
    "magazine-watertoday",
    "matternews",
    "mimorelia",
    "mumbaitak",
    "nationwide",
    "netindian",
    "newslaundry",
    "newssensetn",
    "pennews",
    "peoplesreporter",
    "pratidhvani",
    "pratidintime",
    "pratinidhimanthan",
    "presscenter",
    "punjabtoday",
    "raftaar",
    "rajexpress",
    "saamtv",
    "sabq",
    "sarkarnama",
    "sathyadeepam",
    "sinceindependence",
    "sinceindependence-hindi",
    "startupcityindia",
    "steelguru",
    "tendernama",
    "theamj",
    "thebridgechronicle",
    "theceo",
    "thecue",
    "thelawyer",
    "thelede",
    "thenewsagency",
    "transportandlogisticsme",
    "tv5kannada",
    "udaybulletin",
    "upfrontstories",
    "uptak",
    "whiteswanfoundation",
    "whiteswanfoundation-bengali",
    "whiteswanfoundation-hindi",
    "whiteswanfoundation-kannada",
    "whiteswanfoundation-malayalam",
    "whiteswanfoundation-tamil",
    "wuzupnigeria",
    "xchange",
    "yoyocial",
  ];
}
function getDates() {
  return [
    "2022-03-01",
    "2022-03-02",
    "2022-03-03",
    "2022-03-04",
    "2022-03-05",
    "2022-03-06",
    "2022-03-07",
    "2022-03-08",
    "2022-03-09",
    "2022-03-10",
    "2022-03-11",
    "2022-03-12",
    "2022-03-13",
    "2022-03-14",
    "2022-03-15",
    "2022-03-16",
    "2022-03-17",
    "2022-03-18",
    "2022-03-19",
    "2022-03-20",
    "2022-03-21",
    "2022-03-22",
    "2022-03-23",
    "2022-03-24",
    "2022-03-25",
    "2022-03-26",
    "2022-03-27",
    "2022-03-28",
    "2022-03-29",
  ];
}

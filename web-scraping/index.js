const puppeteer = require("puppeteer");
require("dotenv/config");
const ObjectsToCsv = require("objects-to-csv");
const QandAnswerController = require("./controllers/qAndAnserController");
async function indexing(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const link = await page.evaluate(() => {
    return Array.from(
      document.getElementsByClassName(
        "q-box qu-display--block qu-cursor--pointer qu-hover--textDecoration--none Link___StyledBox-t2xg9c-0"
      )
    ).map((x) => {
      return x.href;
    });
  });
  const data = [];
  await Promise.all(
    link.map(async (e, index) => {
      if (!e.split("/").includes("unanswered")) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(e);
        const answer = await page.evaluate(() => {
          return Array.from(
            document.getElementsByClassName("q-box qu-userSelect--text")
          ).map((x) => {
            return x.textContent;
          });
        });
        if (answer[1].match("Lanjutkan Membaca")) {
          console.log(true);
          data.push({ question: answer[0], answer: answer[2] });
        } else {
          console.log(false);
          data.push({ question: answer[0], answer: answer[1] });
          // console.log({question: answer[0], answer:answer[1]});
        }
        // console.log(answer);
        browser.close();
      }
    })
  );

  // QandAnswerController.insertMany(data);

  convertToCSV(data);
  // console.log(data);

  browser.close();
}

const convertToCSV = async (data) => {
  const csv = new ObjectsToCsv(data);

  // Save to file:
  await csv.toDisk(`./results/${Date.now()}test.csv`);
};

async function scraping(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const answer = await page.evaluate(() => {
    return Array.from(
      document.getElementsByClassName("q-box qu-userSelect--text")
    ).map((x) => {
      return x.textContent;
    });
  });

  console.log(answer);
  browser.close();
}

// scrapper('https://id.quora.com/Bagaimana-cara-mengobati-jerawat-yang-sudah-bertahun-tahun-lamanya')
indexing(
  "https://id.quora.com/Apa-saja-tempat-liburan-hits-terbaru-di-Bali-tahun-2020"
);

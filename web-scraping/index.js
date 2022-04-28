const puppeteer = require('puppeteer');
const fs = require('fs/promises')
const ObjectsToCsv = require('objects-to-csv');
async function indexing(url){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: 'load',
    timeout: 0,
  });

  const link = await linking(page);
  const data = [];
  let newListLink = [];
  const scrapingData1 = await scraping(link, browser);
  data.push(...scrapingData1.data);
  newListLink.push(...scrapingData1.newListLink);
  let newListUniqueLink = await filterUniqLink(newListLink)
  newListLink.push(...newListUniqueLink)
  const scrapingData2 = await scraping(newListUniqueLink, browser);
  data.push(...scrapingData2.data);
  newListLink.push(...scrapingData2.newListLink);

  convertToCSV(data)

  browser.close();
}

const convertToCSV = async (data) => {
  const csv = new ObjectsToCsv(data);
 
  // // Save to file:
  await csv.toDisk(`./results/${Date.now()}test.csv`);
}


async function linking(page) {
  const link = await page.evaluate(() => {
    return Array.from(document.getElementsByClassName('q-box qu-display--block qu-cursor--pointer qu-hover--textDecoration--none Link___StyledBox-t2xg9c-0')).map((x) => {
      return x.href
    })
  })
  const uniqueLink = link.filter(function(item, pos) {
    return link.indexOf(item) == pos;
  })

  return uniqueLink;
}

async function filterUniqLink(data) {
  return data.filter(function(item, pos) {
    return data.indexOf(item) == pos;
  })
}

async function scraping(link, browser){
  const newListLink = [];
  const data = [];
  await Promise.all(link.map(async (e, index) => {
    try {
      if(!e.split('/').includes('unanswered')){
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(e, {
          waitUntil: 'load',
          timeout: 0,
        });
  
        const newLink = await page.evaluate(() => {
          return Array.from(document.getElementsByClassName('q-box qu-display--block qu-cursor--pointer qu-hover--textDecoration--none Link___StyledBox-t2xg9c-0')).map((x) => {
            return x.href
          })
        })
  
        newListLink.push(...newLink);
  
        const answer = await page.evaluate(() => {
          return Array.from(document.getElementsByClassName('q-box qu-userSelect--text')).map((x) => {
            return x.textContent
          })
        })
        try {
          if (answer[1].includes('Lanjutkan Membaca')) {
            console.log(answer[1].includes('Lanjutkan Membaca'));
            data.push({question: answer[0], answer: answer[2]})
          } else {
            // console.log(false);
            data.push({question: answer[0], answer: answer[1]})
          }
        } catch {
          console.log("Something Error, please try again");
        }
      }
    } catch (error) {
      console.log(error);
      console.log("puppeter error");
    }
    
  }))

  return {
    data,
    newListLink
  }
}


// scrapper('https://id.quora.com/Bagaimana-cara-mengobati-jerawat-yang-sudah-bertahun-tahun-lamanya')
indexing('https://id.quora.com/Apa-dampak-buruk-jika-sering-nonton-film-semi')
// indexing('https://id.quora.com/Bagaimana-cara-menghilangkan-jerawat-bruntusan-dan-mencerahkan-wajah-Saya-sudah-mencoba-memakai-sabun-Kojie-San-dan-produk-lainnya-tapi-tetap-tidak-menunjukkan-hasil')
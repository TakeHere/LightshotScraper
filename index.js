const puppeteer = require('puppeteer');
const fs = require('fs');
const client = require('https');
const fetch = require('node-fetch');

const chars = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z", 1,2,3,4,5,6,7,8,9];
const baseLink = "https://prnt.sc/";

scrape()

async function scrape(){
    console.log("loading...")

    const browser = await puppeteer.launch({headless:true});
    const page = await browser.newPage();

    await page.goto("https://prnt.sc/d7zd")

    await page.waitForSelector(".css-47sehv");
    await page.click(".css-47sehv")

    let charsNb = 6
    let linksNb = Math.pow(chars.length, charsNb)
    console.log("Loading ended, scraping started")

    for (let i = 0; i < linksNb; i++) {
        await page.goto(getRandomLink(charsNb));
        //console.log(page.url())

        await page.waitForSelector(".screenshot-image");
        const imgs = await page.$$eval('.screenshot-image', imgs => imgs.map(img => img.getAttribute('src')));
        console.log(imgs[0]);

        if (!imgs[0].startsWith("//") || imgs[0] === "https://image.prntscr.com/image/M5_X1-GcR6aWs-Q7izzQ6g.png") {
          let path = "./imgs/" + imgs[0].split("/")[imgs[0].split("/").length-1] + "Out.png";
          await download(imgs[0], path, () => {
            let data = fs.readFileSync(path)
            if (data.includes("html")) {
              fs.unlinkSync(path);
            }
          });
        }


            //const base64Data = imgs[0].replace(/^data:image\/png;base64,/, "");
            //fs.writeFile("./imgs/" + Date.now() + "Out.png", base64Data, 'base64', function(err){if (err != null) console.log(err)});
    }

    await browser.close();
}

async function download(url, path, callback) {
  const response = await fetch(url);
  const buffer = await response.buffer();
  fs.writeFile(path, buffer, () => callback())
    //console.log('finished downloading!'));
}

//downloadImage('https://example.com/image.jpg', 'image.jpg');

function getRandomLink(charsNb){
    let returnLink = baseLink

    for (let i = 0; i < charsNb; i++) {
        returnLink = returnLink + getRandomFromArray(chars)
    }

    return returnLink
}

function getRandomFromArray(array){
    return array[Math.floor(Math.random()*array.length)]
}

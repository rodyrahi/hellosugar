// const express = require("express");
// var router = express.Router();
// const http = require("http");
// const qrcode = require('qrcode');
// var socketIO = require("socket.io");
// var app = express();
// var server = http.createServer(app);
// var io = socketIO(server);
// const puppeteer = require('puppeteer');
// const { scrollPageToBottom } = require('puppeteer-autoscroll-down')

// const fs = require("fs");
// const { log } = require("console");
// const cookiesFilePath = 'cookies.json';
// // Save Session Cookies

// router.get("/" , (req , res) =>{
//         res.render("test/telegram")
// })

// router.post("/add" , async (req , res) => {
//     let group  = req.body.name;
//     console.log(group);


//     //  *[@id="column-right"]/div/div/div[2]/div/div/div[2]/div/div/div[5]/div[3]
   
        
//         const scrapeInfiniteScrollItems = async (page, itemTargetCount) => {
//             let items = [];
          
//             while (itemTargetCount > items.length) {
//               items = await page.evaluate(() => {
//                 const items = Array.from(document.querySelectorAll("#boxes > div"));
//                 return items.map((item) => item.innerText);
//               });
          
//               previousHeight = await page.evaluate("document.body.scrollHeight");
//               await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
//               await page.waitForFunction(
//                 `document.body.scrollHeight > ${previousHeight}`
//               );
//               await new Promise((resolve) => setTimeout(resolve, 1000));
//             }
          
//             return items;
//           };
          
//           (async () => {
//             const browser = await puppeteer.launch({
//               headless: false, userDataDir: '/tmp/myChromeSession'
//             });
          
//             const page = await browser.newPage();
//             await page.goto("https://web.telegram.org/k/#@indiegamechat");

//             function delay(time) {
//                 return new Promise(function(resolve) { 
//                     setTimeout(resolve, time)
//                 });
//              }
//              await delay(4000);
//             await page.click('.tgico-search')
          
//             const items = await scrapeInfiniteScrollItems(page, 100);
//             console.log( items );

//           })();
    
// })
// module.exports = router
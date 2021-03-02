// // 설치된 puppeteer 모듈
// const puppeteer = require('puppeteer');

// (async () => {
//   // headless 브라우저 실행
//   const browser = await puppeteer.launch();
//   // 새로운 페이지 열기
//   const page = await browser.newPage();
//   // `https://ko.reactjs.org/` URL에 접속
//   await page.goto("https://ko.reactjs.org/");
//   // `ko-reactjs-homepage.png` 스크린샷을 캡처 하여 Docs 폴더에 저장
//   await page.screenshot({ path: "./Docs/ko-reactjs-homepage.png" });
//   // `react_korea.pdf` pdf 파일을 생성하여 Docs 폴더에 저장
//   await page.pdf({ path: "./Docs/react_korea.pdf", format: "A4" });

//   /****************
//    * 원하는 작업 수행 *
//    ****************/

//   // 모든 스크래핑 작업을 마치고 브라우저 닫기
//   await browser.close();
// })();





/// 카카오맵으로 매장 검색 후 매장명과 주소 크롤링


const puppeteer = require("puppeteer");
const fs = require("fs");
const { encode } = require("querystring");

(async () => {
  console.log("START");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let total = 0

  for (let i = 1; i < 10 ; i++) { //최대페이지 지정
    console.log("page", i)
    const target_url =
      "https://map.kakao.com/?map_type=TYPE_MAP&q=" +
      "스타벅스 R" 
      +
      "&tab=place&page=" +
      i +
      "&urlLevel=9";
    await page.goto(target_url);

    await page.waitForSelector('.addr') // 주소 있는 element class

    const stores = await page.evaluate(() => {
      return [...document.body.querySelectorAll(".link_name")].map( // 장소 이름
        (element) => element.innerText
      );
    });
    const values = await page.evaluate(() => {
      return [...document.body.querySelectorAll(".addr")].map( // 장소 주소
        (element) => element.innerText
      );
    });
    for (let i = 0; i < stores.length; i++) {
      let location = values[i];
      if (values[i].indexOf("\n") > -1) {
        location = values[i].slice(0, values[i].indexOf(
          "\n")); // 지번주소와 신주소가 함께 있는 경우 \n\n과 같이 나오길래 뒤에는 날려버림.
      }
      fs.appendFile("StarbucksR.csv", `${stores[i]},${location}\n`, function (
        err) { // csv 파일에 한줄씩 append
        if (err) throw err;
      });
      console.log(`${stores[i]},${location}`);
    }

    await page.screenshot({
      path: "example.png"
    });
    await page.waitFor(2000)
    total += stores.length
    console.log("total : ", total)
  }

  await browser.close();
})();

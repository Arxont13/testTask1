const puppeteer = require('puppeteer');
const {
    takeElementById,
    fillInputElement,
    takeElementByXpath,
    clickElement,
    MainClass
} = require("../../utils");

const headless = true
let browser;
let inputText = 'солнце'
let translatedTextToCompare = 'Sun'

const stringXpath = {
    inputForRussianText: "//html/body/c-wiz/div/div[2]/c-wiz/div[2]/c-wiz/div[1]/div[2]/div[2]/c-wiz[1]/span/span/div",
    btnChangeTranslationLanguage: "/html/body/c-wiz/div/div[2]/c-wiz/div[2]/c-wiz/div[1]/div[1]/c-wiz/div[5]/div/div[2]/div/div/span/button[2]/span[3]",
    inputForTranslatedText: "//span[@class = 'VIiyi']/span/span",
    lowestVisibleElement: "//html/body/c-wiz/div/div[2]/c-wiz/nav/a[3]"
}


let scrape = async () => {
   
    browser = await new MainClass().createBrowserInstance();

    let page = await browser.newPage();
    await page.goto('https://translate.google.ru/');
    await page.setViewport({width: 1350, height: 0})
    
    let elem;
    let textFromInput;
    /*Check, that the lowest element is loaded*/ 
    await takeElementByXpath(page, stringXpath.lowestVisibleElement,
        0, 10000)

    /*Input text for translate*/
    await fillInputElement (page,
        await takeElementByXpath(page, stringXpath.inputForRussianText,0, 8000),
        inputText, 0)

    /*Change language for translate to English*/
    await clickElement (page,
        await takeElementByXpath(page, stringXpath.btnChangeTranslationLanguage,
            0, 8000),0)

    await page.waitForTimeout(5000);
    /*Wait for completing translation */
    elem = await takeElementByXpath(page, stringXpath.inputForTranslatedText,0, 8000),
    textFromInput = await page.evaluate((elem)=>elem.textContent, elem);
    
    /*Wait for loading hypothetical new page*/
    if (textFromInput !== translatedTextToCompare)
    {
        throw {name: `Test FAILED. Wrong translate!`}
    }

    console.log('Test PASSED. Result is taken');
    await browser.close();
};



scrape()
  .catch((err)=>{
        browser.close()
        console.log(err.name)
  });
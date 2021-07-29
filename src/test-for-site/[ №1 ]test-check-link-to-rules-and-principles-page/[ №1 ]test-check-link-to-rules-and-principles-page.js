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
let testingURL = 'https://policies.google.com/?hl=ru';/**/


const stringXpath = {
    btnBurgerNewPages: "//html/body/div[2]/header/div[2]/div[1]/div[1]",
    linkRulesAndPrinciplesSubpage: "/html/body/div[2]/header/div[1]/div/div[2]/div/c-wiz/nav/div[2]/a[1]",
    lowestVisibleElement: "//html/body/c-wiz/div/div[2]/c-wiz/nav/a[3]"
}


let scrape = async () => {
   
    browser = await new MainClass().createBrowserInstance();

    let page = await browser.newPage();
    await page.goto('https://translate.google.ru/');
    await page.setViewport({width: 1350, height: 0})

    /*Check, that the lowest element is loaded*/ 
    await takeElementByXpath(page, stringXpath.lowestVisibleElement,
        0, 10000)

    /*Click menu for new pages links*/
    await clickElement (page,
        await takeElementByXpath(page, stringXpath.btnBurgerNewPages,
            0, 8000),0)

    /*Click on Rules and Principles page*/
    await clickElement (page,
        await takeElementByXpath(page, stringXpath.linkRulesAndPrinciplesSubpage,
            0, 8000),0)

    /*Wait for loading hypothetical new page*/
    await page.waitForTimeout(5000);
    if (page.url() !== 'https://policies.google.com/?hl=ru')
    {
        throw {name: `Test FAILED. Link "Rules and Principles" don't lead to correct page!`}
    }

    console.log('Test PASSED. Result is taken');
    await browser.close();
};



scrape()
  .catch((err)=>{
        browser.close()
        console.log(err.name)
  });
const puppeteer = require('puppeteer');

let takeElementById = async (
    /*ИнстансСтраницыСайта*/page,
    /*IdЭлемента*/id,
    /*ВремяДоКлика*/timeoutBefore,
    /*ВремяОжиданияЭлемента*/timeoutInner
) => {
    await page.waitForTimeout(timeoutBefore)
    await page.waitForSelector(`#${id}`, {visible: true, timeout: timeoutInner})
        .catch(()=>{
            throw {name: 1}
        });
    let x = await page.waitForSelector(`#${id}`, {visible: true, timeout: timeoutInner})
    return(x)
}

let fillInputElement = async (
    /*ИнстансСтраницыСайта страницы*/page,
    /*elementHandleЭлемента*/element,
    /*ТекстДляВвода*/input,
    /*ВремяДоЗаполнения*/timeoutBefore
) =>{
    await page.waitForTimeout(timeoutBefore);

    await element.focus()
        .catch(() => {throw {name: "Cant focus on element"}})

    let answer = 0;
    for(let j = 0; j<30; j++){
        answer = await element.click({delay: 10})
            .then(() => 1)
            .catch(() => 0)
        if (answer === 1) {break;}
        await page.waitForTimeout(200)
    }

    await page.keyboard.type(input);/*Заполняем поле кода для входа в аккаунт*/

}

let takeElementByXpath = async (
    page,/*инстанс страницы*/
    xpath,/*xpath элемента*/
    timeoutBefore,/*Время ожидания получения элемента со страницы*/
    timeoutIn,/*Время ожидания после выполнения действия с элементом*/
) => {
    await page.waitForTimeout(timeoutBefore);
    await page.waitForXPath(`${xpath}`
        ,{visible: true, timeout: timeoutIn})
        .catch((err) => {
            console.log(err)
            throw {name: "This element doesn't exist"}});
    let [element] = await page.$x(`${xpath}`);
    await element.focus();
    return(element);
}

let clickElement = async (
    /*ИнстансСтраницыСайта*/page,
    /*elementHandleЭлемента*/element,
    /*ВремяДоКлика*/timeoutBefore
) => {
    await page.waitForTimeout(timeoutBefore);
    await element.focus();

    let answer = 0;
    for(let j = 0; j<30; j++){
        answer = await element.click({delay: 10})
            .then(() => 1)
            .catch(() => 0)
        if (answer === 1) {break;}
        await page.waitForTimeout(500)
    if (j===29){
        throw {name:"Cant click on element"}
    }
    }
}


class MainClass {
    async createBrowserInstance(){
        return (
        await puppeteer.launch({args:[`--disable-setuid-sandbox`,`--start-maximized`]
           ,headless: false, timeout: 20000})
        )
    }
}

module.exports = {
    MainClass,
    takeElementById,
    fillInputElement,
    takeElementByXpath,
    clickElement
};
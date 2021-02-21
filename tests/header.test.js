const puppeteer = require('puppeteer')

let browser, page

beforeEach( async () => {
    browser = await puppeteer.launch({
        headless: false
    })
    page = await browser.newPage()
    await page.goto('localhost:3000')
})

afterEach( async () => {
    //await browser.close()
})

test('we can launch a browser', async () => {
    //Node JS process running puppeteer which connect with chromium process, 
    //then puppeteer serializes the function then run on chromium process.
    const text = await page.$eval('a.brand-logo', el => el.innerHTML) 
    expect(text).toEqual('Blogster') 
})

test('clicking on Login link', async () => {
    await page.click('.right a')
    const url = await page.url();
    expect(url).toMatch('/accounts\.google\.com')
    //console.log(url)
})

test.only('when signed in shows logout button', async () => { //adding test.only(....) = run ony this tests.
    const id = '602e3af875c90c445486160f' //id of users taken from mongoDB
    const Buffer =require('safe-buffer').Buffer
    const sessionObject = {
        passport : {
            user : id
        }
    } 
    const sessionStr = Buffer.from(JSON.stringify(sessionObject)).toString('base64')
    const Keygrip = require('keygrip')
    const keys = require('../config/keys')
    const keygrip = new Keygrip([keys.cookieKey])
    const sig = keygrip.sign('session=' + sessionStr)
    //console.log(sessionStr, sig)
    await page.setCookie({name: 'session', value: sessionStr })
    await page.setCookie({name: 'session.sig', value: sig })
    await page.goto('localhost:3000')
    await page.waitFor('a[href="/auth/logout"]')
    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML)
    expect(text).toEqual('Logout')
})  //till 82class

const puppeteer = require('puppeteer-extra');
const UserAgents = require('user-agents');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';
puppeteer.use(StealthPlugin())

class PuppeteerService {
  async instantiatePuppeteerStealthNewPage(browser, url) {
    // > Enable stealth mode (via puppeteer-extra-plugin-stealth)
    // puppeteer.use(StealthPluging())

    // >  Browser error tratactive
    // let retries = 0;
    // let isReleased = false;
    // browser.on('disconnected', async () => {
    //   if (isReleased) return;

    //   console.log("> Browser crash");

    //   if (retries <= 3) {
    //     retries += 1;
    //     if (browser && browser.process() != null) browser.process().kill('SIGINT');
    //     await this.getProductsDataByUrl(url);
    //   } else {
    //     throw "> Browser crashed more than 3 times";
    //   }
    // });

    const page = await browser.newPage();

    // > Skip dialog
    page.on("dialog", async (dialog) => {
      await dialog.dismiss();
    });

    // > Randomize User-agent or Set a valid one (via user-agents)
    const userAgent = new UserAgents();
    const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';
    const UA = userAgent.toString() || USER_AGENT;
    await page.setUserAgent(UA);
    await page.setJavaScriptEnabled(true);
    await page.setDefaultNavigationTimeout(0);

    // > Randomize Viewport size
    await page.setViewport({
      width: 1920 + Math.floor(Math.random() * 100),
      height: 3000 + Math.floor(Math.random() * 100),
      deviceScaleFactor: 1,
      hasTouch: false,
      isLandscape: false,
      isMobile: false,
    });

    // > Skip images/styles/fonts loading for better performance
    // page.on('request', (req) => {
    //   if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
    //       req.abort();
    //   }
    //   else {
    //       req.continue();
    //   }
    // });

    // await page.setRequestInterception(true);

    // page.on("request", async (request) => {
    //   // "script" is also an option
    //   if (["font", "image", "stylesheet"].indexOf(request.resourceType()) !== -1) {
    //     request.abort();
    //   } else {
    //     await proxyRequest({
    //       page,
    //       proxyUrl: `http://localhost:3030`,
    //       request,
    //     });
    //   }
    // });

    // > Pass "WebDriver check"
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
          get: () => false,
      });
    });

    // > Pass "Chrome check"
    await page.evaluateOnNewDocument(() => {
      //@ts-ignore
      window.chrome = {
        runtime: {},
        // etc.
      };
    });

    // > Pass "Notifications check"
    await page.evaluateOnNewDocument(() => {
      const originalQuery = window.navigator.permissions.query;
      //@ts-ignore
      return window.navigator.permissions.query = (parameters) => (
        parameters.name === 'notifications' ?
          Promise.resolve({ state: Notification.permission }) :
          originalQuery(parameters)
      );
    });

    // > Pass "Plugins check"
    await page.evaluateOnNewDocument(() => {
      // Overwrite the `plugins` property to use a custom getter.
      Object.defineProperty(navigator, 'plugins', {
        // This just needs to have `length > 0` for the current test,
        // but we could mock the plugins too if necessary.
        get: () => [1, 2, 3, 4, 5],
      });
    });

    // > Pass "Languages check"
    await page.evaluateOnNewDocument(() => {
      // Overwrite the `plugins` property to use a custom getter.
      Object.defineProperty(navigator, 'languages', {
          get: () => ['en-US', 'en'],
      });
    });
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });

    return {
      page: page,
      _browser: browser
    };
  }
  async configureNewPage(page) {
    // > Enable stealth mode (via puppeteer-extra-plugin-stealth)
    // puppeteer.use(StealthPluging())

    // >  Browser error tratactive
    // let retries = 0;
    // let isReleased = false;
    // browser.on('disconnected', async () => {
    //   if (isReleased) return;

    //   console.log("> Browser crash");

    //   if (retries <= 3) {
    //     retries += 1;
    //     if (browser && browser.process() != null) browser.process().kill('SIGINT');
    //     await this.getProductsDataByUrl(url);
    //   } else {
    //     throw "> Browser crashed more than 3 times";
    //   }
    // });

    // > Skip dialog
    page.on("dialog", async (dialog) => {
      await dialog.dismiss();
    });

    // > Randomize User-agent or Set a valid one (via user-agents)
    const userAgent = new UserAgents();
    const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';
    const UA = userAgent.toString() || USER_AGENT;
    await page.setUserAgent(UA);
    await page.setJavaScriptEnabled(true);
    await page.setDefaultNavigationTimeout(0);

    // > Randomize Viewport size
    await page.setViewport({
      width: 1920 + Math.floor(Math.random() * 100),
      height: 3000 + Math.floor(Math.random() * 100),
      deviceScaleFactor: 1,
      hasTouch: false,
      isLandscape: false,
      isMobile: false,
    });

    // > Skip images/styles/fonts loading for better performance
    page.on('request', (req) => {
      if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
          req.abort();
      } else {
          req.continue();
      }
    });

    // const blocked_domains = [
    //   'googlesyndication.com',
    //   'adservice.google.com',
    // ];
    
    // page.on('request', request => {
    //   const url = request.url()
    //   if (blocked_domains.some(domain => url.includes(domain))) {
    //     request.abort();
    //   } else {
    //     request.continue();
    //   }
    // });

    await page.setRequestInterception(true);

    // page.on("request", async (request) => {
    //   // "script" is also an option
    //   if (["font", "image", "stylesheet"].indexOf(request.resourceType()) !== -1) {
    //     request.abort();
    //   } else {
    //     await proxyRequest({
    //       page,
    //       proxyUrl: `http://localhost:3030`,
    //       request,
    //     });
    //   }
    // });

    // > Pass "WebDriver check"
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
          get: () => false,
      });
    });

    // > Pass "Chrome check"
    await page.evaluateOnNewDocument(() => {
      //@ts-ignore
      window.chrome = {
        runtime: {},
        // etc.
      };
    });

    // > Pass "Notifications check"
    await page.evaluateOnNewDocument(() => {
      const originalQuery = window.navigator.permissions.query;
      //@ts-ignore
      return window.navigator.permissions.query = (parameters) => (
        parameters.name === 'notifications' ?
          Promise.resolve({ state: Notification.permission }) :
          originalQuery(parameters)
      );
    });

    // > Pass "Plugins check"
    await page.evaluateOnNewDocument(() => {
      // Overwrite the `plugins` property to use a custom getter.
      Object.defineProperty(navigator, 'plugins', {
        // This just needs to have `length > 0` for the current test,
        // but we could mock the plugins too if necessary.
        get: () => [1, 2, 3, 4, 5],
      });
    });

    // > Pass "Languages check"
    await page.evaluateOnNewDocument(() => {
      // Overwrite the `plugins` property to use a custom getter.
      Object.defineProperty(navigator, 'languages', {
          get: () => ['en-US', 'en'],
      });
    });
    return page;
  }
}
module.exports = PuppeteerService
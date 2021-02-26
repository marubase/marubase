const { chromium, firefox, webkit } = require("playwright");
const EventEmitter = require("events");

class PlaywrightBrowser extends EventEmitter {
  constructor(browser) {
    super();
    this._browser = browser;
    this.name = browser.name();
    this.id = Math.random();
  }

  async forceKill() {
    if (!this._instance) return;
    await this._instance.close();
  }

  async start(url) {
    this._instance = await this._browser.launch({ headless: true });
    this._instance.once("disconnected", () => this.emit("done"));

    const page = await this._instance.newPage();
    await page.goto(`${url}?id=${this.id}`);
  }

  isCaptured() {
    return true;
  }
}

function ChromiumBrowser() {
  return new PlaywrightBrowser(chromium);
}

function FirefoxBrowser() {
  return new PlaywrightBrowser(firefox);
}

function WebKitBrowser() {
  return new PlaywrightBrowser(webkit);
}

module.exports = {
  "launcher:Chromium": ["type", ChromiumBrowser],
  "launcher:Firefox": ["type", FirefoxBrowser],
  "launcher:WebKit": ["type", WebKitBrowser],
};

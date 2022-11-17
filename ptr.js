//TODO: Daily like limit is 200. There should be a counter UPDATE: Probably it's not daily limit. Maybe hour limit
const puppeteer = require('puppeteer');
const readline = require('readline');
const path = require('path')
const dotenv = require('dotenv').config().parsed;
dotenv.ENV = dotenv.ENV ? dotenv.ENV : "prod";

_CONFIG = { 
	platform: process.platform,
	isMac: process.platform === "darwin"
};
if(dotenv.ENV === 'dev') {
	_CONFIG.env           = 'dev';
	_CONFIG.isDev         = true;
	_CONFIG.adBlockPath   = path.resolve('./lib/uBlock0.chromium');
	_CONFIG.chromeExePath = path.join(__dirname, './lib/chrome-win/chrome.exe');
} else if(dotenv.ENV === 'prod') {
	_CONFIG.env           = 'prod';
	_CONFIG.isDev         = false;
	_CONFIG.adBlockPath   = 'C:\\zWWW\\000 - Patryk Chowratowicz\\behancelikebot\\lib\\uBlock0.chromium';
	_CONFIG.chromeExePath = 'C:\\zWWW\\000 - Patryk Chowratowicz\\behancelikebot\\lib\\chrome-win\\chrome.exe';
}

let browser;

async function readLine(msg) {
	const rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout
	});
	return new Promise(resolve => {
		rl.question(msg, (answer) => {
		  rl.close();
		  resolve(answer)
		});
	})
}
module.exports.runBrowser = async function runBrowser(){
	const args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certifcate-errors',
        '--ignore-certifcate-errors-spki-list',
        '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
		'--disable-extensions-except='+_CONFIG.adBlockPath,
		'--load-extension='+_CONFIG.adBlockPath,
    ];
    const options = {
        args,
        headless: false,
        ignoreHTTPSErrors: true,
		executablePath: 'C:\\zWWW\\000 - Patryk Chowratowicz\\behancelikebot\\lib\\chrome-win\\chrome.exe',
        //userDataDir: './tmp'
    };
	browser = await puppeteer.launch(options);
}
module.exports.closeBrowser = async function closeBrowser(){
	if(browser){
		await browser.close();
	}
}

/* (async () => { //main
	
	async function toLoginPage(){
		await page.click('button.Btn-tertiary-Z8Q.js-adobeid-signin');
		await page.waitForTimeout(10000);
	}
	
	async function login(){
		await page.type('input[type=email]', dotenv.EMAIL);
		await page.waitForTimeout(2000);
		await page.click('button[data-id="EmailPage-ContinueButton"]');
		await page.waitForTimeout(4000);
	
		const captcha = await readLine('Enter auth SMS code: ');
		for(i=0;i<6;i++){
			await page.keyboard.press(captcha[i], {delay: 50});
			await page.waitForTimeout(50);
		}
		await page.waitForTimeout(3950);
	
		await page.type('input[type=password]', dotenv.PASS, {delay: 321});
		await page.waitForTimeout(250);
		await page.click('button[aria-label="Kontynuuj"]');
		await page.waitForTimeout(10000);
	}
	
	async function likeNewPosts(){
		await page.waitForTimeout(2000);
		await page.goto('https://www.behance.net/search/projects?tracking_source=typeahead_nav_suggestion&search=social+media&sort=published_date', );
		await page.waitForTimeout(12000);
		await page.click('a[title="Łącze do projektu"]');
		await page.waitForTimeout(2000);

		for(i=0; i<1000;i++){
			let likeBtn = await page.$('.Appreciate-wrapper-REw.Project-appreciateTopSidebarIcon-_E7');
			let LikedBtn = !(await page.$('.Appreciate-wrapper-REw.Project-appreciateTopSidebarIcon-_E7:not(.Appreciate-appreciated-OT4)'));
			//TODO: bug if give like should also use arrowRight. Maybe it need 6s
			if( likeBtn && LikedBtn ){
				await page.keyboard.press('ArrowRight');
				console.log('Project not liked \t\t -');
			}
			else if(likeBtn && !LikedBtn){
				await page.click('.Appreciate-wrapper-REw.Project-appreciateTopSidebarIcon-_E7:not(.Appreciate-appreciated-OT4)')
				console.log('Project liked \t\t +');
				await page.keyboard.press('ArrowRight', {delay: 700});
			}
			await page.waitForTimeout(6000);
		}
		await page.waitForTimeout(40000);
	
	}

	const args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certifcate-errors',
        '--ignore-certifcate-errors-spki-list',
        '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
		'--disable-extensions-except='+_CONFIG.adBlockPath,
		'--load-extension='+_CONFIG.adBlockPath,
    ];
    const options = {
        args,
        headless: false,
        ignoreHTTPSErrors: true,
        //userDataDir: './tmp'
    };
	const browser = await puppeteer.launch(options);
	const page = await browser.newPage();

	const preloadFile = fs.readFileSync('./ptr-preload.js', 'utf8');
    await page.evaluateOnNewDocument(preloadFile);
	await page.setViewport({ width: 1500, height: 750 })
	await page.goto('https://www.behance.net/');
	await page.waitForTimeout(12000);
	const isUserLoggedOut = await page.$('body.logged-out');
	if(isUserLoggedOut){
		await toLoginPage(page);
		await login(page);
	}

	await likeNewPosts(page);
		
	await browser.close();
})(); */
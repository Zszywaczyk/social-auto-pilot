//TODO: Daily like limit is 200. There should be a counter UPDATE: Probably it's not daily limit. Maybe hour limit
const puppeteer = require('puppeteer');
const fs = require('fs');
const readline = require('readline');
const path = require('path')
const dotenv = require('dotenv').config().parsed;

//const adBlockPath = 'C:\\Users\\Zszywacz\\Downloads\\uBlock0.chromium';
const adBlockPath = path.resolve('.\\uBlock0.chromium');

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

(async () => { //main
	
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
		'--disable-extensions-except='+adBlockPath,
		'--load-extension='+adBlockPath,
    ];
    const options = {
        args,
        headless: false,
        ignoreHTTPSErrors: true,
        //userDataDir: './tmp'
    };
	const browser = await puppeteer.launch(options);
	const page = await browser.newPage();

	const preloadFile = fs.readFileSync('./preload.js', 'utf8');
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
})();
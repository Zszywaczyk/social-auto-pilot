const { app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
//const ptr = require('./ptr.js');
let dotenv = require('dotenv').config().parsed;
const puppeteer = require('puppeteer-core');


dotenv.ENV = dotenv.ENV === 'dev' ? 'dev' : "prod";

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
	_CONFIG.adBlockPath   = './lib\\lib\\uBlock0.chromium';
	_CONFIG.chromeExePath = './lib\\lib\\chrome-win\\chrome.exe';
}

function createMainWindow(){
	const mainWindow = new BrowserWindow({
		title: "SocialAutoPilot",
		width: _CONFIG.isDev ? 1000 : 500,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, './renderer/preload.js'),
			nodeIntegration: true,
  			contextIsolation: false,
  			enableRemoteModule: true
		},
	});
	mainWindow.setMenu(null)

	if(_CONFIG.isDev){
		mainWindow.webContents.openDevTools();
	}

	mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}
app.whenReady().then( () => {
	createMainWindow();
	//ptr.runBrowser();
})

app.on('window-all-closed', ()=>{
	if( ! _CONFIG.isMac ){
		app.quit();
	}
})

async function newGrabBrowser({ url }) {
	const browser = await puppeteer.launch({
	  headless: false,
	  executablePath: _CONFIG.chromeExePath, 
	  args: ["--no-sandbox"],
	});
	const page = await browser.newPage();
	page.goto(url);
}


ipcMain.on('grab', (event, props) => {
	newGrabBrowser(JSON.parse(props));
});
ipcMain.on('path', (event, props) => {
	event.sender.send('asynchronous-reply', _CONFIG.chromeExePath)
});
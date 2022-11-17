const { ipcRenderer } = require('electron');
//const bootstrap = require('bootstrap');
const openChrome = document.getElementById("openChrome");
const ptr = require('../ptr');
openChrome.addEventListener('click', ()=>{
	//const xyz = ipcRenderer.send('grab',JSON.stringify({url: 'https://www.google.com'}));
	console.log('hello world')
	const xyz = ptr.runBrowser();
	console.log(xyz);
});

ipcRenderer.send('path', JSON.stringify({}));
ipcRenderer.on('asynchronous-reply', (event, arg) => {
	console.log(arg);
})
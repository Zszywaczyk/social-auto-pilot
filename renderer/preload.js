/* const { contextBridge } = require('electron')
//const ptr = require('../ptr.js')

const { ipcRenderer } = require('electron');
const openChrome = document.getElementById("openChrome");
openChrome.addEventListener('click', ()=>{
	ipcRenderer.send('grab',JSON.stringify({url: 'https://www.google.com'}));
});

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions
}) */
/* contextBridge.exposeInMainWorld('ptr', {
  runPtr: () => runPtr(),
}); */
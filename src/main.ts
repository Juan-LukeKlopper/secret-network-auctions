import App from './App.svelte';
import {
	gripApp,
	getKeplrAccountProvider
} from '@stakeordie/griptape.js';
  
const restUrl = 'https://api.pulsar.griptapejs.com';
const provider = getKeplrAccountProvider();
let app
function runApp() {
	app = new App({
		target: document.getElementById('app')
	  })
};

gripApp(restUrl, provider, runApp);

export default app

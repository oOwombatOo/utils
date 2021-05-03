
async function waitFor (milliseconds) {
	return new Promise (
		function promiseToWait (resolve, reject) {
			window.setTimeout(resolve, milliseconds);
		}
	);
}



function promiseToLoadDocument (documentUrl) {

	async function toLoadDocument (resolve, reject) {

		const httpRequest = new XMLHttpRequest ();
		
		httpRequest.onreadystatechange = function loadDocument () {
			if (this.readyState == 4) {
				
				if (this.status == 200) {
					resolve(this.responseText);
				}

				if (this.status == 404) {
					resolve(null);
					console.warn("404 on promiseToLoadDocument - " + documentUrl);
				}
			}		

		};

		httpRequest.open("GET", documentUrl, true);
		httpRequest.send();
	}

	return new Promise(toLoadDocument);
}


export {
	promiseToLoadDocument,
	waitFor,
};

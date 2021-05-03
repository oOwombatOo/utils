


function sendGoogleAnalyticsEvent ( eventName, eventCategory, eventLabel, eventValue ) {

	if (window.gtag) {
		window.gtag(
			'event', eventName, {
				'event_category': eventCategory,
		  		'event_label': eventLabel,
			  	'value': eventValue, 
			});
	}
	else {
		console.log("\nGoogle Analytics Event (not sent due to localhost)");
		console.log({ eventName, eventCategory, eventLabel, eventValue });
	}

}


export {
	sendGoogleAnalyticsEvent,
};


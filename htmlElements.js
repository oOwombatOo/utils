const SHOW_HIDE_ANIM_NO_ANIM = "none";
const SHOW_HIDE_ANIM_FADE  = "fade";
const SHOW_HIDE_TYPE_SHOW  = "show";
const SHOW_HIDE_TYPE_HIDE  = "hide";
const SPEED_OPACITY = 0.02;
const SPEED_WIDTH   = 2;
const MS_FOR_LONG_PRESS = 300;

let longPressElementsCount = 0;

const longPressFunctionsByElementId = new Map();

const animArrays = {
	showing : [],
	hiding : []
};


/** For some reason, I have to wait about five or ten seconds on Firefox and then this will work
    at a normal speed. **/
function promiseToCreateDataImage (url) {

		return new Promise( function( resolve, reject) {

			var xhr = new XMLHttpRequest();

			xhr.onload = function(xhrResult) {
				var reader = new FileReader();
	
				if (xhrResult.total === 0) {
					reject("Image not found at URL: " + url);
				}
				else {
					reader.onloadend = function() {
						const imgEl = document.createElement("img");
						imgEl.src = reader.result;
						resolve(imgEl);
					};

					reader.readAsDataURL(xhr.response);
				}
			};

			xhr.open('GET', url);
			xhr.responseType = 'blob';
			xhr.send();
	});
}


function addLongPressFunctionality (element, func) {

	let longPressTimer;
	const hasLongPress = element.dataset.longPressId && element.dataset.longPressId.length > 0;

	if (!hasLongPress) {
		const newLongPressId = "long-press-id-" + longPressElementsCount++;
		element.dataset.longPressId = newLongPressId;
		longPressFunctionsByElementId.set(newLongPressId, []);
		element.addEventListener("mousedown",	startLongPressTimer);
		element.addEventListener("mouseup",		() => { window.clearTimeout(longPressTimer); } );
		element.addEventListener("touchstart",	startLongPressTimer);
		element.addEventListener("touchend",		() => { window.clearTimeout(longPressTimer); } );
		element.addEventListener("touchcancel",		() => { window.clearTimeout(longPressTimer); } );
	}

	const longPressId	  = element.dataset.longPressId;
	const longPressFunctions = longPressFunctionsByElementId.get(longPressId);

	longPressFunctions.push(func);

	function startLongPressTimer () {

		longPressTimer = window.setTimeout(
			function fireLongPressEvents () {
				const longPressFunctions1 = longPressFunctionsByElementId.get(longPressId);
				for (const longPressFunction of longPressFunctions1) {
					longPressFunction();
				}
				element.blur();
			},
			MS_FOR_LONG_PRESS
		);

	}
}


function fireEventOn (element, eventTypeStr) {
		if ("createEvent" in document) {
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent(eventTypeStr, false, true);
			element.dispatchEvent(evt);
		}	
		else {
			const onEventStr = "on" + eventTypeStr;
			element.fireEvent(onEventStr);

			if (typeof element[onEventStr] === "function") {
				element[onEventStr]();
			}
		}
}



function countEnabledOptionsInSelect (selectHTMLElement) {
	const optionsArray = Array.from(selectHTMLElement.querySelectorAll("option"));

	let enabledOptions = 0;

	for (const optionHTMLElement of optionsArray) {
		if (optionHTMLElement.disabled !== true) {
			enabledOptions++;
		}
	}

	return enabledOptions;
}


function createHTMLElementFromHTMLString (htmlString) {
	const wrapperDiv = document.createElement("div");
	wrapperDiv.innerHTML = htmlString;
	return wrapperDiv.children.length > 1 ? wrapperDiv.children : wrapperDiv.children[0];
}


function isHidden (element) {
	return (element.offsetParent === null ||
		    element.classList.contains("hidden"));
}


function isVisible (element) {
	return !isHidden(element);
}

/**
	@param {HTMLElement} element
	@param {string} [animationType="none"]
	@param {string} [showOrHide="show"]
	@returns {Promise}
*/
function promiseToShowOrHide (element, animationType = SHOW_HIDE_ANIM_NO_ANIM, showOrHide = SHOW_HIDE_TYPE_SHOW) {

	return new Promise( 
		(resolve, reject) =>  {
			
			if (animationType === SHOW_HIDE_ANIM_FADE) {
				promiseToFadeShowOrHide(element, showOrHide).then(resolve);
			}
			else {
				promiseToPlainShowOrHide(element, showOrHide).then(resolve);
			}
		}
	);
}

/**
	@param {HTMLElement} element
	@param {String} showOrHide
	@returns {Promise}
*/
async function promiseToPlainShowOrHide (element, showOrHide) {
	if (showOrHide === SHOW_HIDE_TYPE_HIDE) {
		element.style.opacity = 0;
		element.style.display = "none";
	}
	else {
		element.style.opacity = 1;
		element.style.display = "";
	}
}

/**
	@param {HTMLElement} element
	@param {String} showOrHide
	@returns {Promise}
*/
function promiseToFadeShowOrHide (element, showOrHide) {

	return new Promise(
		(resolve, reject) => {

	const dirMod = (showOrHide === SHOW_HIDE_TYPE_SHOW ? 1 : -1);
			const targetOpacity = (showOrHide === SHOW_HIDE_TYPE_SHOW ? 1 : 0);
			const animArrayKey = (showOrHide === SHOW_HIDE_TYPE_SHOW ? "showing" : "hiding");

			removeElFromAnimArrays(element);
			element.style.display = "";
			animArrays[animArrayKey].push(element);
			window.requestAnimationFrame(step);

			function step () {
				const elOpacity = Number.parseFloat(window.getComputedStyle(element).opacity);
				const newOpacity = elOpacity + (SPEED_OPACITY * dirMod);

				if (!animArrays[animArrayKey].includes(element)) {
					reject();
					return;
				}

				element.style.opacity = newOpacity;

				if (elOpacity <= 0 && showOrHide === SHOW_HIDE_TYPE_HIDE ||
					elOpacity >= 1 && showOrHide === SHOW_HIDE_TYPE_SHOW) {

					element.style.opacity = targetOpacity;
					resolve();

				}
				else {
					window.requestAnimationFrame(step);
				}
			}

	});
}


function removeElFromAnimArrays (element) {
	animArrays.showing = animArrays.showing.filter( (el) => { return el !== element; });
	animArrays.hiding = animArrays.hiding.filter( (el) => { return el !== element; });
}


/**
	@param {HTMLElement} element
	@param {String} animationType
	@returns {Promise}
*/
function promiseToHide (element, animationType) {
	return promiseToShowOrHide(element, animationType, SHOW_HIDE_TYPE_HIDE);
}

/**
	@param {HTMLElement} element
	@param {String} animationType
	@returns {Promise}
*/
function promiseToShow (element, animationType) {
	return promiseToShowOrHide(element, animationType, SHOW_HIDE_TYPE_SHOW);
}

/**
	@param {HTMLElement} element
	@param {String} animationType
	@returns {Promise}
*/
function promiseToFadeHide (element) {
	return promiseToShowOrHide(element, SHOW_HIDE_ANIM_FADE, SHOW_HIDE_TYPE_HIDE);
}

/**
	@param {HTMLElement} element
	@param {String} animationType
	@returns {Promise}
*/
function promiseToFadeShow (element) {
	return promiseToShowOrHide(element, SHOW_HIDE_ANIM_FADE, SHOW_HIDE_TYPE_SHOW);
}

export {
	promiseToShow,
	promiseToHide,
	promiseToFadeShow,
	promiseToFadeHide,
	isHidden,
	isVisible,
	createHTMLElementFromHTMLString,
	fireEventOn,
	countEnabledOptionsInSelect,
	addLongPressFunctionality,
	promiseToCreateDataImage,
};

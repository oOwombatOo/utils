import { promiseToHide, promiseToFadeHide, promiseToFadeShow } from "./../htmlElements";
import { isMobile } from "./../mobileCheck";
import styleSheetStr from "./simpleOverlayCss";
import { sendGoogleAnalyticsEvent } from "./../googleAnalytics";

const CONTENT_CLASS = "imagesOverlay__div--content";
const BUTTON_CLASS = "imagesOverlay__button--close";
const OVERLAY_CLASS = "imagesOverlay";
const OVERLAY_HIDDEN_CLASS = "imagesOverlay--hidden";

/**
	This will create the base functionality for a very simple overlay. It takes the
	query selector string, and adds an on-click event to each element selected. When
	clicked, the element's innerHTML will be copied to a div (class "imagesOverlay")
	appended to the body of the document. That div also includes a "close" button that
	toggles the class "imagesOverlay--hidden" on the div. The CSS to make this work
	as expected needs to be created seperately but should be pretty obvious.
	@param {String} overlayableElsSelectorStr
**/
async function createSimpleOverlay (overlayableElsSelectorStr) {
	const overlayableEls = document.querySelectorAll(overlayableElsSelectorStr);

	// Hide it at on creation
	getImagesOverlayEl().classList.toggle(OVERLAY_HIDDEN_CLASS);
	promiseToHide(getImagesOverlayEl());

	overlayableEls.forEach( 
		function addClickAbilityToOverlay (overlayEl) {
			overlayEl.style.cursor = "pointer";
			overlayEl.addEventListener("click", () => { displayEl(overlayEl); });
		}
	);
}

function displayEl (el) {

	const imageUrl = el.querySelector("img").src;

	if (isMobile()) {
		window.open(imageUrl, "_blank").focus();
	}
	else {
		const scrollPositionPx = window.pageYOffset + "px";

		getImagesOverlayEl().classList.toggle(OVERLAY_HIDDEN_CLASS);
		getContentContainer().innerHTML = el.innerHTML;
		getContentContainer().style.top = scrollPositionPx;
		promiseToFadeShow(getImagesOverlayEl());
	}

	sendGoogleAnalyticsEvent("image-gallery", "user-interaction", "expanded", imageUrl);
}

function getImagesOverlayEl () {
	if (!document.imagesOverlayDiv) {
		const overlay = document.imagesOverlayDiv = document.createElement("div");
		const button = document.createElement("button");
		const contentContainer = document.createElement("div");
		const styleEl = document.createElement("style");

		styleEl.innerHTML = styleSheetStr;
		document.head.append(styleEl);
		document.body.append(overlay);
		button.innerText = "close";
		button.className = BUTTON_CLASS;
		overlay.className = OVERLAY_CLASS;
		contentContainer.className = CONTENT_CLASS;
		overlay.append(button);
		overlay.append(contentContainer);
		button.addEventListener("click", onCloseOverlay);
	}

	return document.imagesOverlayDiv;
}

function getContentContainer () {
	return getImagesOverlayEl().querySelector(`div.${CONTENT_CLASS}`);
}

function onCloseOverlay () {
	promiseToFadeHide(getImagesOverlayEl()).
		then( ()=> { 
				getImagesOverlayEl().classList.toggle(OVERLAY_HIDDEN_CLASS); 
				getContentContainer().innerHTML = "";
			} );
}

export default createSimpleOverlay;

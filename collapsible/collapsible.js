import collapsibleCss from "./collapsibleCss.js";
import {
	promiseToFadeShow,
	promiseToFadeHide,
} from "./../htmlElements";
import { sendGoogleAnalyticsEvent } from "./../googleAnalytics";

const CLASS_BUTTON = "collapsible__button";
const CLASS_BUTTON_COLLAPSE = "collapsible__button--collapse";
const CLASS_BUTTON_TOP = "collapsible__button--top";
const CLASS_CONTENT  = "collapsible__content";
const CLASS_COLLAPSIBLE  = "collapsible";
const CLASS_COLLAPSED = "collapsed";
const COLLAPSE_SPEED = 30;
const BUTTON_TEXT_COLLAPSE = "- collapse";
const BUTTON_TEXT_EXPAND = "+ expand";

const styleEl = document.createElement("style");
styleEl.innerHTML = collapsibleCss;
document.head.append(styleEl);

/**
	This hacky stuff is to ensure all images and content is loaded. I can't figure
	out why but weird shit is happening, probably due to WordPress doing something
	bizarre.
	edit: figured it out: fonts
**/
function promiseToWaitUntilLoaded (el) {
	return new Promise( (resolve, reject) => {
		document.fonts.ready.then( function () {
			resolve();
		});
	});
}

/**
	@param {HTMLElement} el
	@param [String] className - A string to append to the root containers classes
	@return {HTMLElement} - The collapsible outer container
*/	
function makeElementCollapsible (el, className = "") {
	const heading = el.querySelector("h1, h2, h3, h4, h5, h6, label, p");
	const collapsibleContent = document.createElement("div");
	const collapsibleInnerContainer = document.createElement("div");
	const collapsibleOuterContainer = document.createElement("div");
	const topButton = document.createElement("button");

	el.parentNode.insertBefore(collapsibleOuterContainer, el);
	collapsibleOuterContainer.append(heading);
	collapsibleOuterContainer.append(collapsibleInnerContainer);
	collapsibleInnerContainer.append(collapsibleContent);
	collapsibleContent.append(el);
	heading.append(topButton);

	topButton.innerText = BUTTON_TEXT_EXPAND;
	topButton.className = `${CLASS_BUTTON} ${CLASS_BUTTON_TOP}`;  
	collapsibleOuterContainer.className = (`${CLASS_COLLAPSIBLE} ${CLASS_COLLAPSIBLE}--outer ${CLASS_COLLAPSED} `) + className;
	collapsibleInnerContainer.className = (`${CLASS_COLLAPSIBLE} ${CLASS_COLLAPSIBLE}--inner`);
	collapsibleContent.classList.add(CLASS_CONTENT);

	topButton.display = "none";
	topButton.disabled = true;
	topButton.addEventListener("click", promiseToToggleCollapsible);
	el.style.display = "none";

	handleFilteredClassOn(el);

	promiseToWaitUntilLoaded(el).then( () => {
		el.style.display = "";
		collapsibleContent.originalHeight = getInnerContainerHeightInt();
		collapsibleContent.style.marginTop = -(getInnerContainerHeightInt()) + "px";
		topButton.disabled = false;
		topButton.displayed = "";
	});

	function getContentMarginTopInt () {
		return Number.parseInt(window.getComputedStyle(collapsibleContent).marginTop.replace("px", ""));
	}

	function getInnerContainerHeightInt () {
		return Number.parseInt(collapsibleInnerContainer.getBoundingClientRect().height);
	}

	function promiseToToggleCollapsible ( event ) {

		if (event) {
			event.preventDefault();
		}

		const height = getInnerContainerHeightInt();
		const marginTop = getContentMarginTopInt();
		const directionMod = marginTop < 0  ? 1 : -1;
		const isExpanding = (directionMod > 0);
		const targetMargin = (isExpanding ? 0 : -height);
		let breakFuse = 0;

		topButton.innerText = (directionMod > 0 ? BUTTON_TEXT_COLLAPSE : BUTTON_TEXT_EXPAND);
		topButton.disabled = true;

		if (isExpanding) {
			collapsibleOuterContainer.classList.remove(CLASS_COLLAPSED);
			sendGoogleAnalyticsEvent("collapsible", "user-interaction", "expanded", heading.innerText);
		}

		return new Promise ( (resolve, reject) => {

			function collapseStep () {
				collapsibleContent.style.marginTop = getContentMarginTopInt() +  COLLAPSE_SPEED * directionMod + "px";
				const newMarginTop = getContentMarginTopInt(); 
				const hasFinished = (isExpanding ? (newMarginTop > targetMargin) : (newMarginTop < targetMargin));
				collapsibleContent.style.opacity =  1 - (Math.abs(newMarginTop) / collapsibleContent.originalHeight);

				if (hasFinished) {
					collapsibleContent.style.marginTop = targetMargin + "px";
					collapsibleContent.style.opacity = 1;
					topButton.disabled = false;
					
					if (!isExpanding) {
						collapsibleOuterContainer.classList.add(CLASS_COLLAPSED);
					}

					resolve();
				}
				else if (breakFuse++ > 1000) {
					reject();
					throw ("Collapsible is doing weird shit");
				}
				else {
					window.requestAnimationFrame(collapseStep);
				}
			}

			window.requestAnimationFrame(collapseStep);
		});
	}



	/**
		If the class "filtered" is added or removed from the element, we want to show/hide
		it. This could happen when filtering out elements in a list, for example.
	*/
	function handleFilteredClassOn (element) {

		if (element.classList.contains("filtered")) {
				collapsibleOuterContainer.style.display = "none";
		}

		const observer = new MutationObserver(
			function onMutation (mutations) {
				mutations.forEach(
					function checkMutation (mutationRecord) {
						const isFiltered = mutationRecord.target.classList.contains("filtered");
						if (isFiltered) {
							if (topButton.innerText === BUTTON_TEXT_COLLAPSE) {
								promiseToToggleCollapsible();
							}
							promiseToFadeHide(collapsibleOuterContainer).then(
								() => { collapsibleOuterContainer.style.display = "none"; }
							);
						}
						else {
							promiseToFadeShow(collapsibleOuterContainer).then(
								() => { collapsibleOuterContainer.style.display = ""; }
							);
						}
					});    
			}
		);
		const thingToObserve = { attributes : true, attributeFilter : ['class'] };

		observer.observe(element, thingToObserve );
	}

	return collapsibleOuterContainer;
}



/**
	This will add simple functionality to allow the elements 
	selected by the given query selector to be TOPable and
	collapsible. 
	@param {String} querySelectorStr
*/
function makeElementsCollapsible (querySelectorStr) {
	const collapsibleEls = document.querySelectorAll(querySelectorStr);
	collapsibleEls.forEach(makeElementCollapsible);
}


export {
	makeElementsCollapsible,
	makeElementCollapsible,
};

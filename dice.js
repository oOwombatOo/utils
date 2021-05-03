import { matchIsFound } from "./strings";
import { fireEventOn, addLongPressFunctionality } from "./htmlElements";
import { isANumber } from "./numbers";

function getMaximumRollFor (diceString) {
	const diceCount = getDiceCountFor(diceString);
	const diceType  = getDiceTypeFor(diceString);
	const maxRoll	= diceCount * diceType;
	return isANumber(maxRoll) ? maxRoll : 0;
}

function getMinimumRollFor (diceString) {
	return getDiceCountFor(diceString);
}

/**
	Given a dice string (e.g. "3d6"), return the number of dice used (e.g. 3)
	@returns Number
*/
function getDiceCountFor (diceString) {
	return Number.parseInt(String(diceString).trim());
}

/**
	Given a dice string (e.g. "3d6"), return the type of dice used (e.g. 6)
	@returns Number
*/
function getDiceTypeFor (diceString) {
	const countAndDRegEx = new RegExp(/.*d/g);
	return Number.parseInt(String(diceString).toLowerCase().replace(countAndDRegEx, ""));
}

function getRandomValueFor (diceString) {
	const minValue = getMinimumRollFor(diceString);
	const maxValue = getMaximumRollFor(diceString);
	const range	   = maxValue - minValue;
	const random   = Math.floor(Math.random() * (range + 1)) + minValue;

	return random;
}

function isDiceRollTypeInput (inputEl) {
	const diceType = inputEl.dataset && inputEl.dataset.diceType;
	return diceType && diceType.length > 0;
}

function setDiceRollTypeForInput (inputEl, diceTypeString) {
	const isAlreadyADiceType = isDiceRollTypeInput(inputEl);
	const defaultValue = inputEl.dataset.defaultValue;
	const hasALegitDefault = isANumber(defaultValue);
	const diceStringHasChanged = inputEl.dataset.diceType !== diceTypeString;
	const hasALegitValue = isANumber(inputEl.value) &&
						   inputEl.value < getMaximumRollFor(diceTypeString) &&
						   inputEl.value > getMinimumRollFor(diceTypeString);
	
	diceTypeString = diceTypeString === undefined ? "" : diceTypeString;


	if (!isAlreadyADiceType) {
		addDiceRollListenersToInput(inputEl);
		inputEl.classList.add("diceRoll");
		inputEl.dataset.diceType = diceTypeString;
		inputEl.placeholder = diceTypeString;
	}
	
	if (diceStringHasChanged) {
		inputEl.dataset.diceType = diceTypeString;
		inputEl.placeholder = diceTypeString;
		inputEl.value = "";
		fireEventOn(inputEl, "change");
		fireEventOn(inputEl, "blur");
	}
	
	if (!hasALegitValue && hasALegitDefault) {
		inputEl.value = defaultValue;
		fireEventOn(inputEl, "change");
		fireEventOn(inputEl, "blur");
	}
}

function addDiceRollListenersToInput (inputEl) {

	addLongPressFunctionality(inputEl, () => { enterRandomValue(true); } ); 
	inputEl.addEventListener("keyup", enterRandomValue);
	inputEl.addEventListener("mousedown", handleMouseClickOnDiceInput);
	inputEl.addEventListener("contextmenu", (event) => { event.preventDefault(); } );

	const diceTypeString = inputEl.dataset.diceType;
	inputEl.classList.add("diceRoll");
	inputEl.placeholder = diceTypeString;


	function handleMouseClickOnDiceInput (eventData) {
		if (eventData.button === 2) {
			eventData.preventDefault();
			const isMouseClick = true;
			enterRandomValue(isMouseClick);
			inputEl.focus();
			inputEl.blur();
		}
		else {
			clearInputForEntry();
		}
	}


	function enterRandomValue (isTriggeredByRightMouseClick = false) {
		const diceTypeString 	  = inputEl.dataset.diceType;
		const isLastThingEnteredR = matchIsFound(inputEl.value, /r$/);

		// that explicit boolean check is required, as otherwise it will be a truthy
		// keyboard event.
		if (isLastThingEnteredR || isTriggeredByRightMouseClick === true) {
			inputEl.value = getRandomValueFor(diceTypeString);
			fireEventOn(inputEl, "change");
		}
	}


	function clearInputForEntry () {
		inputEl.value = "";
		fireEventOn(inputEl, "change");
		fireEventOn(inputEl, "blur");
	}
}

export {
	getMinimumRollFor,
	getMaximumRollFor,
	setDiceRollTypeForInput,
	getDiceTypeFor,
	getDiceCountFor,
};

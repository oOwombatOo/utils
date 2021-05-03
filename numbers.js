import { 
	matchIsFound,
	getFirstMatch,
} from "./strings";

function generateRandomNumber (minimum=0, maximum=100, decimalPrecision=0) {

	let randomNumber = (Math.random() * (maximum - minimum)) + minimum;

	if (decimalPrecision > 0) {
		const factor = Math.pow(10, decimalPrecision);
		randomNumber = Math.round(randomNumber * factor) / factor;
	}

	if (decimalPrecision === 0) {
		randomNumber = Math.round(randomNumber);
	}

	return randomNumber;
}



function isANumber (variable) {
	return variable !== "" && !isNaN(variable) && !Number.isNaN(variable);
}



// Convert any numbers into JS numbers instead of strings, for ease of future use.
// This function can handle both single values and arrays of key, value arrays (recursively).
// If the provided object cannot be converted to a number it is returned unchanged.
function parseToPrimitiveNumbers (value) {

	if (Array.isArray(value)) {
		for (let i = 0; i < value.length; i++) {
			value[i] = parseToPrimitiveNumbers(value[i]);
		}
	} else {
		if (isANumber(value)) {
			const float = Number.parseFloat(value);
			value = Number.isInteger(float) ? Number.parseInt(float) : float;	
		}
	}

	return value;
}



/** Returns a string representation of value, rounded to decimalPlaceCount number of places,
	where each incremental step is decimalStep. For example 1.128 rounded to 2 decimal places
	with a decimalStep of 0.5 will be 1.15.

	Sorry to my future self about the code here, I figured it out as a I went along. */
function getDecimalNumbersString (valueParam, decimalPlaceCount = 2, decimalStep = 0.05) {
	const value				= Number.parseFloat(valueParam);
	const decimalRegEx		= new RegExp('\.[0-9]*$', 'g');
	const decimalSection	= Number.parseInt(getFirstMatch(String(value), decimalRegEx).replace(".", ""));

	
	//console.log("----------------");
	//console.log(value, "   dec:", decimalSection);
	//console.log("decimalStep:", decimalStep);
	//console.log("decimalPlaceCount:", decimalPlaceCount);

	if (decimalPlaceCount === 0) {
		return Math.round(value);
	}
	

	// Round the decimal section at the point where we want it
	const p = String(decimalSection).length - decimalPlaceCount;
	const a = decimalSection / (Math.pow(10, p));
	const roundedDecimal = Math.round(a);
	//console.log("roundedDecimal", roundedDecimal, a);


	// Rounding the value to decimal step
	decimalStep = (decimalStep === 0) ? "1.0" : String(Number.parseFloat(decimalStep));
	const zerosInDecStepMatch = getFirstMatch(decimalStep, /\.0*/);
	const zerosInDecStep = (zerosInDecStepMatch === null) ? 0 : zerosInDecStepMatch.length - 1;
	const divisor = Math.pow(10, zerosInDecStep + 1);
	const d = (roundedDecimal / divisor ) / decimalStep;
	const steppedDecimal = Math.round(d) * decimalStep;
	//console.log(zerosInDecStep, divisor, d, steppedDecimal);
	
	//console.log("steppedDecimal:", steppedDecimal);

	// Putting it together again
	const addDecimals 	   = decimalPlaceCount > 0;
	const finishedDecimals = String(Math.floor(value) + steppedDecimal);
	const finished		   = addDecimals ? finishedDecimals : String(Math.floor(value));

	// This removes computing rounding errors that can result in an enourmous decimal string like .00000000000000001
	const regex = new RegExp("^\\d*\\.\\d{" + decimalPlaceCount + "}");
	const fixedStr = String(finished).match(regex) ? String(finished).match(regex)[0] : finished;
	const properFinished = decimalPlaceCount > 0 ? fixedStr : finished;

	//console.log("finished:", finished);
	return properFinished;
}



export { 
	generateRandomNumber, 
	isANumber, 
	parseToPrimitiveNumbers,
	parseToPrimitiveNumbers as parseToPrimitiveNumber,
	getDecimalNumbersString,
};


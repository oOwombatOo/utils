import { isANumber } from "./numbers";

function getFirstMatch (string, regEx) {
	const stringIsNull	= string === null;

	string = String(string);

	const matchArray 	= stringIsNull ? [] : string.match(regEx);
	const matchIsValid 	= !stringIsNull && matchArray && matchArray.length > 0 && matchArray[0].length > 0;
	const firstMatch	= matchIsValid ? matchArray[0] : null;

	if (string === null) {
		console.warn("WARNING: null string provided to getFirstMatch");   // eslint-disable-line no-console
	}
	
	return firstMatch;
}



// For readability, returns only true or false.
function matchIsFound (string, regEx) {
	return (getFirstMatch(string, regEx) !== null);
}



// Convert any numbers into JS numbers instead of strings, for ease of future use.
// This function can handle both single values and arrays of key, value arrays (recursively).
// If the provided object cannot be converted to a number it is returned unchanged.
function convertStringsToPrimitiveNumbers (value) {

	if (Array.isArray(value)) {
		for (let i = 0; i < value.length; i++) {
			value[i] = convertStringsToPrimitiveNumbers(value[i]);
		}
	} else {
		if (isANumber(value)) {
			const float = Number.parseFloat(value);
			value = Number.isInteger(float) ? Number.parseInt(float) : float;	
		}
	}

	return value;
}

// Convert strings to JS primitives (e.g. null, undefined, boolean, numbers)
// This function can handle both single values and arrays of key,value arrays (recursively).
function convertStringsToPrimitiveTypes (value) {
	if (Array.isArray(value)) {
		const newArray = Array.from(value);
		for (let i = 0; i < value.length; i++) {
			newArray[i] = convertStringsToPrimitiveTypes(value[i]);
		}
		return newArray;
	} else {
		value = convertStringsToPrimitiveNumbers(value);
		value = (value === "true") ? true : value;
		value = (value === "false") ? false : value;
		value = (value === "null") ? null : value;
		value = (value === "undefined") ? undefined : value;
		return value;
	}
}



/**
	Converts any string, including a camel-case string (e.g. myVariableName) to an upper case, underscored-spaced
	string typical for use with constant variables (e.g. MY_VARIABLE_NAME).
**/
function formatAsConstant (string) {
	
	if (!string) {
		return null;
	}

	const camelCapMatch = /[a-z0-9][A-Z]/;
	const capitalMatch	= /[A-Z]/;
	let newString 		= String(string).replace(/\W/g, "_");

	
	while (matchIsFound(newString, camelCapMatch)) {
		const camelCap		= getFirstMatch(newString, camelCapMatch);
		const capital		= getFirstMatch(camelCap, capitalMatch);
		const underScored	= camelCap.replace(capital, "_"+capital);
		newString = newString.replace(camelCap, underScored);
	}

	newString = newString.replace(/[,-]/g, "_");
	newString = newString.replace("\"", "");
	newString = newString.replace("\'", "");
	
	return newString.toUpperCase().replace(/_+/, "_");
}


function formatAsCamel (string) {

	if (!string) {
		return null;
	}

	const lowerCaseString = String(string).toLowerCase().replace(/\W+/g, "_").replace(/_+/g, "_");
	let newString = lowerCaseString;

	while (newString.lastIndexOf("_") > 0) {
		const separatorRegEx	= /[_\-,?*()+=]/g;
		const separatorMatches	= lowerCaseString.matchAll(separatorRegEx);
	
		for (const separatorMatch of separatorMatches) {
			const separatorSymbol		= separatorMatch[0];
			const indexOfCapitalisation = separatorMatch.index + 1;
			const lowerCaseLetter		= lowerCaseString[indexOfCapitalisation];
			const capitalisedLetter		= lowerCaseLetter.toUpperCase();

			newString = newString.replace(separatorSymbol+lowerCaseLetter, capitalisedLetter);
		}
	}


	return newString;
}


/** Uses the same formatting as formatAsConstant, but in lower-case */
function formatAsIdentifier (string) {

	if (!string) {
		return null;
	}

	return formatAsConstant(string).toLowerCase();
}


function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export { getFirstMatch, 
		 matchIsFound, 
		 capitalizeFirstLetter,
		 
		 // Changed the names a bit here for readability. "Types" on the end within this file just to
		 // help differentiate from similar named function convertStringsToPrimitiveNumbers, which is 
		 //	not exported.
		 convertStringsToPrimitiveTypes as convertStringsToPrimitives,
		 convertStringsToPrimitiveTypes as convertStringToPrimitive,
		 formatAsConstant,
		 formatAsCamel,
		 formatAsIdentifier };

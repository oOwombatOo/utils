import { getDecimalNumbersString } from "./numbers";

export function convertFeetAndInchesToCentimeters (feet, inches = 0, decimalPlaces = 1, decimalStep = 0.5, returnAsString = true) {
	const totalInches = (feet * 12) + inches;
	const centimetres = totalInches * 2.54;
	const roundedStr = getDecimalNumbersString(centimetres, decimalPlaces, decimalStep);

	return returnAsString ? roundedStr : Number.parseFloat(roundedStr);
}


export function convertInchesToFeetAndInchesString (paramInches) {
	const feet     = Math.floor(paramInches/12);
	const inches   = paramInches - (feet * 12);
	let imperial = (`${feet}'${inches}"`).replace(".5", "&#189;");
	return imperial;
}


export function convertFeetAndInchesToMetres (feet, inches = 0, decimalPlaces = 2, decimalStep = 0.05, returnAsString = true) {

	const centimetres = convertFeetAndInchesToCentimeters(feet, inches);
	const meters	  = centimetres / 100;
	const roundedStr  = getDecimalNumbersString(meters, decimalPlaces, decimalStep); 

	return returnAsString ? roundedStr : Number.parseFloat(roundedStr);	
}

export function convertYardsToCentimeters (yards, decimalPlaces = 2, decimalStep = 0.05, returnAsString = true) {
	const centimetres = yards * 91.44; 
	const roundedStr  = getDecimalNumbersString(centimetres, decimalPlaces, decimalStep); 
	return returnAsString ? roundedStr : Number.parseFloat(roundedStr);	
}

export function getImperialAndMetricLengthStr (lengthInFeet, andInches = 0, lengthInYards = 0) {
	lengthInFeet = String(lengthInFeet)
					.replace("~", "")
					.replace("½", ".5")
					.replace("'", "");

	lengthInFeet = String(lengthInFeet)
					.replace("~", "")
					.replace("½", ".5")
					.replace("'", "");

	const parsedLengthFeet = Number.parseFloat(lengthInFeet);
	const parsedLengthYards = Number.parseFloat(lengthInYards);
	const lengthCMRaw = convertFeetAndInchesToCentimeters(parsedLengthFeet, andInches, 3, 0.001, false) +
					    convertYardsToCentimeters(parsedLengthYards, 3, 0.001, false);

	const lengthM = getDecimalNumbersString((lengthCMRaw / 100), 1, 0.1);
	const lengthCM = getDecimalNumbersString(lengthCMRaw, 0, 0);

	const imperialStr = (lengthInYards < 1) ? `${parsedLengthFeet}'` : `${parsedLengthYards}yd.`;
	const metricStr = lengthCM >= 100 ? lengthM + "m" : lengthCM + "cm";

	return `${imperialStr} (${metricStr})`;
}

export function convertPoundsToKilograms (pounds) {
	return Math.round(pounds/2.20462);
}

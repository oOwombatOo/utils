import {
	CONVERSION_TYPE,
	CONVERSION_TYPES,	
} from "./../characterRecord/flags";


import {
	convertFeetAndInchesToCentimeters,
	convertInchesToFeetAndInchesString,
	convertPoundsToKilograms,
} from "./../utils/measurements";


function getFormattedDistanceFromInches (inches) {
	switch (CONVERSION_TYPE) {
		case CONVERSION_TYPES.BOTH_IMPERIAL_FIRST :
			return convertInchesToFeetAndInchesString(inches) + " <span class=\"altMeasurement\">(" + convertFeetAndInchesToCentimeters(0, inches, 0) + "cm)</span>";
		break;

		case CONVERSION_TYPES.BOTH_METRIC_FIRST : 
			return  convertFeetAndInchesToCentimeters(0, inches, 0) + "cm <span class=\"altMeasurement\">(" + convertInchesToFeetAndInchesString(inches) + ")</span>";
		break;

		case CONVERSION_TYPES.ONLY_IMPERIAL :
			return convertInchesToFeetAndInchesString(inches);
		break;

		case CONVERSION_TYPES.ONLY_METRIC : 
			return convertFeetAndInchesToCentimeters(0, inches, 0) + "cm";
		break;
	}
}


function getFormattedWeightFromPounds (pounds) {
	switch (CONVERSION_TYPE) {
		case CONVERSION_TYPES.BOTH_IMPERIAL_FIRST :
			return (pounds) + "lbs <span class=\"altMeasurement\">(" + convertPoundsToKilograms(pounds) + "kg)</span>";
		break;

		case CONVERSION_TYPES.BOTH_METRIC_FIRST : 
			return  convertPoundsToKilograms(pounds) + "kg <span class=\"altMeasurement\">(" + (pounds) + "lbs)</span>";
		break;

		case CONVERSION_TYPES.ONLY_IMPERIAL :
			return pounds + "lbs";
		break;

		case CONVERSION_TYPES.ONLY_METRIC : 
			return convertPoundsToKilograms(pounds) + "kg";
		break;
	}
}


export {
	getFormattedDistanceFromInches,
	getFormattedWeightFromPounds,
};

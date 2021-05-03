import clone from "lodash/clone";

function countOccurrencesInArray(array, value) {
	let count = 0;
	
	array.flat().forEach(
		function countOccurrenceOfValue (arrayElement) {
			count = arrayElement === value ? count + 1 : count;
		}
	);

	return count;
}


function getUniqueValuedArray (array) {

	const uniqueValuedArray = [];

	for (const index in array) {
		const value = Array.isArray(array[index]) ? getUniqueValuedArray(array[index]) : array[index];

		if (!uniqueValuedArray.includes(value)) {
			uniqueValuedArray.push(value);
		}
	}
	
	return uniqueValuedArray;
}



function removeFromArray (object, array) {

	const newArray = [];

	for (const element of array) {
		if (element !== object) {
			newArray.push(element);
		}
	}

	return newArray;
}


export { 
	removeFromArray,
	countOccurrencesInArray, 
	getUniqueValuedArray 
};

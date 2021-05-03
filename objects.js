import { formatAsIdentifier, convertStringsToPrimitives } from "./strings";

const getDeepClone = require('lodash.clonedeep');
/**
	Apologies for the weird name, I just couldn't think of something better at the moment. This function
	takes an object and returns a copy of that object where every property it contains, and the object itself
	is frozen, read-only and converted to constant-by-definition variable names (e.g. MY_VAR instead of myVar).
	It will also convert all values to primitive types (e.g. "true" -> true, "12.300" -> 12.3). Vic.
	@param {*} obj 
	@returns {*}
**/
function ultraFreeze (obj) {
	const ultraFrozen = Array.isArray(obj) ? [] : {};

	if (Array.isArray(obj)) {
		for (let i = 0; i < obj.length; i++) {
			const arrayValue 			= obj[i];
			const valueIsObject 		= (arrayValue instanceof Object);
			const ultraFreezeValue		= valueIsObject ? ultraFreeze(arrayValue) : arrayValue;
			ultraFrozen.push(convertStringsToPrimitives(ultraFreezeValue));
		}
	} else {
		for (const property in obj) {
			const propertyIsInnerObject = (obj[property] instanceof Object);
			const ultraFreezeValue		= propertyIsInnerObject ? ultraFreeze(obj[property]) : obj[property];
			const ultraFreezeProperty	= formatAsIdentifier(property);
			addAsConstant(ultraFreezeProperty, convertStringsToPrimitives(ultraFreezeValue), ultraFrozen);		
		}
	}

	return Object.freeze(ultraFrozen);
}




function addAsConstant (constantName, constantValue, object) {

	var constantProperties = {
		enumerable:		true,
		configurable:	false,
		writable:		false,
		value:			constantValue instanceof Object ? Object.freeze(constantValue) : constantValue
	};

	Object.defineProperty(object, constantName, constantProperties);

}

/**
 * Use to add many constant variables to any object. Usage example:
 *
 *		Vikings.Utils.addAsConstants( myObject, {
 *
 *			"DAYS_IN_A_YEAR"	: 365,
 *			"DAYS_IN_A_WEEK"	: 7,
 *			"SECONDS_PER_MINUTE": 60
 *
 *		});
 *
 *	(Vic Webster 8/04/18)
 */
function addAsConstants (object, constantsDescription) {

	for (var constantName in constantsDescription) {

		if(constantsDescription[constantName]){
			var constantValue = constantsDescription[constantName];
			addAsConstant(constantName, constantValue, object);
		}
	}
}



/**
 ** NOTE: getters and setters need to be defined at the same time in the same properties
		  object. TODO: FIX THIS 
**/
function addSetterFunction (object, variableName, setterFunction) {

	var setterProperties = {
		set : function () {

			/** this is simply calling the getterFunction on the supplied object,
			 *	so we don't have to bind them all in the actual object, I just do
			 *	it here instead to keep the object's code neat without .bind() everywhere */
			return setterFunction.bind(object)();
		}
	};

	Object.defineProperty(object, variableName, setterProperties);
}



function addGetterFunction (object, variableName, getterFunction) {

	var getterProperties = {
		get : function () {

			/** this is simply calling the getterFunction on the supplied object,
			 *	so we don't have to bind them all in the actual object, I just do
			 *	it here instead to keep the object's code neat without .bind() everywhere */
			return getterFunction.bind(object)();
		}
	};

	Object.defineProperty(object, variableName, getterProperties);
}



/**
 * Convenience funtion to add many getters to any object. Usage example:
 *
 *		Viking.Utils.addGetterFunctions( myObject, {
 *
 *			halfWidth :  function () { return this.width / 2; },
 *			halfHeight : function () { return this.height / 2; },
 *
 *			// For large functions, preferable to use an encapsulated (private) function,
 *			// just for readability. For example:
 *
 *			complexProperty : getComplexProperty
 *
 *		});
 *
 *		// Inside owning object:
 *
 *		function getComplexProperty () {
 *			... complex stuff ...
 *		}
 *
 *		getComplexProperty.bind(this);
 *
 *	(Vic Webster 8/04/18)
 */
function addGetterFunctions (object, gettersDescription) {

	for (var getterName in gettersDescription) {
		if (gettersDescription.hasOwnProperty(getterName)) {
			var getterFunction = gettersDescription[getterName];
			addGetterFunction(object, getterName, getterFunction);
		}
	}

}



function hasAPropertyWithValue (value, object) {

	var properties	= Object.getOwnPropertyNames(object),
		hasProperty	= false;

	for (var i = 0; i < properties.length; i++) {
		var propertyName	= properties[i],
			propertyValue	= object[propertyName],
			doesExist		= propertyValue === value;
		
		if (doesExist) {
			hasProperty = true;
			break;
		}
	}
	return hasProperty;
}



function isAFunction (funcToCheck) {
	return funcToCheck && {}.toString.call(funcToCheck) === '[object Function]';
}


/**
 * Allows you to append extra functionality that should be run for a
 * specific function after the "original version" of that function has
 * run.
 *
 * Note that "extended functionality" functions are passed two arguments:
 *	- the original arguments supplied to the orignal function
 *	- the value, if any, that the original function returned when run
 *
 * Usage example:
 *
 *	function extendedFunctionality (originalArguments, originalReturn) {
 *		// originalReturn = "I am driving"
 *		var extendedReturn = originalReturn + " very, very fast";
 *		return extendedReturn;
 *	};
 *
 * Object.extendFunctionOn(MyCarObj.prototype, 'goDriving', extendedFunctionality);
 *
 * (Vic Webster 19/04/18)
 *
 */
function extendFunctionOn (object, funcIdentifier, extendedFunctionality) {

	if (!object[funcIdentifier]) {
		console.trace();  // eslint-disable-line no-console 
		throw	"Attempting to extend a function, '" + funcIdentifier +
				"', but it does not already exist on the provided object.";
	}

	if (!isAFunction(extendedFunctionality)) {
		console.trace();  // eslint-disable-line no-console
		throw	"The extendedFunctionality provided is not a javascript" +
				" function.";

	}


	object[funcIdentifier] = ( function (originalFunction) {

		return function () {
			var origReturnValue = originalFunction.apply(this, arguments);
			return extendedFunctionality.call(this, arguments, origReturnValue);
		};

	}(object[funcIdentifier])  );

}



/**
 * Allows you to append functionality to many functions on an object. Please
 * see the comment of Object.extendFunctionOn for more details.
 *
 * Note that "extended functionality" functions are passed two arguments:
 *	- the originalArguments supplied to the orignal function
 *	- the value, if any, that the original function returned when run
 *
 * Usage example:
 *
 *		Object.extendFunctionsOn( MyCarObj.prototype, {
 *
 *			'goDriving' : drivingExtendedFunc,
 *			'start'		: startExtendedFunc,
 *			'stop'		: stopExtendedFunc,
 *
 *			'sellCar'	: function (originalArguments, originalReturn) {
 *								// ... extended functionality ...
 *							}
 *
 *		});
 *
 * (Vic Webster 19/04/18)
 */
function extendFunctionsOn (object, extendedFunctionsDesc) {

	for (var funcIdentifier in extendedFunctionsDesc) {
		if (extendedFunctionsDesc.hasOwnProperty(funcIdentifier)) {
			var extendedFunctionality = extendedFunctionsDesc[funcIdentifier];
			Object.extendFunctionOn(object, funcIdentifier, extendedFunctionality);
		}
	}
}


export {
	getDeepClone,
	ultraFreeze,
	addAsConstant,
	addSetterFunction,
	addGetterFunction,
	addGetterFunctions,
	hasAPropertyWithValue,
	isAFunction,
	extendFunctionOn,
	extendFunctionsOn 
};

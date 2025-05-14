interface Dimensions
{
    width : number,
    height : number
}

/**
* Waits for the given amount of time (in ms).

* @param pSleepDuration The given amount of time (in ms).

* @returns 
*/
function sleepFor(pSleepDuration : number) : Promise<unknown> | undefined
{
    if (typeof pSleepDuration !== 'number')
    {
        console.log("aSleepDuration must be a number, not " + typeof pSleepDuration);
        return;
    } 
    else if (pSleepDuration < 0)
    {
        console.log("aSleepDuration can't be negative.");
        return;
    }

    return new Promise (resolve => setTimeout(resolve, pSleepDuration));
}

/**
* Waits until the given element is clicked.

* @param pElement The given element.

* @returns 
*/
function sleepUntilClick(pElement : HTMLElement) : Promise<unknown>
{
    // Wait until the button is pressed.
    return new Promise(
        (resolve) => 
        {
            // The function to call when aButton is pressed.
            const RemoveListenerAndResolve = () =>
            {
                pElement.removeEventListener('click', RemoveListenerAndResolve);
                resolve("");
            }

            // Add an event listener that results in RemoveListenerAndResolve being called when aButton is clicked.
            pElement.addEventListener('click', RemoveListenerAndResolve);
        }
    );
}

/**
* Waits until one of the elements are clicked.

* @param pElements The elements to be clicked.

* @returns 
*/
function sleepUntilClicks(pElements : HTMLElement[]) : Promise<number>
{
    // Wait until the button is pressed, return index of button pressed.
    return new Promise(
        (resolve) => 
        {
            const lRemoveListenersFuncs : (() => void)[] = pElements.map(
                (_pElement : HTMLElement, pIndex : number) =>
                {
                    return () =>
                    {
                        // Remove all of the listeners.
                        pElements.forEach((e, i) => e.removeEventListener('click', lRemoveListenersFuncs[i]));

                        resolve(pIndex);
                    }
                }
            );
            
            // Add an event listener to each element that results in RemoveListenerAndResolve being called.
            // This means that any of the elements can be clicked to resolve the promise.
            pElements.forEach(
                (e : HTMLElement, i : number) => e.addEventListener(
                    'click', lRemoveListenersFuncs[i]
                )
            );
        }
    );
}

/**
* Generates a random integer between pMin and pMax (inclusive of both, i.e. [pMin, pMax]).

* @param pMin The minimum value that can be returned.
* @param pMax The maximum value that can be returned.

* @returns 
*/
function getRandomInt(pMin : number, pMax : number) : number
{
    return Math.floor(Math.random() * (pMax - pMin + 1)) + pMin;
}

/**
* Generates a random integer between pMin and pMax (inclusive of both, i.e. [pMin, pMax]).

* @param pMin The minimum value that can be returned.
* @param pMax The maximum value that can be returned.

* @returns 
*/
function getRandomFloat(pMin : number, pMax : number) : number
{
    return Math.random() * (pMax - pMin) + pMin;
}

/**
* Randomises the order of the given array.

* @param pArray The array to randomise.

* @returns 
*/
function randomiseArray(pArray : unknown[]) : void
{
    if (!Array.isArray(pArray))
    {
        console.log("The parameter is not an array.");
        return;
    }

    for (let i = pArray.length - 1; i > 0; --i)
    {
        const lIndexRandom = getRandomInt(0, i);

        let lValueI = pArray[i];
        pArray[i] = pArray[lIndexRandom];
        pArray[lIndexRandom] = lValueI;
    }

}

/**
* Stores a value in local storage. This can be a string, number, array, or object.

* @param pKey The key associated with the data.
* @param pValue The value to store.

* @returns Whether the operation succeeded.
*/
function setInLocalStorage<T>(pKey : string, pValue : T) : boolean
{
    try
    {
        if (pValue instanceof Map)
        {
            console.log("Storing a map in local storage.");

            localStorage[pKey] = JSON.stringify(Array.from(pValue));
        }
        else
        {
            localStorage[pKey] = JSON.stringify(pValue);
        }

        return true;
    }
    catch (e)
    {
        console.log("Unable to store value in local storage");
        return false;
    }
}

/**
* Retrieves data from device's internal storage.

* @param pKey The key associated with the data.

* @returns The data (or undefined if it either couldn't be found or an error occurred when parsing it).
*/
function getFromLocalStorage<T>(pKey : string) : T | undefined
{
    if (!localStorage.hasOwnProperty(pKey))
    {
        console.log("localStorage doesn't contain data associated with this key.");
        return;
    }

    const lValueString = localStorage[pKey];

    try
    {
        const lValueParsed : T = JSON.parse(lValueString);

        return lValueParsed;
    }
    catch (e)
    {
        return undefined;
    }
}

/*
* 'Debounces' a function.
* The minimum gap between calls to pFunc is guaranteed to be at least pLengthGap.
* See 'https://www.freecodecamp.org/news/javascript-debounce-example/' for a more in-depth explanation.

* Parameters:
    > aKey: the function to be debounced.
    > pLengthGap: the minimum gap between calls to pFunc.
*/
function debounce(pFunc : (...args: any[]) => any, pLengthGap : number)
{
    let lTimerId : number | undefined = undefined;

    return function (this : any, ...args : any[])
    {
        clearTimeout(lTimerId);

        lTimerId = window.setTimeout(() => { pFunc.apply(this, args); }, pLengthGap);
    };
}

/**
* Generates a new array that contains the same data as the one supplied to the function, with additional elements 
  (equal to pFillValue) padded to the end. 

* @param pArray The array to pad.
* @param pLength The desired length of the returned array.
* @param pFillValue The fill value.

* @returns A new array with the padded values. If pLength is <= the length of the pArray, pArra is returned.
*/
function padEndArray(pArray : any[], pLength : number, pFillValue : any) : any[]
{
    if (pArray.length >= pLength)
        return pArray;

    return Object.assign(new Array(pLength).fill(pFillValue), pArray);
}

/*
* Returns a percentage of a particular value. 

* Parameters:
    > pPercentage: a number or string which represents the percentage (0-100). If a string, it can be of the form "xx%."
    > pValue: the value to which a percentage will be calculated.
*/

/**
* Calculates a percentage of a particular value. 
* @param pPercentage The percentage.
* @param pValue The value.
* @returns A percentage of the given value.
*/
function getPercentVal(pPercentage : number, pValue : number) : number
{
    return (pPercentage / 100) * pValue;
}

function ordinalSuffix(pNum : number) : string
{
    const lNumAbs = Math.abs(pNum);

    if (lNumAbs > 3 && lNumAbs < 21)
        return "th";
    
    const lNumMod10 = lNumAbs % 10;

    if (lNumMod10 === 1)
        return "st";
    else if (lNumMod10 === 2)
        return "nd"
    else if (lNumMod10 === 3)
        return "rd"
    else
        return "th";
}

/*
* If the supplied dimensions (pWidth and pHeight) fit within their desired maximums, said dimensions are returned; 
  otherwise, the dimensions are altered (preserving aspect ratio) such that they both are at or below their maximums.
*/
function fitMaxDimensions(pWidth : number, pHeight : number, pMaxWidth : number, pMaxHeight : number) : Dimensions
{
    // The image's aspect ratio.
    const lAspectRatio : number = pWidth / pHeight;

    if (pWidth > pMaxWidth && pHeight > pMaxHeight)
    {
        pWidth = pMaxWidth;

        pHeight = pWidth / lAspectRatio;

        // If the height is still greater than the max after adjusting for width.
        if (pHeight > pMaxHeight)
        {
            pHeight = pMaxHeight;

            pWidth = pHeight * lAspectRatio;
        }
    }
    else if (pWidth > pMaxWidth)
    {
        pWidth = pMaxWidth;

        pHeight = pWidth / lAspectRatio;
    }
    else if (pHeight > pMaxHeight)
    {
        pHeight = pMaxHeight;

        pWidth = pHeight * lAspectRatio;
    }

    return { width: pWidth, height: pHeight };
}

// Comparison operators.
type CompOp = "E" | "NE" | "G" | "L" | "GE" | "LE";


/**
* A function that compares two numbers with the given operator.

* Parameters:
    @param pNum1 A number.
    @param pOperator The comparison operator.
    @param pNum2 Another number.
    @returns Whether the comparison is true.
*/
function compare(pNum1 : number, pOperator : CompOp, pNum2 : number) : boolean
{
    if (pOperator == "G")
    {
        return pNum1 > pNum2;
    }
    else if (pOperator == "L")
    {
        return pNum1 < pNum2;
    }
    else if (pOperator == "GE")
    {
        return pNum1 >= pNum2;
    }
    else if (pOperator == "LE")
    {
        return pNum1 <= pNum2;
    }
    else if (pOperator == "E")
    {
        return pNum1 == pNum2;
    }
    else if (pOperator === "NE")
    {
        return pNum1 !== pNum2;
    }

    console.log("Unknown comparison operator.");
    return false;
}

const utils =
{
    sleepFor: sleepFor,
    sleepUntilClick: sleepUntilClick,
    sleepUntilClicks: sleepUntilClicks,
    getRandomInt: getRandomInt,
    getRandomFloat: getRandomFloat,
    randomiseArray: randomiseArray,
    setInLocalStorage: setInLocalStorage,
    getFromLocalStorage: getFromLocalStorage,
    debounce: debounce,
    padEndArray: padEndArray,
    getPercentVal: getPercentVal,
    ordinalSuffix: ordinalSuffix,
    compare: compare,
    fitMaxDimensions: fitMaxDimensions,
};

// Export functions.
export { utils as default };

export type { Dimensions, CompOp }

import utils from "../../standard_ui/utils";

// import { ranges } from "./sort_resources";

/*
* For the image one, could create a separate array of the same size as the image. The array of actions has a maximum 
  size, say 100000. Whenever the end of the array is reached, the current set of actions are removed and another set of 
  actions are loaded (a max of 100000). This way we can keep the same architecture as the simple bar graph one. The user
  could potentially go back a certain distance as well. In order to load the actions, the sort process would have to be
  run from the beginning, or the sort process would have to be paused and then unpaused when we need more actions. Not 
  sure how we would just 'pause' the sort process though from another process, and then wait for the actions to be 
  populated before continuing the process. It'd essentially be two sort processes being run in parallel, with one sort
  process running over a section of the sort first, and the other catching up. Not sure how to do that efficiently.
*/
class SortAction
{
    /*
    * The types of actions:
        > Swap: Swapping the values at two indexes.
        > Set: Setting the value at a particular index.
        > Compare: Comparing the values at two indexes.
    */
    static Type = {
        Swap: "0",
        Set: "1",
        Compare: "2"
    };

    // The type of action (should be a value of SortAction.Type)
    #fType;

    /*
    * if #fType is either Type.Swap or Type.Compare
        - The index to swap/compare to the other index (#fValueB).
      else if #fType is Type.Set
        - The index at which to store the given value (#fValueB).
    */
    #fValueA;

    /*
    * if #fType is either Type.Swap or Type.Compare
        - The index to swap/compare to the other index (#fValueA).
      else if #fType is Type.Set
        - The value to set at the given index (#fValueA).
    */
    #fValueB;

    /*
    * The comparison operator to use (if #fType Type.Compare).
    */
    // #fCompOp;

    constructor(pType, pValueA, pValueB, pCompOp = utils.compOps.E)
    {
        this.#fType = pType;
        this.#fValueA = pValueA;
        this.#fValueB = pValueB;
        // this.#fCompOp = pCompOp;
    }

    get type() { return this.#fType; }

    get valueA() { return this.#fValueA; }
    set valueA(pValueA) { this.#fValueA = pValueA; }

    get valueB() { return this.#fValueB; }
    set valueB(pValueB) { this.#fValueB = pValueB; }

    // get compOp() { return this.#fCompOp; }
}

class Element
{
    // The element's value (0-100).
    #fValue;

    // The element's state.
    #fState;

    /*
    * The states that an element can be in:
        > normal: no operation has occurred upon the element.
        > compared: the element has been compared with another element (or a number).
        > swapped: the element has been swapped with another element.
        > set: the element has been set with a value.
    */
    static State = {
        Normal: "n",
        Compared: "c",
        Swapped: "sw",
        Set: "st"
    };

    constructor(pValue, pState)
    {
        this.#fValue = pValue;

        this.#fState = pState;
    }

    get value() { return this.#fValue; }
    set value(pValue) { this.#fValue = pValue; }

    get state() { return this.#fState; }
    set state(pState) { this.#fState = pState; }
}

class Elements
{
    constructor(pNumElements)
    {
        this._elements = Array.from(
            { length: pNumElements }, 
            () => 
            { 
                return new Element(utils.getRandomInt(1, 100), Element.State.Normal);
            }
        );

        this._elementsSnapshot = [];
        this._sortActions = [];
    }

    swap(pIndexA, pIndexB, pRecordSortAction = true, pSetState = false)
    {
        let lTemp = this._elements[pIndexA];
        this._elements[pIndexA] = this._elements[pIndexB];
        this._elements[pIndexB] = lTemp;

        if (pRecordSortAction)
        {
            this._sortActions.push(new SortAction(SortAction.Type.Swap, pIndexA, pIndexB));
        }

        if (pSetState)
        {
            this._elements[pIndexA].state = Element.State.Swapped;
            this._elements[pIndexB].state = Element.State.Swapped;
        }
    }

    setValue(pIndex, pValue, pRecordSortAction = true, pSetState = false)
    {
        this._elements[pIndex] = new Element(pValue, this._elements[pIndex].state);

        if (pRecordSortAction)
        {
            this._sortActions.push(new SortAction(SortAction.Type.Set, pIndex, pValue));
        }

        if (pSetState)
        {
            this._elements[pIndex].state = Element.State.Set;
        }
    }

    compare(pIndexA, pCompOp, pIndexB, pRecordSortAction = true, pSetState = false)
    {
        let lReturnVal;

        utils.com

        if (pCompOp === utils.compOps.E)
        {
            lReturnVal = this._elements[pIndexA].value === this._elements[pIndexB].value;
        }
        else if (pCompOp === utils.compOps.NE)
        {
            lReturnVal = this._elements[pIndexA].value !== this._elements[pIndexB].value;
        }
        else if (pCompOp === utils.compOps.G)
        {
            lReturnVal = this._elements[pIndexA].value > this._elements[pIndexB].value;
        }
        else if (pCompOp === utils.compOps.L)
        {
            lReturnVal = this._elements[pIndexA].value < this._elements[pIndexB].value;
        }
        else if (pCompOp === utils.compOps.GE)
        {
            lReturnVal = this._elements[pIndexA].value >= this._elements[pIndexB].value;
        }
        else if (pCompOp === utils.compOps.LE)
        {
            lReturnVal = this._elements[pIndexA].value <= this._elements[pIndexB].value;
        }
        else
        {
            console.log("The value of pCompOp doesn't correspond to a valid comparison operator.");
            lReturnVal = false;
        }

        if (pRecordSortAction)
        {
            this._sortActions.push(new SortAction(SortAction.Type.Compare, pIndexA, pIndexB, pCompOp));
        }

        if (pSetState)
        {
            this._elements[pIndexA] = new Element(this._elements[pIndexA].value, Element.State.Compared);
            this._elements[pIndexB] = new Element(this._elements[pIndexB].value, Element.State.Compared);
        }

        return lReturnVal;
    }

    compareValue(pIndexA, pCompOp, pValue, pRecordSortAction = true, pSetState = false)
    {
        let lReturnVal;

        if (pCompOp === utils.compOps.E)
        {
            lReturnVal = this._elements[pIndexA].value === pValue;
        }
        else if (pCompOp === utils.compOps.NE)
        {
            lReturnVal = this._elements[pIndexA].value !== pValue;
        }
        else if (pCompOp === utils.compOps.G)
        {
            lReturnVal = this._elements[pIndexA].value > pValue;
        }
        else if (pCompOp === utils.compOps.L)
        {
            lReturnVal = this._elements[pIndexA].value < pValue;
        }
        else if (pCompOp === utils.compOps.GE)
        {
            lReturnVal = this._elements[pIndexA].value >= pValue;
        }
        else if (pCompOp === utils.compOps.LE)
        {
            lReturnVal = this._elements[pIndexA].value <= pValue;
        }
        else
        {
            console.log("The value of pCompOp doesn't correspond to a valid comparison operator.");
            lReturnVal = false;
        }

        if (pSetState)
        {
            this._elements[pIndex].state = Element.State.Compared;
        }

        return lReturnVal;
    }

    /*
    * Populates the sort actions array with actions that result in the elements being shuffled.
    */
    async shuffleSnapshot()
    {
        this.saveSnapshot();

        for (let i = this._elements.length - 1; i > 0; --i)
        {
            const lIndexRandom = utils.getRandomInt(0, i);

            this.swap(i, lIndexRandom, true);
        }

        console.log(this.sortActions);

        this.loadSnapshot();
    }

    reset()
    {
        this._sortActions = [];
    }

    resetElementColour(pIndex)
    {
        this._elements[pIndex] = new Element(this._elements[pIndex].value, Element.State.Normal);
    }

    /**
    * Saves the current values of into this._elementsSnapshot.
    */
    saveSnapshot()
    {
        this._elementsSnapshot = Array.from({ length: this._elements.length });

        for (let i = 0; i < this._elements.length; ++i)
        {
            this._elementsSnapshot[i] = new Element(this._elements[i].value, this._elements[i].state);
        }
    }

    /**
    * Loads the values of this._elementsSnapshot into this._elements.
    * Note: this._elementsSnapshot and this._elements must have the same length.
    */
    loadSnapshot()
    {
        if (this._elementsSnapshot && this._elementsSnapshot.length != this._elements.length)
            return;

        for (let i = 0; i < this._elementsSnapshot.length; ++i)
        {
            this._elements[i] = this._elementsSnapshot[i];
        }
    }

    resize(pSize)
    {
        this._elements = Array.from(
            { length: pSize }, 
            () => 
            { 
                return new Element(utils.getRandomInt(1, 100), Element.State.Normal);
            }
        );
    }

    async applySortActions()
    {
        for (const sa of this._sortActions)
        {
            // Apply action.
            this.applySortAction(sa);
        }
    }

    /**
    * Applies a given sort action to the elements.
    * Do note that if a given action A, is applied to the elements, if this same action A is applied again, the elements 
      must return to their original form prior to the first application of A. For swaps and comparisons, the sort action
      won't be modified to achieve this; however, for sets, the value that is set must be changed each time the action 
      is applied.

    * Parameters: 
        * @param {SortAction} pSortAction 
        * @param {boolean} pSleepOrStep 
        * @param {boolean} pRecordSortAction 
        * @param {boolean} pReRender 
    */
    applySortAction(pSortAction, pRecordSortAction = false, pSetState = true)
    {
        // Apply action.
        if (pSortAction.type == SortAction.Type.Swap)
        {
            if ((pSortAction.valueA >= 0 && pSortAction.valueA < this._elements.length) &&
                (pSortAction.valueB >= 0 && pSortAction.valueB < this._elements.length))
            {
                this.swap(pSortAction.valueA, pSortAction.valueB, pRecordSortAction, pSetState);
            }
        }
        else if (pSortAction.type == SortAction.Type.Compare)
        {
            if (pSortAction.compOp in utils.compOps)
            {
                this.compare(pSortAction.valueA, pSortAction.compOp, pSortAction.valueB, pRecordSortAction, pSetState);
            }
        }
        else
        {
            if (pSortAction.valueA >= 0 && pSortAction.valueA < this._elements.length)
            {
                // The value that was at the given index prior to the set.
                const lValAtIndex = this._elements[pSortAction.valueA].value;

                this.setValue(pSortAction.valueA, pSortAction.valueB, pRecordSortAction, pSetState);

                // Set value B to lValAtIndex so that if the action is applied again it undoes the effect. 
                pSortAction.valueB = lValAtIndex;
            }
        }
    }

    get elements()
    {
        return this._elements;
    }

    get length()
    {
        return this._elements.length;
    }

    set elements(pElements)
    {
        this._elements = pElements;
    }

    get sortActions()
    {
        return this._sortActions;
    }

    get lengthSortActions()
    {
        return this._sortActions.length;
    }


}

export { Elements as default, Element, SortAction};
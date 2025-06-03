import { CompOp } from "../../standard_ui/utils";

/**
* The sort action type. 

* Definitions:
    > sw: swap.
    > st: set.
    > c: compare
*/
type SortActionType = "SW" | "ST" | "C";

/*
* A class to represent sort actions.
*/
class SortAction
{
    // The type of action (should be a value of SortAction.Type)
    fType : SortActionType;

    /*
    * if #fType is either Type.Swap or Type.Compare
        - The index to swap/compare to the other index (#fValueB).
      else if #fType is Type.Set
        - The index at which to store the given value (#fValueB).
    */
    fValueA : number;

    /*
    * if #fType is either Type.Swap or Type.Compare
        - The index to swap/compare to the other index (#fValueA).
    */
    fValueB : number;

    /*
    * if #fType is either Type.Swap or Type.Compare
        - undefined
      else if #fType is Type.Set
        - The colour at which to set at the corresponding index.
    */
    fValueC : string;

    /*
    * The comparison operator to use (if #fType Type.Compare).
    */
    fCompOp : CompOp;

    constructor(pType : SortActionType, pValueA : number, pValueB : number, pValueC : string = "", pCompOp : CompOp = "E")
    {
        this.fType = pType;
        this.fValueA = pValueA;
        this.fValueB = pValueB;
        this.fValueC = pValueC;
        this.fCompOp = pCompOp;
    }

    get type() { return this.fType; }

    get valueA() { return this.fValueA; }
    set valueA(pValueA) { this.fValueA = pValueA; }

    get valueB() { return this.fValueB; }
    set valueB(pValueB) { this.fValueB = pValueB; }

    get valueC() { return this.fValueC; }
    set valueC(pValueC) { this.fValueC = pValueC; }

    get compOp() { return this.fCompOp; }
}

export default SortAction;

export type { SortActionType };
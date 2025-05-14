
import utils from "../../standard_ui/utils";

import SortableImage from "./SortableImage";

import { CompOp } from "../../standard_ui/utils";

// A type used by the two merge sort algorithms.
type IndexAndColour = { index : number, colour: string };

function QuickSortRandomPivot(pImage : SortableImage, pAscending : boolean)
{
    // Take a snapshot of the image's indexes.
    pImage.saveSnapshot();

    const lOperator : CompOp = pAscending ? "G" : "L";

    const SortValue = (pImage : SortableImage, pStart : number, pEnd : number) =>
    {
        // The index of the value that is to be placed into its sorted position.
        let lIndexPivot : number = utils.getRandomInt(pStart, pEnd);

        pImage.swap(lIndexPivot, pEnd);

        lIndexPivot = pEnd;

        // The index at which lIndexPivot's value will ultimately be placed.
        let lIndexOfSort : number = pStart;

        for (let i = pStart; i < pEnd; ++i)
        {
            if (pImage.compare(lIndexPivot, lOperator, i))
            {
                // Swap current value with the one at lIndexOfSort.
                if (i != lIndexOfSort)
                    pImage.swap(i, lIndexOfSort);

                ++lIndexOfSort;
            }
        }

        // Move the pivot's value into its sorted position.
        if (lIndexOfSort != lIndexPivot)
        { pImage.swap(lIndexOfSort, lIndexPivot); }

        // Return the index of the value sorted by this algorithm.
        return lIndexOfSort;
    }

    const SplitElements = (pImage : SortableImage, pStart : number, pEnd : number) => 
    {
        if (pStart < pEnd)
        {
            const lIndexSortedValue : number = SortValue(pImage, pStart, pEnd);

            SplitElements(pImage, pStart, lIndexSortedValue - 1);

            SplitElements(pImage, lIndexSortedValue + 1, pEnd);
        }
    }

    SplitElements(pImage, 0, pImage.length - 1);

    // Load the snapshot to undo the changes.
    pImage.loadSnapshot();
}

function MergeSort(pImage : SortableImage, pAscending : boolean)
{
    // Take a snapshot of the elements.
    pImage.saveSnapshot();

    const lOperator : CompOp = pAscending ? "LE" : 'GE';

    const Merge = (pImage : SortableImage, pStart : number, pMid : number, pEnd : number) =>
    {
        // Create a temporary container to house the merged segment.
        const lSizeOfMerger : number = pEnd - pStart + 1; // Size of merged segment.
        let lMerger : IndexAndColour[] = Array(lSizeOfMerger); // Array to hold the merged values of lower and upper segments.

        // The current indexes of the lower and upper segments, respectively.
        let lIndexLowerSegment : number = pStart;
        let lIndexUpperSegment : number = pMid + 1;

        // The 'current' index of lMerger.
        let lMergerIndex : number = 0;
        
        // The purpose of this while loop is to populate lMerger with all elements from lower and upper segments.
        while (true)
        {
            if (lIndexLowerSegment <= pMid && lIndexUpperSegment <= pEnd)
            {
                if (pImage.compare(lIndexLowerSegment, lOperator, lIndexUpperSegment))
                {
                    lMerger[lMergerIndex++] = { index: pImage.getIndex(lIndexLowerSegment), colour: pImage.getPixelColour(lIndexLowerSegment++) };
                    // lMerger[lMergerIndex++] = pImage.elements[lIndexLowerSegment++];
                }
                else
                {
                    lMerger[lMergerIndex++] = { index: pImage.getIndex(lIndexUpperSegment), colour: pImage.getPixelColour(lIndexUpperSegment++) };
                    // lMerger[lMergerIndex++] = pImage.elements[lIndexUpperSegment++];
                }
                
            }
            else if (lIndexLowerSegment <= pMid)
            {
                lMerger[lMergerIndex++] = { index: pImage.getIndex(lIndexLowerSegment), colour: pImage.getPixelColour(lIndexLowerSegment++) };
                // lMerger[lMergerIndex++] = pImage.elements[lIndexLowerSegment++];
            }
            else if (lIndexUpperSegment <= pEnd)
            {
                lMerger[lMergerIndex++] = { index: pImage.getIndex(lIndexUpperSegment), colour: pImage.getPixelColour(lIndexUpperSegment++) };
                // lMerger[lMergerIndex++] = pImage.elements[lIndexUpperSegment++];
            }
            else
            {
                break;
            }
            
        }

        // Copy the values from lMerger into the appropriate indexes of pElements.
        for (let i = pStart; i <= pEnd; ++i) 
        { 
            pImage.setValue(i, lMerger[i - pStart].index, lMerger[i - pStart].colour);
        }
    }

    const SplitAndMerge = (pImage : SortableImage, pStart : number, pEnd : number) => 
    {
        if (pStart >= pEnd)
        { return; }

        // Calculate the middle index.
        let lMid : number = Math.floor((pStart + pEnd) / 2);

        // Split and merge the lower half of the current segment (aStart to lMid).
        // Once this returns, said lower half will have been sorted.
        SplitAndMerge(pImage, pStart, lMid);
        
        // Continue to split and merge the upper half of the current segment (lMid + 1 to aEnd).
        // Once this returns, said upper half will have been sorted.
        SplitAndMerge(pImage, lMid + 1, pEnd);

        // Combine the lower (aStart to lMid) and upper (lMid + 1 to aEnd) segments which, individually, are sorted.
        Merge(pImage, pStart, lMid, pEnd);
    }

    SplitAndMerge(pImage, 0, pImage.length - 1);

    // Load the snapshot to undo the changes.
    pImage.loadSnapshot();
}

function MergeSortIterative(pImage : SortableImage, pAscending : boolean)
{
    // Take a snapshot of the elements.
    pImage.saveSnapshot();

    const lOperator : CompOp = pAscending ? "LE" : "GE";

    const Merge = (pImage : SortableImage, pStart : number, pMid : number, pEnd : number) =>
    {
        // Create a temporary container to house the merged segment.
        const lSizeOfMerger : number = pEnd - pStart + 1; // Size of merged segment.
        let lMerger : IndexAndColour[] = Array(lSizeOfMerger); // Array to hold the merged values of lower and upper segments.

        // (a). The current indexes of the lower and upper segments, respectively.
        let lIndexLowerSegment = pStart;
        let lIndexUpperSegment = pMid + 1;

        // (b). The 'current' index of lMerger.
        let lMergerIndex = 0;
        
        // The purpose of this while loop is to populate lMerger with all elements from lower and upper segments.
        while (true) // (c).
        {
            if (lIndexLowerSegment <= pMid && lIndexUpperSegment <= pEnd) // (d).
            {
                if (pImage.compare(lIndexLowerSegment, lOperator, lIndexUpperSegment)) // (e).
                {
                    lMerger[lMergerIndex++] = { index: pImage.getIndex(lIndexLowerSegment), colour: pImage.getPixelColour(lIndexLowerSegment++) };
                    // lMerger[lMergerIndex++] = pImage.elements[lIndexLowerSegment++];
                }
                else // (f).
                {
                    lMerger[lMergerIndex++] = { index: pImage.getIndex(lIndexUpperSegment), colour: pImage.getPixelColour(lIndexUpperSegment++) };
                    // lMerger[lMergerIndex++] = pImage.elements[lIndexUpperSegment++];
                }
                
            }
            else if (lIndexLowerSegment <= pMid) // (g).
            {
                lMerger[lMergerIndex++] = { index: pImage.getIndex(lIndexLowerSegment), colour: pImage.getPixelColour(lIndexLowerSegment++) };
                // lMerger[lMergerIndex++] = pImage.elements[lIndexLowerSegment++];
            }
            else if (lIndexUpperSegment <= pEnd) // (h).
            {
                lMerger[lMergerIndex++] = { index: pImage.getIndex(lIndexUpperSegment), colour: pImage.getPixelColour(lIndexUpperSegment++) };
                // lMerger[lMergerIndex++] = pImage.elements[lIndexUpperSegment++];
            }
            else // (i).
            {
                break;
            }
            
        }

        // Copy the values from lMerger into the appropriate indexes of pElements.
        for (let i = pStart; i <= pEnd; ++i) 
        { 
            pImage.setValue(i, lMerger[i - pStart].index, lMerger[i - pStart].colour);
            // pElements.SetElementColour(i, lColourMerged, true);
        }
    }

    let lSegmentSize : number; // Current size of segment to split and merge (range: 2 to l_max_segment_size).
    let lStart : number; // First index of segment (first index of lower half).
    let lMid : number; // Middle index of segment (last index of lower half, first index of lower half).
    let lEnd : number; // Last index of segment (last index of upper half).

    // Not necessary to make these variables, but it does help with readability.
    let lContainerMaxIndex : number = pImage.length - 1;
    let lContainerSize : number= pImage.length;

    // Calculate and store the maximum length of a segment.
    let lMaxSegmentSize : number = 1;
    while (lMaxSegmentSize < lContainerSize)
    { lMaxSegmentSize *= 2; }

    for (lSegmentSize = 2; lSegmentSize <= lMaxSegmentSize; lSegmentSize *= 2) // (d).
    {
        for (lStart = 0; lStart <= lContainerMaxIndex - Math.floor(lSegmentSize / 2); lStart += lSegmentSize) // (e).
        {
            // (Calculate middle index of segment lStart to lEnd (max index of lower half).
            lMid = lStart + Math.floor((lSegmentSize / 2)) - 1;

            // Calculate max index of segment lStart to lEnd (max index of upper half).
            let lEndCandidate : number = lStart + lSegmentSize - 1;
            if (lEndCandidate < lContainerMaxIndex)
            {
                lEnd = lEndCandidate;
            }
            else
            {
                lEnd = lContainerMaxIndex;
            }

            // Combine the lower (lStart to lMid) and upper (lMid + 1 to lEnd) halves of the current segment.
            Merge(pImage, lStart, lMid, lEnd);
        }
        
    }

    // Load the snapshot to undo the changes.
    pImage.loadSnapshot();
}

function HeapSort(pImage : SortableImage, pAscending : boolean, pSort : boolean = true)
{
    // Take a snapshot of the elements.
    pImage.saveSnapshot();

    const MaxHeapify = (pIndexLastNode : number, pIndexParentNode : number) => 
    {
        let lIndexMaxValue : number = pIndexParentNode;

        let lIndexLeftChild : number = 2 * pIndexParentNode + 1;
        let lIndexRightChild : number = 2 * pIndexParentNode + 2;

        if (lIndexLeftChild <= pIndexLastNode) // If valid index.
        {
            // Reassign the max index if the left child's value is higher than that of its parent.
            if (pImage.compare(lIndexLeftChild, 'G', lIndexMaxValue))
            {
                lIndexMaxValue = lIndexLeftChild;
            }

        }

        if (lIndexRightChild <= pIndexLastNode) // If valid index.
        {
            // Reassign the max index if the right child's value is higher than that of the current max.
            if (pImage.compare(lIndexRightChild, 'G', lIndexMaxValue))
            {
                lIndexMaxValue = lIndexRightChild;
            }
        }

        if (lIndexMaxValue != pIndexParentNode)
        {
            // Swap value of current parent with that of its highest-value child (whose value is higher than its). 
            pImage.swap(lIndexMaxValue, pIndexParentNode);

            MaxHeapify(pIndexLastNode, lIndexMaxValue);
        }
    }

    const MinHeapify = (pIndexLastNode : number, pIndexParentNode : number) => 
    {
        let lIndexMinValue : number = pIndexParentNode;

        let lIndexLeftChild : number = 2 * pIndexParentNode + 1;
        let lIndexRightChild : number = 2 * pIndexParentNode + 2;

        if (lIndexLeftChild <= pIndexLastNode) // If valid index.
        {
            // Reassign the max index if the left child's value is higher than that of its parent.
            if (pImage.compare(lIndexLeftChild, "L", lIndexMinValue))
            {
                lIndexMinValue = lIndexLeftChild;
            }
        }

        if (lIndexRightChild <= pIndexLastNode) // If valid index.
        {
            // Reassign the max index if the right child's value is higher than that of the current max.
            if (pImage.compare(lIndexRightChild, "L", lIndexMinValue))
            {
                lIndexMinValue = lIndexRightChild;
            }
        }

        if (lIndexMinValue != pIndexParentNode)
        {
            // Swap value of current parent with that of its highest-value child (whose value is higher than its). 
            pImage.swap(lIndexMinValue, pIndexParentNode);

            MinHeapify(pIndexLastNode, lIndexMinValue);
        }
    }

    let lIndexLowestParentNode : number = Math.floor((pImage.length / 2) - 1);

    for (let i = lIndexLowestParentNode; i >= 0; --i)
    {
        pAscending ? MaxHeapify(pImage.length - 1, i) : 
                     MinHeapify(pImage.length - 1, i);
    }

    if (pSort)
    {
        for (let lIndexLastNode = pImage.length - 1; lIndexLastNode >= 0;)
        {
            pImage.swap(0, lIndexLastNode);

            pAscending ? MaxHeapify(--lIndexLastNode, 0) :
                         MinHeapify(--lIndexLastNode, 0);
        }
    }

    // Load the snapshot to undo the changes.
    pImage.loadSnapshot();
}

function ShellSort(pImage : SortableImage, pAscending : boolean)
{
    // Take a snapshot of the elements.
    pImage.saveSnapshot();
    // source: https://www.geeksforgeeks.org/shellsort/

    // The operator to use in the while loop's condition.
    const lOperator = pAscending ? 'G' : 'L';

    let n : number = pImage.length;

    /*
    * Perform insertion sort on all sublists of pElements where each sublist is comprised of elements of pElements that
    are 'gap' indexes apart from each other.
    */
    for (let gap = Math.floor(n/2); gap > 0; gap = Math.floor(gap / 2))
    {
        // The maximum index (which is an index of pElements) of the current sublist.
        let lIndexMaxSubList : number = gap;

        /*
        * Each iteration of this for loop performs an insertion sort on one of the sublists. 
        * A sublist's size, given by lIndexMaxSubList, is increased by 1 every time it is iterated over.
        * Each successive iteration of the loop focuses on a different sublist. Each sublist is iterated over several 
        times (equal to its (final) length minus 1).
        * Each sublist mustn't contain the same element as another sublist.
        * The number of elements in a sublist is, at most, n / gap (s = n /gap); the number of sublists is n / s.
        */
        for (; lIndexMaxSubList < n; ++lIndexMaxSubList)
        {
            const lValueToInsert : IndexAndColour = { index: pImage.getIndex(lIndexMaxSubList), colour: pImage.getPixelColour(lIndexMaxSubList) };

            // The index of the sublist at which lValueToInsert will be inserted.
            let lIndexOfInsert : number = lIndexMaxSubList;

            // The lowest index of the sublist.
            let lIndexMinSublist : number = lIndexMaxSubList % gap;

            for (; lIndexOfInsert > lIndexMinSublist && pImage.compareValue(lIndexOfInsert - gap, lOperator, lValueToInsert.index); 
                lIndexOfInsert -= gap)
            {
                pImage.setValue(lIndexOfInsert, pImage.getIndex(lIndexOfInsert - gap), pImage.getPixelColour(lIndexOfInsert - gap));
            }

            pImage.setValue(lIndexOfInsert, lValueToInsert.index, lValueToInsert.colour);
        }

    }

    // Load the snapshot to undo the changes.
    pImage.loadSnapshot();
}

// An algorithm which just gets the list into heap form (doesn't actually sort).
function Heapify(pImage : SortableImage, pAscending : boolean)
{
    HeapSort(pImage, pAscending, false);
};

// The names of the sorting algorithms.
const sortAlgoNames = [
    "QUICK",
    "MERGE",
    "MERGE ITERATIVE",
    "HEAP",
    "SHELL",
    "HEAPIFY"
];

const sortAlgos : { [key: string]: (pImage : SortableImage, pAscending : boolean) => void } = {
    "QUICK": QuickSortRandomPivot,
    "MERGE": MergeSort,
    "MERGE ITERATIVE": MergeSortIterative,
    "HEAP": HeapSort,
    "SHELL": ShellSort,
    "HEAPIFY": Heapify
}


// The ranges used for the sliders.
const ranges = {

    // The min and max sorting speed.
    speed: { min: 100,  max: 10000 },

    // The maximum number of pixels.
    size: 250000
}

export { sortAlgoNames, sortAlgos, ranges };
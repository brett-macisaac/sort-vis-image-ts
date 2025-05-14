import React, { useState, useEffect, useRef, useMemo, useCallback, CSSProperties, FormEvent, memo } from "react";

import TextStd from "../text_std/TextStd";
import { useTheme } from "../../standard_ui";

import "./SliderStd.css";

/* Resources

* https://www.youtube.com/watch?v=SGKLKiEt_UE. The logic of the slider's custom UI was based on the component 
    created in this video.
*/

type StylesSliderStd = 
{
    con?: React.CSSProperties,
    track?: React.CSSProperties,
    progress?: React.CSSProperties,
    text?: React.CSSProperties,
};

interface PropsSliderStd
{
    prMin: number,
    prMax: number,
    prValue: number,
    prStep: number,
    prOnChange: (pIndexItem : number) => void,
    prLabel?: string,
    prWidth?: string | number,
    prHeight?: string | number,
    prIsVertical?: boolean,
    prIsVerticalTopDown?: boolean
    prShowValue?: boolean,
    prShowLabel?: boolean,
    prShowStickyValue?: boolean,
    prMinAllowed?: number,
    prMaxAllowed?: number,
    prIsActive?: boolean,
    prUseOverlayInactive?: boolean,
    prOverlayInactiveJustProgress?: boolean
    prStyles?: StylesSliderStd
}

/**
* A customisable slider component.

* Props:
    * @param {number} prMin - The minimum value of the slider.
    * @param {number} prMax - The maximum value of the slider.
    * @param {number} prValue - The value of the slider.
    * @param {number} prStep - The value by which the slider steps.
    * @param {func} prOnChange - A function that accepts one argument (i.e. the updated value).
    * @param {boolean} prDisabled - Whether the slider is disabled. When disabled, the value cannot be changed.
    * @param {number} prLabel - The slider's label.
    * @param {number} prWidth - The slider's width.
    * @param {number} prHeight - The slider's height.
    * @param {boolean} prIsVertical - Whether the slider is vertical.
    * @param {boolean} prIsVerticalTopDown - Whether a vertical slider (i.e. prIsVertical is true) slides from the top 
      down (i.e has its highest value at the bottom). If prIsVertical is false, this prop has no effect.
    * @param {boolean} prShowValue - Whether the value is displayed on the slider.
    * @param {boolean} prShowLabel - Whether the label is displayed on the slider.
    * @param {boolean} prShowStickyValue - Whether the 'sticky value' is displayed on the slider. The sticky value, as 
      the name suggests, 'sticks' to the end of the progress bar. When this prop is true, the values of prShowValue and
      prShowLabel are ignored (i.e. there values don't matter, only the sticky value is shown).
    * @param {number} prMinAllowed - The minimum 'allowed' value. The slider cannot go beyond this value, even if prMin
      is less that it.
    * @param {number} prMaxAllowed - The maximum 'allowed' value. The slider cannot go beyond this value, even if prMax
      is greater than it.
    * @param {object} prStyles - An object in which to include styling objects for the outermost container (.con), the 
      track (.track), the progress bar (.progress), and the text (.text)
*/
const SliderStd = memo(
    function SliderStd({ prMin, prMax, prValue, prStep, prOnChange, prLabel = "", prWidth, prHeight, prIsVertical = false, 
                         prIsVerticalTopDown = true, prShowValue = true, prShowLabel = true, prShowStickyValue = false, 
                         prIsActive = true, prUseOverlayInactive = false, prOverlayInactiveJustProgress = false, 
                         prMinAllowed, prMaxAllowed, prStyles } : PropsSliderStd)
    {
        const { theme } = useTheme();

        /* 
        * The length of the progress-bar, expressed as a number between 0 and 100, which represents its proportion of the 
        overall track.
        */
        const [ stSliderRange, setSliderRange ] = useState<number>(prValue);

        /* Whether the first render has occurred. */
        const [ stFirstRenderDone, setFirstRenderDone ] = useState<boolean>(false);

        /* 
        * Whether the invisible sticky value label has been 'pushed' outside of the progress bar due to the progress bar 
        being smaller than it.
        */
        const [ stLblValueStickyInvisNegOffset, setLblValueStickyNegOffset ] = useState<boolean>(false);

        /* A reference of the input range element. */
        const rfSlider = useRef<HTMLInputElement>(null);

        /* 
        * A reference of the invisible 'sticky value' element.
        * The positioning of the sticky-value element is dynamic: i.e. it's either absolutely positioned to the track (when 
        the progress bar gets smaller than it) or positioned at the end of the progress bar.
        * To control this dynamic positioning, it's necessary to have an invisible copy of the label that's absolutely 
        positioned to the end of the progress bar. The distance of the left-edge of this invisible copy to the left-edge 
        of the progress bar is monitored: when it's negative, the sticky value is positioned absolutely to the track, and 
        when it's positive it's positioned at the end of the progress bar.
        */
        const rfLblValueStickyInvis = useRef<HTMLDivElement | null>(null);

        /*
        * Handler for the input (range) DOM element.
        * This contains the logic that controls the length of the progress bar.
        */
        const lHandleSliderInput = useCallback(
            (event: FormEvent<HTMLInputElement> | undefined, pOverrideDisabledFlag : boolean = false) =>
            {
                if (!rfSlider.current)
                    return;

                if (!pOverrideDisabledFlag && !prIsActive) 
                {
                    return;
                }

                const lRange = prMax - prMin; // -1?

                let lInvertValue = prIsVertical && stFirstRenderDone && prIsVerticalTopDown;

                let lValueCurrent : number = parseInt(rfSlider.current.value);

                if (Number.isNaN(lValueCurrent))
                {
                    console.log("SliderStd: an error occurred converting the slider's value to string");
                }
                    

                // The inverted value.
                const lValueInverted = prMax - lValueCurrent + prMin;

                /*
                * When vertical (top-down), use the inverted value due to the vertical input range element scrolling 
                bottom-to-top, not top-to-bottom.
                */
                if (lInvertValue)
                    lValueCurrent = lValueInverted;

                // Restrict lValueCurrent to the 'allowed' min and max (if they exist).
                if (prMinAllowed)
                    lValueCurrent = Math.max(lValueCurrent, prMinAllowed);
                if (prMaxAllowed)
                    lValueCurrent = Math.min(lValueCurrent, prMaxAllowed);

                const lDistance = lValueCurrent - prMin;

                const lPercentage = (lDistance / lRange) * 100;

                setSliderRange(lPercentage);
                prOnChange(lValueCurrent);
            },
            [ 
                prOnChange, prIsActive, prMax, prMin, prIsVertical, prIsVerticalTopDown, prMinAllowed, prMaxAllowed, 
                stFirstRenderDone 
            ]
        );

        /*
        * Initialise the custom aspects of the component.
        * lHandleSliderInput initialises setSliderRange to the correct value, which then triggers a useEffect that 
        initiliases stLblValueStickyInvisNegOffset
        */
        useEffect(
            () =>
            {
                console.log("Hello!")
                lHandleSliderInput(undefined, true);
                //console.log("Initialise");
            },
            [ rfSlider ]
        );

        /*
        * Record that the first render has been completed.
        * This is important for when prIsVertical and prIsVerticalTopDown are both set. Due to the DOM's input (range) 
        element not supporting a vertical alignment with the slider moving from the top to the bottom, the value must be
        inverted to give the desired effect. However, the effect shouldn't occur on the first render, otherwise the 
        lHandleSliderInput function will invert the initial value.
        */
        useEffect(
            () =>
            {
                setFirstRenderDone(true);
            },
            []
        );

        /*
        * Logic for controlling the value of stLblValueStickyInvisNegOffset, which determines how the sticky value is 
        positioned.
        */
        useEffect(
            () =>
            {
                if (!rfLblValueStickyInvis.current)
                    return;

                // Determine if the invisible value label has been pushed outside of the progress bar (i.e. if the offset is negative).
                if (isNegativeOffset(rfLblValueStickyInvis.current, prIsVertical, prIsVerticalTopDown)) // <= -1
                {
                    setLblValueStickyNegOffset(
                        (prev) =>
                        {
                            if (!prev) // If we have yet to detect a negative offset. 
                                return true;
                            else // If we have already detected a negative offset. 
                                return prev;
                        }
                    );
                }
                else
                {
                    setLblValueStickyNegOffset(
                        (prev) =>
                        {
                            if (prev) // If we have yet to detect a positive offset. 
                                return false;
                            else // If we have already detected a positive offset. 
                                return prev;
                        }
                    );
                }
            },
            [ stSliderRange ]
        );

        const lDimensions = useMemo(
            () =>
            {
                // The component's dimensions.
                let lWidth, lHeight;

                // Set lWidth and lHeight, as dependent on prWidth, prHeight, and prIsVertical.
                if (prIsVertical)
                {
                    lWidth = prWidth === undefined ? 40 : prWidth;
                    lHeight = prHeight === undefined ? "100%" : prHeight;
                }
                else
                {
                    lWidth = prWidth === undefined ? "100%" : prWidth;
                    lHeight = prHeight === undefined ? 40 : prHeight;
                }

                return { width: lWidth, height: lHeight }
            },
            [ prIsVertical, prWidth, prHeight ]
        );

        const lStyleCon = useMemo<CSSProperties>(
            () =>
            {
                return {
                    // flexShrink: 0,
                    ...styles.con,
                    border: `1px solid ${prIsActive ? theme.std.slider.borderCon : theme.std.slider.borderConInactive}`, 
                    ...prStyles?.con, 
                    width: lDimensions?.width, 
                    height: lDimensions?.height
                }
            },
            [ prStyles, theme, lDimensions ]
        );

        const lStyleProgressBar = useMemo(
            () =>
            {
                let lBorderColor = prIsActive ? theme.std.slider.borderProgress : theme.std.slider.borderProgressInactive;

                return { 
                    backgroundColor: prIsActive || prUseOverlayInactive ? theme.std.slider.backgroundProgress : theme.std.slider.backgroundProgressInactive, 
                    borderBottom: (prIsVertical && prIsVerticalTopDown) ? `1px solid ${lBorderColor}` : undefined,
                    borderTop: (prIsVertical && !prIsVerticalTopDown) ? `1px solid ${lBorderColor}` : undefined,
                    borderRight: (!prIsVertical) ? `1px solid ${lBorderColor}` : undefined,
                    ...prStyles?.progress,
                    width: prIsVertical ? lDimensions.width : `${stSliderRange}%`,
                    height: prIsVertical ? `${stSliderRange}%` : lDimensions.height,
                }
            },
            [ prStyles, theme, prIsVertical, prIsVerticalTopDown, lDimensions, stSliderRange, prIsActive, prUseOverlayInactive ]
        );

        const lStyleTrack = useMemo(
            () =>
            {
                return { backgroundColor: theme.std.slider.backgroundTrack, ...prStyles?.track }
            },
            [ prStyles, theme ]
        );

        const lStyleText = useMemo(
            () =>
            {
                return { color: prIsActive ? theme.std.slider.font : theme.std.slider.fontInactive, ...prStyles?.text }
            },
            [ prStyles, theme, prIsActive ]
        );

        const lStyleOverlayInactive = useMemo(
            () =>
            {
                return {
                    ...styles.overlayInactive, 
                    backgroundColor: theme.std.slider.overlayInactive, 
                    display: !prIsActive && prUseOverlayInactive ? "block" : "none"
                };
            },
            [ theme, prIsActive, prUseOverlayInactive ]
        );

        // The classes for the label and value labels.
        let lClassNameLblLabel = prIsVertical ? "label lblV" : "label lblH lblLabelH";
        let lClassNameLblValue = prIsVertical ? "label lblV" : "label lblH lblValueH";

        // Add additional classes dependending on the value of prIsVerticalTopDown.
        if (prIsVertical)
        {
            lClassNameLblLabel += prIsVerticalTopDown ? " lblLabelVtTopDown" : " lblLabelVtBottomUp"
            lClassNameLblValue += prIsVerticalTopDown ? " lblValueVtTopDown" : " lblValueVtBottomUp";
        }

        return (
            <div 
                className = "conSliderStd" 
                style = { lStyleCon }
            >

                {/* The DOM element on which the slider is based. */}
                <input 
                    type = "range" ref = { rfSlider } className = { prIsVertical ? "sliderStd sliderStdV" : "sliderStd" }
                    min = { prMin } max = { prMax } step = { prStep }
                    value = { prValue }
                    onInput = { lHandleSliderInput }
                    // @ts-ignore
                    orient = { prIsVertical ? "vertical" : "horizontal" } // FireFox-specific
                    disabled = { !prIsActive }
                />

                {/* The progress bar. */}
                <div 
                    className = { 
                        prIsVertical ? 
                            prIsVerticalTopDown ? 
                                "sliderStdProgress sliderStdProgressVtTopDown" : "sliderStdProgress sliderStdProgressVtBottomUp" : 
                            "sliderStdProgress sliderStdProgressH" 
                    }
                    style = { lStyleProgressBar }
                >
                    {/* The sticky value label. */}
                    {
                        (prShowStickyValue) && (
                            <TextStd 
                                prText = { prValue } prIsBold
                                prIsVertical = { prIsVertical }
                                prClassName = { 
                                    getClassNameLblValueSticky(!stLblValueStickyInvisNegOffset, prIsVertical, prIsVerticalTopDown)
                                }
                                prStyle = { lStyleText }
                            />
                        )
                    }

                    {/* The invisible sticky value label (used to position the sticky value label). */}
                    {
                        (prShowStickyValue) && (
                            <TextStd 
                                prRef = { rfLblValueStickyInvis }
                                prText = { prValue } prIsBold
                                prIsVertical = { prIsVertical }
                                prClassName = { getClassNameLblValueStickyInvis(prIsVertical, prIsVerticalTopDown) }
                                prStyle = { lStyleText }
                            />
                        )
                    }

                    {
                        (prOverlayInactiveJustProgress) && (
                            <div style = { lStyleOverlayInactive }></div>
                        )
                    }

                </div>

                {/* The slider's track/background. */}
                <div className = "sliderStdBackground" style = { lStyleTrack }></div>

                {/* The label that displays the slider's value. */}
                {
                    (prShowValue && !prShowStickyValue) && (
                        <TextStd 
                            prText = { prValue } prIsBold
                            prIsVertical = { prIsVertical }
                            prClassName = { lClassNameLblValue }
                            prStyle = { lStyleText }
                        />
                    )
                }

                {/* The label that displays the slider's label. */}
                {
                    (prShowLabel && !prShowStickyValue) && (
                        <TextStd 
                            prText = { prLabel } prIsBold
                            prIsVertical = { prIsVertical }
                            prClassName = { lClassNameLblLabel }
                            prStyle = { lStyleText }
                        />
                    )
                }

                {
                    (!prOverlayInactiveJustProgress) && (
                        <div style = { lStyleOverlayInactive }></div>
                    )
                }

            </div>
        );
    }
);

const styles : { [key: string]: CSSProperties } = 
{
    con:
    {
        position: "relative",
        overflow: "hidden"
    },
    overlayInactive:
    {
        position: "absolute", left: 0, top: 0,
        width: "100%",
        height: "100%",
    }
};

/**
* Determines the classes of the sticky value label.

* Parameters:
    * @param {boolean} pIsActive - Whether the sticky value label should stick to the end of the progress bar.
    * @param {boolean} pIsVertical - Whether the slider is vertical.
    * @param {boolean} pIsVerticalTopDown - Whether the slider is a 'top-down' vertical slider.

* @returns {string} A string which contains the space-separated classes of the sticky value label.
*/
function getClassNameLblValueSticky(pIsActive : boolean, pIsVertical : boolean, pIsVerticalTopDown : boolean)
{
    let lClassName = "lblValueSticky";

    lClassName +=  pIsVertical ? " lblValueStickyVt" : " lblValueStickyHz";

    if (!pIsActive)
    {
        lClassName += " lblValueStickyInActive"

        if (pIsVertical)
            lClassName += pIsVerticalTopDown ? " lblValueStickyInActiveVtTd" : " lblValueStickyInActiveVtBu";
        else
            lClassName += " lblValueStickyInActiveHz";
    }

    return lClassName;
}

/**
* Determines the classes of the invisible sticky value label.

* Parameters:
    * @param {*} pIsVertical - Whether the slider is vertical.
    * @param {*} pIsVerticalTopDown - Whether the slider is a 'top-down' vertical slider.

* @returns {string} A string which contains the space-separated classes of the invisible sticky value label.
*/
function getClassNameLblValueStickyInvis(pIsVertical : boolean, pIsVerticalTopDown : boolean)
{
    let lClassName = "lblValueSticky lblValueStickyInvis";

    if (pIsVertical)
        lClassName += pIsVerticalTopDown ? " lblValueStickyVt lblValueStickyInvisVtTd" : " lblValueStickyVt lblValueStickyInvisVtBu";
    else
        lClassName += " lblValueStickyHz lblValueStickyInvisHz";

    return lClassName;
}

/**
* This function determines whether the invisible sticky value label has been pushed outside of its parent: i.e. whether
  its relevant offset is negative.

* Parameters:
    * @param {*} pLblValueStickyInvis - A reference to the invisible sticky value label.
    * @param {*} prIsVertical - Whether the slider is vertical.
    * @param {*} prIsVerticalTopDown - Whether the slider is a 'top-down' vertical slider.

* @returns {boolean} Whether the invisible sticky value label has been pushed outside of its parent (i.e. the progress
  bar), which is significed by a negative offset in a specific direction.
*/
function isNegativeOffset(pLblValueStickyInvis : HTMLDivElement | null, prIsVertical : boolean, 
                          prIsVerticalTopDown : boolean)
{
    if (!pLblValueStickyInvis)
        return false;

    let lOffset;

    if (prIsVertical)
    {
        if (prIsVerticalTopDown)
        {
            lOffset = pLblValueStickyInvis.offsetTop;
        }
        else
        {
            // As there's no offsetBottom property, it must be calculated manually.

            if (pLblValueStickyInvis.offsetParent == null)
                return false;

            let lOffsetParent : HTMLElement | null = pLblValueStickyInvis.offsetParent as HTMLElement;

            if (!lOffsetParent)
                return false;

            lOffset = lOffsetParent.offsetHeight - 
                      (pLblValueStickyInvis.offsetTop + pLblValueStickyInvis.offsetHeight);
        }
    }
    else
    {
        lOffset = pLblValueStickyInvis.offsetLeft;
    }

    // Log the offset for testing.
    //console.log(lOffset);

    return lOffset <= 0;
}

export default SliderStd;

export type { StylesSliderStd };
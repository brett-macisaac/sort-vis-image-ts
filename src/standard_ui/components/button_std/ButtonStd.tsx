import React, { useState, useMemo, useCallback, CSSProperties, memo } from "react";

import TextStandard from '../text_std/TextStd';
import { useTheme } from "../../standard_ui";
import { IconFunc, Direction } from "../../types";

/* Planned Features:

* debounce feature.
* allow the icon and text to be placed in all directions relative to one another.
* the icon should instead be a function that takes a size and colour (which should both be props) and returns a 
  ReactNode. This will be better for theming, especially with regards to the navbar and header.
*/

type StylesButtonStd = {
    con?: React.CSSProperties;
    text?: React.CSSProperties;
};

interface PropsButtonStd
{
    prIcon?: IconFunc;
    prIconSize?: number,
    prIconColour?: string,
    prIconLocation?: Direction;
    prText?: string | number;
    prIsBold?: boolean;
    prIsTextVertical?: boolean;
    prOnPress?: (pItem: any | undefined) => void;
    prOnSinglePress?: (pItem: any | undefined) => void;
    prDoubleClick?: boolean;
    prIsOnDown?: boolean;
    prItemOnPress?: any;
    prIsActive?: boolean;
    prUseOverlayInactive?: boolean;
    prStyles?: StylesButtonStd;
    prBorderWidth?: number;
    prIsBorderDisabled?: boolean;
    prRef?: React.RefObject<HTMLDivElement | null>;
}

/**
* A button component.

* @param {React.ReactNode} prIcon The icon.
*/
const ButtonStd = memo(

    function ButtonStd({ prIcon, prIconSize = 20, prIconColour = "", prIconLocation = 'U', prText = "", prIsBold = false, 
                         prIsTextVertical = false, prOnPress, prOnSinglePress, prDoubleClick = false, 
                         prIsOnDown = false, prItemOnPress, prIsActive = true, prUseOverlayInactive = false, prStyles, 
                         prBorderWidth = 1, prIsBorderDisabled = true, prRef } : PropsButtonStd)
    {
        const { theme } = useTheme();

        const [ stPressTimes, setPressTimes ] = useState<number[]>([ 0, 0, 0 ]);

        const [ stIndexPressPrevious, setIndexPressPrevious ] = useState<number>(0);

        /*
        * The function that handles press events.
        */
        const lHandlePress = useCallback(
            () => 
            {
                if (!prIsActive)
                    return;

                if (!prDoubleClick)
                {
                    if (prOnPress)
                        prOnPress(prItemOnPress);
                    return;
                }

                const lTimeCurrent : number = new Date().getTime();

                const lIndexPress : number = stPressTimes.indexOf(0);

                console.log(lIndexPress);

                if (lIndexPress != 0)
                {
                    const lTimeBetweenPresses : number = lTimeCurrent - stPressTimes[lIndexPress - 1];

                    if (lTimeBetweenPresses <= 1500)
                    {
                        if (prOnPress)
                            prOnPress(prItemOnPress);

                        setPressTimes([ 0, 0, 0 ]);
                    }
                    else
                    {
                        setPressTimes(prev => { return [ prev[0], lTimeCurrent, 0 ] });

                        if (prOnSinglePress && lTimeBetweenPresses <= 6000 && stIndexPressPrevious == 0)
                        {
                            prOnSinglePress(prItemOnPress);
                        }
                    }
                }
                else
                {
                    setPressTimes([ lTimeCurrent, 0, 0 ]);
                }

                setIndexPressPrevious(lIndexPress);
            },
            [ prOnPress, prOnSinglePress, prDoubleClick, prIsActive, prItemOnPress ]
        );

        // Determine the particular event to listen for.
        let lPressFunction = useMemo(
            () =>
            {
                let lPressFunctions : { onTouchStart?: () => void, onMouseDown?: () => void,  onClick?: () => void } = { };

                if (prIsOnDown)
                {
                    /*
                    * React has made the onTouchStart event passive, meaning preventDefault cannot be used to prevent the 
                    onMouseDown event from firing. Therefore, they both can't be used simulataneously as in the prototype.
                    */

                    // Whether the device has a touch-screen.
                    const lIsTouchDevice = 'ontouchstart' in window;

                    if (lIsTouchDevice)
                    {
                        lPressFunctions.onTouchStart = lHandlePress;
                    }
                    else
                    {
                        lPressFunctions.onMouseDown = lHandlePress;
                    }
                }
                else
                {
                    lPressFunctions.onClick = lHandlePress;
                }

                return lPressFunctions;
            },
            [ prIsOnDown, lHandlePress ]
        );

        const lStyleCon = useMemo<React.CSSProperties>(
            () =>
            {
                let lColorBorder;
                if (prIsBorderDisabled)
                    lColorBorder = "transparent";
                else 
                    lColorBorder = prIsActive ? theme.std.button.border : theme.std.button?.borderInactive;

                return {
                    ...styles.button,
                    backgroundColor: prIsActive || prUseOverlayInactive ? theme.std.button.background : theme.std.button.backgroundInactive,
                    border: `${prBorderWidth}px solid ${lColorBorder}`,
                    ...prStyles?.con,
                    flexDirection: IconDirToFlexDir(prIconLocation),
                    flexShrink: 0
                };
            },
            [ prStyles, theme, prIsActive, prIsBorderDisabled, prBorderWidth, prIconLocation ]
        );

        const lStyleText = useMemo<React.CSSProperties>(
            () =>
            {
                return {
                    ...styles.textButton, 
                    color: prIsActive || prUseOverlayInactive ? theme.std.button.font : theme.std.button.fontInactive, 
                    ...prStyles?.text
                };
            },
            [ prStyles, theme, prIsActive, prUseOverlayInactive ]
        );

        const lStyleOverlayInactive = useMemo<React.CSSProperties>(
            () =>
            {
                return {
                    ...styles.overlayInactive, 
                    backgroundColor: theme.std.button?.overlayInactive, 
                    display: !prIsActive && prUseOverlayInactive ? "block" : "none"
                };
            },
            [ theme, prIsActive, prUseOverlayInactive ]
        );

        const lIcon = useMemo<React.JSX.Element | undefined>(
            () =>
            {
                if (!prIcon || prIconSize <= 0)
                    return undefined;

                const lColour = prIconColour == "" ? theme.std.button.font : prIconColour;

                return prIcon(prIconSize, lColour);
            },
            [ theme, prIconColour, prIconSize, prIcon ]
        );

        return (
            <div
                { ...lPressFunction }
                style = { lStyleCon }
                ref = { prRef }
            >

                <div style = { lStyleOverlayInactive }></div>

                {/* The button's icon. If present, the icon is placed above text. */}
                { lIcon }

                {/* The button's text. */}
                {
                    prText && (
                        <TextStandard 
                            prText = { prText } 
                            prIsBold = { prIsBold } 
                            prIsVertical = { prIsTextVertical }
                            prStyle = { lStyleText }
                        />
                    )
                }

                {/* Any child elements. */}
                {/* { children } */}

            </div>
        );
    }

);

const styles : { [key: string]: CSSProperties } =
{
    button:
    {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "1em",
        padding: 10,
        position: "relative",
        overflow: "hidden",
        columnGap: 6,//"0.5em", 
        rowGap: "0.5em"
    },
    textButton:
    {
        textAlign: "center" 
    },
    overlayInactive:
    {
        position: "absolute", left: 0, top: 0,
        width: "100%",
        height: "100%",
    }
};

function IconDirToFlexDir(pIconDir : Direction) : "row-reverse" | "column" | "row" | "column-reverse"
{
    if (pIconDir == 'R')
        return "row-reverse";
    else if (pIconDir == 'U')
        return "column";
    else if (pIconDir == 'L')
        return "row";
    else if (pIconDir == 'D')
        return "column-reverse";

    return "column";
}

export default ButtonStd;;

export type { StylesButtonStd }
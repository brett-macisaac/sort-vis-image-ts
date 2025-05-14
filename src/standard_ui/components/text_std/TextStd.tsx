import React, { useMemo, useCallback, useState, useEffect } from "react";

import { useTheme } from "../../standard_ui";

interface PropsTextStd
{
    children?: React.ReactNode;
    prRef?: React.RefObject<HTMLDivElement | null>
    prText?: string | number;
    prIsBold?: boolean;
    prIsItalic?: boolean;
    prStyle?: React.CSSProperties;
    prIsVertical?: boolean;
    prUseVerticalWidthBugFix?: boolean;
    prClassName?: string;
    prOnPress?: (pItem: any | undefined) => void;
    prItemOnPress?: any;
};

function TextStd({ children, prRef, prText = "", prIsBold = false, prIsItalic = false, prStyle = {}, 
                   prIsVertical = false, prUseVerticalWidthBugFix = false, prClassName = "", prOnPress, prItemOnPress }: PropsTextStd)
{
    const { theme } = useTheme();

    const lOnPress = useCallback(
        () =>
        {
            if (prOnPress)
                prOnPress(prItemOnPress);
        },
        [ prOnPress, prItemOnPress ]
    );

    const lStyle = useMemo<React.CSSProperties>(
        () =>
        {
            return { 
                color: theme.std.text.color,
                fontWeight: prIsBold ? 700 : 'normal', 
                fontStyle: prIsItalic ? "italic" : "normal",
                ...prStyle, 
                writingMode: prIsVertical ? "vertical-lr" : "horizontal-tb",
                textOrientation: prIsVertical ? "upright" : undefined,
                letterSpacing: prIsVertical ? 4 : "normal",

                /*
                * There seems to be a bug where prIsVertical changes, which results in the width not being taken into
                  consideration in the calculation of it's container's width. This can be seen by uncommenting this line
                  and looking at how the NavBarStd component resizes when switching screen orientation.
                */
                  width: (prIsVertical && prUseVerticalWidthBugFix) ? "1.1em" : "",
                  boxSizing: (prIsVertical && prUseVerticalWidthBugFix) ? "content-box" : "border-box",
            }
        },
        [ prStyle, theme, prIsBold, prIsItalic, prIsVertical ]
    );

    return (
        <div 
            style = { lStyle } 
            className = { "unselectable " + prClassName }
            onClick = { lOnPress }
            ref = { prRef }
        >
            { prText }
            { children }
        </div>
    );
}

export default TextStd;
import React, { useState, useEffect, useMemo, useCallback, CSSProperties } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ChevronRight from "@mui/icons-material/ChevronRight";
import ChevronLeft from "@mui/icons-material/ChevronLeft";

import TextStd from '../text_std/TextStd';
import { useTheme } from "../../standard_ui";

import "./ComboBoxStd.css";

type StylesComboBoxStd = {
    con?: React.CSSProperties,
    conItems?: React.CSSProperties,
    item?: React.CSSProperties,
    text?: React.CSSProperties,
}

interface PropsComboBoxStd
{
    prItems: string[];
    prTextPlaceholder?: string;
    prIndexSelected?: number;
    prOnPress: (pIndexItem : number) => void;
    prDirection?: 'U' | 'D' | 'L' | 'R';
    prLength?: number | string;
    prMaxLengthItemBox?: number;
    prIconSize?: number;
    prStyles?: StylesComboBoxStd,
    prHideScrollBar?: boolean;
    prIsActive?: boolean;
    prUseOverlayInactive?: boolean;
}

/*
* A customisable button component.

* Props:
    > prTextPlaceholder: the placeholder text
    > prItems: an array of the items that can be selected.
    > prItemSelected: the index of the selected item (negative or greater than max for unselected).
    > prOnPress: the function that is called when the a new selected is made.
    > prMaxLengthItemBox: the maximum size of the drop-down container before scrolling occurs. Doesn't work for 
      horizontal combo-boxes (i.e. when prDirection is 'L' or 'R'); instead, this prop acts as a fixed width.
    > prStyles: 
    > prTheme: An object with the following properties:
        * backgroundColor: the colour of the button's background.
        * borderColor: the colour of the button's borders.
        * fontColor: the colour of the button's text.
*/
function ComboBoxStd({ prItems, prOnPress, prTextPlaceholder = "Select", prIndexSelected = -1, prDirection = "D", 
                       prLength = 200, prMaxLengthItemBox = 200, 
                       prIconSize = 35, prStyles, prHideScrollBar = true, prIsActive = true, 
                       prUseOverlayInactive = false }: PropsComboBoxStd)
{
    const { theme } = useTheme();

    const [ stShowItems, setShowItems ] = useState<boolean>(false);

    useEffect(
        () =>
        {
            if (!prIsActive && stShowItems)
            {
                setShowItems(false);
            }
        },
        [ prIsActive ]
    );

    const lOnPress = useCallback(
        () =>
        {
            if (!prIsActive)
                return;

            setShowItems(prev => { return !prev; });
        },
        [ prIsActive ]
    );

    const lOnPressItem = useCallback(
        (pIndexItem : number) =>
        {
            prOnPress(pIndexItem);
        },
        []
    );

    const lNoSelection = useMemo(
        () =>
        {
            return prIndexSelected < 0 || prIndexSelected >= prItems.length;
        },
        [ prIndexSelected, prItems ]
    );

    // Whether the items are displayed vertically (i.e. the items 'drop down' vertically).
    const lIsVertical = useMemo(
        () =>
        {
            return prDirection == 'U' || prDirection == 'D';
        },
        [ prDirection ]
    );

    let lClassesConItems = "conCmbBoxItems";
    let lClassesCon = "conCmbBox";

    if (prHideScrollBar)
        lClassesConItems += " hideScrollBar";

    if (lIsVertical)
    {
        lClassesCon += " conCmbBoxVertical";

        lClassesConItems += " conCmbBoxItemsVertical";

        if (prDirection == 'D')
            lClassesConItems += " conCmbBoxItemsDown";
        else
            lClassesConItems += " conCmbBoxItemsUp";
    }
    else
    {
        lClassesCon += " conCmbBoxHorizontal";

        lClassesConItems += " conCmbBoxItemsHorizontal";

        if (prDirection == 'L')
            lClassesConItems += " conCmbBoxItemsLeft";
        else
            lClassesConItems += " conCmbBoxItemsRight";
    }

    const lStyleCon = useMemo<CSSProperties>(
        ()  =>
        {
            // Whether the items are displayed vertically (i.e. the items 'drop down' vertically).
            // let lIsVertical = prDirection == 'U' || prDirection == 'D';

            const lStyle : CSSProperties = {
                flexDirection: lIsVertical ? "row" : "column-reverse", 
                border: `1px solid ${prIsActive ? theme.std.comboBox.border : theme.std.comboBox.borderInactive}`, 
                color: theme.std.comboBox.font,
                backgroundColor: prIsActive || prUseOverlayInactive ? theme.std.comboBox.background : theme.std.comboBox.backgroundInactive,
                alignSelf: "center"
                // overflow: "hidden"
            };

            if (lIsVertical)
                lStyle.width = prLength;
            else
                lStyle.height = prLength;

            return {
                ...lStyle,
                ...prStyles?.con
            };
        },
        [ prStyles, theme, prDirection, prLength, lIsVertical, prIsActive, prUseOverlayInactive ]
    );

    const lStyleConItems = useMemo<CSSProperties>(
        () =>
        {
            // Whether the items are displayed vertically (i.e. the items 'drop down' vertically).
            // let lIsVertical = prDirection == 'U' || prDirection == 'D';

            const lStyle : CSSProperties = {
                backgroundColor: theme.std.comboBox.backgroundItems, 
                flexDirection: lIsVertical ? "column" : "row", 
            };

            if (lIsVertical)
            {
                // For some reason 'width: 100%' in CSS doesn't include the parents' borders, so this is necessary for now.
                lStyle.width = prLength;

                lStyle.maxHeight = prMaxLengthItemBox;
            }
            else
            {
                lStyle.height = "100%";//prLength;

                // Should be 'maxWidth' but that isn't working.
                lStyle.width = prMaxLengthItemBox;
            }

            return {
                ...lStyle,
                ...prStyles?.conItems
            };
        },
        [ prStyles, theme, prDirection, prMaxLengthItemBox, prLength, lIsVertical ]
    );

    const lStyleConText = useMemo<CSSProperties>(
        () =>
        {
            let lColor = "";
            if (prIsActive || prUseOverlayInactive)
                lColor = lNoSelection ? theme.std.comboBox.fontPlaceholder : theme.std.comboBox.font;
            else
                lColor = lNoSelection ? theme.std.comboBox.fontPlaceholderInactive : theme.std.comboBox.fontInactive;

            return {
                color: lColor,
                overflowX: "scroll",
                ...prStyles?.text
            };
        },
        [ prStyles, theme, prDirection, prLength, lNoSelection, prIsActive, prUseOverlayInactive ]
    );

    const lStyleConItemsText = useMemo<CSSProperties>(
        () =>
        {
            return {
                color: theme.std.comboBox.font,
                borderBottom: lIsVertical ? `1px solid ${theme.std.comboBox.border}` : undefined,
                borderRight: !lIsVertical ? `1px solid ${theme.std.comboBox.border}` : undefined,
                ...prStyles?.item
            };
        },
        [ prStyles, theme, lIsVertical ]
    );

    const lStyleSpacer = useMemo<CSSProperties>(
        () =>
        {
            return { 
                backgroundColor: "transparent"//theme.std.comboBox.backgroundItems
            };
        },
        [ theme ]
    );

    const lStyleOverlayInactive = useMemo<CSSProperties>(
        () =>
        {
            return {
                ...styles.overlayInactive, 
                backgroundColor: theme.std.comboBox.overlayInactive, 
                borderRadius: prStyles?.con?.borderRadius,
                display: !prIsActive && prUseOverlayInactive ? "block" : "none"
            };
        },
        [ prStyles, theme, prIsActive, prUseOverlayInactive ]
    );

    return (
        <div
            style = { lStyleCon }
            className = { lClassesCon }
            onClick = { lOnPress }
        >

            {/* The text displayed in the main container (either placeholder or selected item). */}
            <TextStd 
                prText = { 
                    (lNoSelection) ? prTextPlaceholder : prItems[prIndexSelected] 
                } 
                prStyle = { lStyleConText }
                prIsBold
                prIsVertical = { !lIsVertical }
                prClassName = "hideScrollBar"
            />

            {/* The show more/less icon */}
            <ComboBoxArrow 
                prDirection = { prDirection }
                prShowItems = { stShowItems && prIsActive }
                prColour = { prIsActive || prUseOverlayInactive ? theme.std.comboBox.iconArrow : theme.std.comboBox.iconArrowInactive }
                prIconSize = { prIconSize }
            />

            {/* The list of items. */}
            {
                stShowItems && (
                    <div
                        style = { lStyleConItems }
                        className = { lClassesConItems }
                    >
                        {
                            prItems.map(
                                (item, index) =>
                                {
                                    return (
                                        <TextStd 
                                            key = { index }
                                            prText = { item } 
                                            prStyle = { lStyleConItemsText }
                                            prClassName = { lIsVertical ? "cmbBoxItemVertical" : "cmbBoxItemHorizontal" }
                                            prIsVertical = { !lIsVertical }
                                            prOnPress = { lOnPressItem }
                                            prItemOnPress = { index }
                                        >
                                            {/* This div is used to block any text that overflows. Without it the text 
                                                runs right to the edge, which doesn't look nice. */}
                                            <div 
                                                style = { lStyleSpacer } 
                                                className = { lIsVertical ? "cmbBoxItemSpacerVertical" : "cmbBoxItemSpacerHorizontal" }
                                            >
                                            </div>
                                        </TextStd>
                                    );
                                }
                            )
                        }
                    </div>
                )
            }

            <div style = { lStyleOverlayInactive }></div>

        </div>
    );
}

const styles : { [key: string]: CSSProperties } =
{
    overlayInactive:
    {
        position: "absolute", left: 0, top: 0,
        width: "100%",
        height: "100%",
    }
};

interface PropsComboBoxArrow
{
    prDirection: string,
    prShowItems: boolean,
    prIconSize: number,
    prColour: string
}

function ComboBoxArrow({ prDirection, prShowItems, prIconSize, prColour }: PropsComboBoxArrow)
{
    if (prDirection == 'D')
    {
        return prShowItems ? <ExpandLessIcon sx = {{ color: prColour, fontSize: prIconSize }} /> : 
                             <ExpandMoreIcon sx = {{ color: prColour, fontSize: prIconSize }} />;
    }
    else if (prDirection == 'U')
    {
        return prShowItems ? <ExpandMoreIcon sx = {{ color: prColour, fontSize: prIconSize }} /> : 
                             <ExpandLessIcon sx = {{ color: prColour, fontSize: prIconSize }} />;
    }
    else if (prDirection == 'L')
    {
        return prShowItems ? <ChevronRight sx = {{ color: prColour, fontSize: prIconSize }} /> : 
                             <ChevronLeft sx = {{ color: prColour, fontSize: prIconSize }} />;
    }
    else
    {
        return prShowItems ? <ChevronLeft sx = {{ color: prColour, fontSize: prIconSize }} /> : 
                             <ChevronRight sx = {{ color: prColour, fontSize: prIconSize }} />;
    }
}

export default ComboBoxStd;

export type { StylesComboBoxStd };
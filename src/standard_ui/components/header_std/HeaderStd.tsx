import React, { useMemo, memo, CSSProperties, ReactElement, useCallback, JSX } from "react";
import { useNavigate } from 'react-router-dom';

import { NavButtonProps, PopUpProps, IconFuncMultiColour, Orientation } from '../../types';
import { useTheme, ButtonStd, StylesButtonStd } from "../../standard_ui";

type StylesHeaderStd =
{
    con: CSSProperties;
}

interface PropsHeaderStd
{
    prButtonsLeft?: NavButtonProps[];
    prButtonsRight?: NavButtonProps[];
    prStyles?: StylesHeaderStd;
    prLogo?: IconFuncMultiColour;
    prIconSize?: number;
    prOrientation?: Orientation;
    prShowPopUpFunc?: (pPopUpProps : PopUpProps) => void;
};

/**
* A header component.

* Props:
    @param prButtonsLeft The header icons that displayed on the left side.
    @param prButtonsRight The header icons that displayed on the right side.
    @param prStyles The styles that can be applied.
    @param prIconSize The size of the icons
    @param prShowPopUpFunc The function used to show a pop-up warning when a button is clicked. A button must be 
    configured for the pop-up to display.
*/
const HeaderStd = memo(

    function HeaderStd({ prButtonsLeft, prButtonsRight, prStyles, prLogo, prIconSize = 25, prOrientation = "Horizontal",
                         prShowPopUpFunc } : PropsHeaderStd)
    {
        const navigate = useNavigate();

        const { theme } = useTheme();

        const lOnPress = useCallback(
            (pNavButtonProps : NavButtonProps) =>
            {
                const lPerformNavigation = () =>
                {
                    if (pNavButtonProps.destination)
                        navigate(pNavButtonProps.destination);
                    else
                        navigate(-1);
                };

                if (pNavButtonProps.showConfirmPopUp && prShowPopUpFunc)
                {
                    const lTitlePopUp : string = pNavButtonProps.titleConfirmPopUp ? pNavButtonProps.titleConfirmPopUp : "Are You Sure?";

                    const lMessagePopUp : string = pNavButtonProps.messageConfirmPopUp ? pNavButtonProps.messageConfirmPopUp : "If you leave this page you may lose data that you've entered.";

                    prShowPopUpFunc(
                        {
                            title: lTitlePopUp,
                            message: lMessagePopUp,
                            buttons: [
                                { text: "Continue", onPress: lPerformNavigation },
                                { text: "Cancel" },
                            ]
                        }
                    )
                }
                else
                {
                    lPerformNavigation();
                }
            },
            []
        );

        const lStyleCon = useMemo<CSSProperties>(
            () =>
            {
                const lIsHorizontal : boolean = prOrientation == "Horizontal";

                return { 
                    flexDirection: lIsHorizontal ? "row" : "column-reverse",
                    alignItems: "center", 
                    // justifyContent: "center",
                    minHeight: lIsHorizontal ? 60 : 0,
                    minWidth: !lIsHorizontal ? 60 : 0,
                    height: lIsHorizontal ? "auto" : "100%",
                    width: lIsHorizontal ? "100%" : 1,
                    // ...styles.container,
                    backgroundColor: theme.std.header.background, 
                    borderBottom: lIsHorizontal ? `1px solid ${theme.std.header.border}` : "none", 
                    borderRight: !lIsHorizontal ? `1px solid ${theme.std.header.border}` : "none", 
                    ...prStyles?.con
                }
            },
            [ theme, prStyles, prOrientation ]
        );

        const lStyleConLeft = useMemo<CSSProperties>(
            () =>
            {
                const lIsHorizontal : boolean = prOrientation == "Horizontal";

                return { 
                    width: lIsHorizontal ? 1 : "auto",
                    height: !lIsHorizontal ? 1 : "auto",
                    flexGrow: 1,
                    flexDirection: lIsHorizontal ? "row" : "column",
                    // ...styles.sideContainer, 
                    justifyContent: lIsHorizontal ? "flex-start" : "flex-end"
                    // ...styles.leftContainer 
                };
            },
            [ prOrientation ]
        );

        const lStyleConRight = useMemo<CSSProperties>(
            () =>
            {
                const lIsHorizontal : boolean = prOrientation == "Horizontal";

                return { 
                    width: lIsHorizontal ? 1 : "auto",
                    height: !lIsHorizontal ? 1 : "auto",
                    flexGrow: 1,
                    flexDirection: lIsHorizontal ? "row" : "column",
                    // ...styles.sideContainer, 
                    justifyContent: lIsHorizontal ? "flex-end" : "flex-start"
                    // ...styles.rightContainer 
                };
            },
            [ prOrientation ]
        );

        const lLogo = useMemo<JSX.Element | undefined>(
            () =>
            {
                if (!prLogo)
                    return undefined;

                return prLogo(prIconSize, theme.std.header.logoColours);
            },
            [ theme, prLogo ]
        );

        return (
            <div 
                style = { lStyleCon }
            >

                <div style = { lStyleConLeft }>
                    {
                        prButtonsLeft && prButtonsLeft.map(
                            (pButton, pIndex) =>
                            {
                                return (
                                    <ButtonStd 
                                        key = { pIndex }
                                        prIcon = { pButton.icon }
                                        prOnPress = { lOnPress }
                                        prItemOnPress= { pButton }
                                        prIconSize = { prIconSize }
                                        prStyles = { gStyleButtons }
                                    />
                                )
                            }
                        )
                    }
                </div>

                { lLogo && lLogo }

                <div style = { lStyleConRight }>
                    {
                        prButtonsRight && prButtonsRight.map(
                            (pButton, pIndex) =>
                            {
                                return (
                                    <ButtonStd 
                                        key = { pIndex }
                                        prIcon = { pButton.icon }
                                        prOnPress = { lOnPress }
                                        prItemOnPress= { pButton }
                                        prIconSize = { prIconSize }
                                        prStyles = { gStyleButtons }
                                    />
                                )
                            }
                        )
                    }
                </div>

            </div>
        );
    }

);

const gStyleButtons : StylesButtonStd =
{
    con: 
    {
        backgroundColor: "transparent",
        borderRadius: 0,
        padding: 5
    }
};

const styles : { [key: string]: CSSProperties } =
{
    container: 
    {
        //flex: 1,
        //width: "100%",
        flexDirection: "row",
        alignItems: "center",
        minHeight: 60,
        width: "100%"
    },
    sideContainer: 
    {
        width: 1,
        flexGrow: 1,
        flexDirection: "row",
    },
    leftContainer:
    {
        justifyContent: "flex-start",
    },
    rightContainer:
    {
        justifyContent: "flex-end",
    },
    conLogo:
    {
        justifyContent: "center", 
        alignItems: "center", 
        padding: 5,
        width: 35, height: 35
    }
};

export default HeaderStd;

export type { StylesHeaderStd };
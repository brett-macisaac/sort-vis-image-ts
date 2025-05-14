import React, { useMemo, memo, CSSProperties, useCallback } from "react";
import { useNavigate } from 'react-router-dom';

import { NavButtonProps, Orientation } from '../../types';
import { useTheme, ButtonStd, StylesButtonStd } from "../../standard_ui";

type StylesNavBarStd =
{
    conInner: CSSProperties;
    conOuter: CSSProperties;
}

interface PropsNavBarStd
{
    prButtons?: NavButtonProps[];
    prStyles?: StylesNavBarStd;
    prIconSize?: number;
    prOrientation?: Orientation;
};

const NavBarStd = memo(

    function NavBarStd({ prButtons, prStyles, prIconSize = 25, prOrientation = "Horizontal" } : PropsNavBarStd)
    {
        const navigate = useNavigate();

        const { theme } = useTheme();

        const lOnPress = useCallback(
            (pNavButtonProps : NavButtonProps) =>
            {
                if (pNavButtonProps.destination)
                {
                    if (!window.location.pathname.includes(pNavButtonProps.destination))
                        navigate(`/${pNavButtonProps.destination}`);
                }
                else
                {
                    navigate(-1);
                }
            },
            []
        );

        const lStyleConInner = useMemo<React.CSSProperties>(
            () =>
            {
                const lIsHorizontal : boolean = prOrientation == "Horizontal";

                return {
                    flexDirection: lIsHorizontal ? "row" : "column-reverse",
                    flexShrink: 0,
                    alignItems: "stretch",
                    minHeight: lIsHorizontal ? 60 : 0,
                    minWidth: !lIsHorizontal ? 0 : 0,
                    height: lIsHorizontal ? "auto" : "100%",
                    // width: "100%",
                    // ...styles.container,
                    backgroundColor: theme.std.navBar.background,
                    // borderTop: lIsHorizontal ? `1px solid ${theme.std.navBar.border}` : "none",
                    // borderLeft: !lIsHorizontal ? `1px solid ${theme.std.navBar.border}` : "none",
                    ...prStyles?.conInner
                }
            },
            [ theme, prStyles, prOrientation ]
        );

        const lStyleConOuter = useMemo(
            () =>
            {
                const lIsHorizontal : boolean = prOrientation == "Horizontal";

                return {
                    width: lIsHorizontal ? "100%" : "",
                    height: lIsHorizontal ? "auto" : "100%",
                    // padding: 10,
                    ...prStyles?.conOuter
                }
            },
            [ prStyles, prOrientation ]
        );

        // const lStyleButton : StylesButtonStd = useMemo(
        //     () =>
        //     {
        //         return {
        //             con:
        //             {
        //                 backgroundColor: "transparent",
        //                 borderRadius: 0,
        //                 padding: 5
        //             },
        //             text: {
        //                 color: theme.std.navBar.button.fontActive
        //             }
        //         }
        //     },
        //     [ theme, prStyles ]
        // );

        return (
            <div style = { lStyleConOuter }>
                <div
                    style = { lStyleConInner }
                >
                    {
                        prButtons && prButtons.map(
                            (pButton, pIndex) =>
                            {
                                const lIsActive : boolean = pButton.destination != undefined && window.location.pathname.includes(pButton.destination);

                                const lIsHorizontal : boolean = prOrientation == "Horizontal";

                                const lBorderString : string = `1px solid ${lIsActive ? theme.std.navBar.border : theme.std.navBar.button.iconInactive}`;

                                return (
                                    <ButtonStd
                                        key = { pIndex }
                                        prText = { pButton.text }
                                        prIcon = { pButton.icon }
                                        prIconColour = { lIsActive ? theme.std.navBar.button.iconActive : theme.std.navBar.button.iconInactive }
                                        prOnPress = { lOnPress }
                                        prItemOnPress= { pButton }
                                        prIconSize = { prIconSize }
                                        prStyles = {
                                            {
                                                con:
                                                {
                                                    borderTop: lIsHorizontal ? lBorderString : "none",
                                                    borderLeft: !lIsHorizontal ? lBorderString : "none",
                                                    backgroundColor: "transparent",
                                                    borderRadius: 0,
                                                    padding: 6,
                                                    flexGrow: 1,
                                                    rowGap: 1, columnGap: 4
                                                },
                                                text: {
                                                    color: lIsActive ? theme.std.navBar.button.fontActive : theme.std.navBar.button.fontInactive,
                                                    fontSize: 12,
                                                }
                                            }
                                        }
                                        prIsBold = { lIsActive }
                                        prIsTextVertical = { prOrientation == "Vertical" }
                                        prIconLocation = { prOrientation == "Vertical" ? "L" : "U" }
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

const styles : { [key: string]: CSSProperties } =
{
    container:
    {
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

export default NavBarStd;

export type { StylesNavBarStd };
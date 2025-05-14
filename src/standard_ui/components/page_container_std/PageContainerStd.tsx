import React, { useState, useEffect, useCallback, useMemo, memo, CSSProperties } from 'react';
// import { useNavigate } from 'react-router-dom';

import { NavButtonProps, PopUpProps, IconFuncMultiColour } from '../../types';
import { useTheme, useWindowSize, LoadAreaStd, PopUpStd, HeaderStd, StylesHeaderStd, StylesNavBarStd, NavBarStd } from "../../standard_ui";

// import HeaderStd from '../header_std/HeaderStd.jsx';
// import NavBarStd from '../nav_bar_std/NavBarStd.jsx';
// import NavBarSingleStd from '../nav_bar_single_std/NavBarSingleStd.jsx';
// import PopUpStd from '../pop_up_std/PopUpStd.jsx';
// import LoadAreaStd from '../loading_area_std/LoadAreaStd.jsx';

// Make the prNavigate a function which takes in a string; don't make PageContainer depend on the react-router library.

type StylesPageContainerStd = {
    con?: React.CSSProperties;
    header?: StylesHeaderStd;
    navBar?: StylesNavBarStd;
};

interface PropsPageContainer
{
    prIsLoading?: boolean;
    prIsLoadingSolid?: boolean;
    prShowHeader?: boolean;
    prShowNavBar?: boolean;
    prHeaderButtonsLeft?: NavButtonProps[];
    prHeaderButtonsRight?: NavButtonProps[];
    prNavBarButtons?: NavButtonProps[];
    prPopUpProps?: PopUpProps;
    // prButtonNavBarText?: string;
    prStyles?: StylesPageContainerStd;
    prIconSizeHeader?: number;
    prIconSizeNavBar?: number;
    prLogo?: IconFuncMultiColour;
    children?: React.ReactNode;
}

/**
* This is the parent component of every page, meaning that it should wrap every page of the application.
* Expected Behaviour: if the supplied children elements do not fill the entire vertical space between the header and 
  footer, the container is expected to take 100% of this space. This is ideal because one may want to center the content
  vertically, such as on a log-in screen, where the input fields are typically centered.

* Props:
    * @param {object} prStyles - An object in which to include styling objects for the page's content container (.con), 
*/
const PageContainerStd = memo(

    function PageContainerStd({ prIsLoading = false, prIsLoadingSolid = false, prShowHeader = true, prShowNavBar = true, 
                                prHeaderButtonsLeft, prHeaderButtonsRight, prNavBarButtons, prPopUpProps, prStyles, 
                                prIconSizeHeader = 40, prIconSizeNavBar = 40,
                                prLogo, children } : PropsPageContainer)
    {
        // const navigate = useNavigate();

        const { theme } = useTheme();

        const cxWindowSize = useWindowSize();

        // The object that defines the contents of the pop-up message.
        const [ stPopUpProps, setPopUpProps ] = useState<PopUpProps | undefined>(undefined);

        const [ stVertical, setVertical ] = useState<boolean>(true);

        // Whether the (onscreen) keyboard is displayed.
        // const [ stIsKeyboardActive, setIsKeyboardActive ] = useState(false);

        /*
        * Show/hide the pop-up message.
        */
        useEffect(
            () =>
            {
                if (!prPopUpProps)
                    setPopUpProps(undefined);
                else
                    setPopUpProps(prPopUpProps);
            },
            [ prPopUpProps ]
        );

        useEffect(
            () =>
            {
                if (cxWindowSize == null)
                    return;

                setVertical(!cxWindowSize.isLandscape || cxWindowSize.isBigScreen);
            },
            [ cxWindowSize ]
        );

        const lShowPopUp = useCallback(
            (pPopUpProps : PopUpProps) =>
            {
                setPopUpProps(pPopUpProps);
            },
            []
        );

        const lRemovePopUp = useCallback(
            () =>
            {
                setPopUpProps(undefined);
            },
            []
        );

        const lStyleCon = useMemo<CSSProperties>(
            () =>
            {
                return { 
                    flex: 1,
                    overflow: 'hidden',
                    flexDirection: stVertical ? "column" : "row",
                    // alignItems: "center", 
                    // justifyContent: "center",
                    position: "relative",
                    // ...styles.container, 
                    backgroundColor: theme.std.pageContainer.background 
                }
            },
            [ theme, stVertical ]
        );

        const lStyleConInner = useMemo<CSSProperties>(
            () =>
            {
                return { 
                    flexGrow: 1,
                    flexDirection: "column",
                    // alignItems: "center",
                    overflowX: "hidden",
                    overflowY: "scroll",
                    width: "100%",
                    height: stVertical ? "auto" : "100%",
                    padding: 20,
                    // ...styles.content, 
                    ...prStyles?.con, 
                    backgroundColor: theme.std.pageContainer.background
                }
            },
            [ prStyles, theme, stVertical ]
        );

        return ( 
            <div style = { lStyleCon }>

                {
                    prShowHeader && (
                        <HeaderStd 
                            prButtonsLeft = { prHeaderButtonsLeft }
                            prButtonsRight = { prHeaderButtonsRight }
                            // prSetOptionsPopUpMsg = { setOptionsPopUpMsg }
                            prStyles = { prStyles?.header } prIconSize = { prIconSizeHeader }
                            prOrientation = { stVertical ? "Horizontal" : "Vertical" }
                            prLogo = { prLogo }
                            prShowPopUpFunc = { lShowPopUp }
                        />
                    )
                }

                <div 
                    className = "hideScrollBar"
                    style = { lStyleConInner }
                > 
                    { children }
                </div>

                {
                    (prShowNavBar && prNavBarButtons != null && prNavBarButtons.length > 0) && (
                        <NavBarStd
                            prButtons = { prNavBarButtons }
                            prStyles = { prStyles?.navBar } 
                            prIconSize = { prIconSizeNavBar }
                            prOrientation = { stVertical ? "Horizontal" : "Vertical" }
                        />
                    )
                }

                {
                    (stPopUpProps) && 
                        <PopUpStd 
                            prTitle = { stPopUpProps.title }
                            prMessage = { stPopUpProps.message }
                            prButtons = { stPopUpProps.buttons }
                            prDismissable = { stPopUpProps.dismissable }
                            prId = { stPopUpProps.id }
                            prFuncRemovePopUp = { lRemovePopUp } 
                        />
                }

                <LoadAreaStd 
                    prIsActive = { prIsLoading }
                    prIsTranslucent = { !prIsLoadingSolid }
                />

            </div>
        );
    }

)

const styles : { [key: string]: React.CSSProperties } = 
{
    container:
    {
        flex: 1,
        overflow: 'hidden',
        flexDirection: "column",
        alignItems: "center",
        position: "relative"
    },
    content: 
    {
        flexGrow: 1,
        flexDirection: "column",
        alignItems: "center",
        overflowX: "hidden",
        overflowY: "scroll",
        width: "100%",
        padding: 20
    }
}

export default PageContainerStd;

export type { StylesPageContainerStd }
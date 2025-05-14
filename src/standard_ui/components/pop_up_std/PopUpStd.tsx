import React, { useState, useEffect, useMemo, useCallback, memo, CSSProperties } from "react";

import TextStd from '../text_std/TextStd';
import ButtonStd, { StylesButtonStd } from '../button_std/ButtonStd';
// import CheckBoxStd from '../check_box_std/CheckBoxStd';
import utils from '../../utils';
import { useTheme } from "../../standard_ui";
import { PopUpButtonProps, PopUpProps } from '../../types';

type StylesPopUpStd = {
    background?: React.CSSProperties;
    con?: React.CSSProperties;
    title?: React.CSSProperties;
    message?: React.CSSProperties;
    button?: StylesButtonStd;
};

interface PropsPopUpStd
{
    prTitle: string;
    prMessage: string;
    prButtons: PopUpButtonProps[];
    prFuncRemovePopUp: () => void;
    prDismissable?: boolean;
    prId?: string;
    prShowNeverShowAgainCheckbox?: boolean;
    prStyles?: StylesPopUpStd
    // prStylesCheckBox: ...
}

/*
* A pop-up message component.

* Props:
    > prTitle: the pop-up's title.
    > prMessage: the pop-up's message.
    > prButtons: the pop-up's buttons. This should be an array of objects. Each object should have two properties: text
      (string) and onPress (function). The button's 'text' is required, but 'onPress' is not.
    > prRemovePopUp: the function that contains the logic to remove the pop-up.
    > prDismissable: a boolean that, when true, indicates that the pop-up can be dismissed by clicking off it. This should
      be false if you want the user to click one of the buttons.
    > prId: the ID of the pop-up. This is an optional prop. If the pop-up's ID is on the 'blacklist', the pop-up is not 
      displayed. An ID can be added to the blacklist by the user checking the 'never show again' checkbox, which can be 
      displayed by setting showNeverShowAgainCheckbox to true.
    > prShowNeverShowAgainCheckbox: whether to display the 'never show again' checkbox. The 'id' prop must also be set for
      the checkbox to display.

    TODO: add a prStyles prop, much like the CheckBox component. Include buttons, background, con, etc
*/

const PopUpStd = memo(

    function PopUpStd({ prTitle, prMessage, prButtons, prFuncRemovePopUp, prDismissable = true, prId, 
                        prShowNeverShowAgainCheckbox = false, prStyles } : PropsPopUpStd)
    {
        const { theme } = useTheme();

        // An array of IDs that correspond to pop-ups that can no longer be displayed.
        const [ stBlackList, setBlackList ] = useState<string[]>([]);

        // Whether the user pressed the checkbox to blacklist the pop-up message.
        const [ stBlackListedByCheckBox, setBlackListedByCheckBox ] = useState<boolean>(false);

        /*
        * Set the blacklist to the one stored locally on the user's device.
        */
        useEffect(
            () =>
            {
                // A function that retrieves the blacklist stored in local storage.
                const getAndSetBlackList = async function() 
                {
                    const lBlackList : string[] | undefined = await utils.getFromLocalStorage(gLclStrgKeyPopUpBlackList);

                    if (lBlackList)
                        setBlackList(lBlackList);
                };

                getAndSetBlackList();
            },
            []
        );

        const handlePressNeverShowAgain = useCallback(
            () =>
            {
                const lIsBlacklisted = prId && stBlackList.includes(prId);

                let lBlackListNew : string[];

                if (lIsBlacklisted)
                {
                    lBlackListNew = stBlackList.filter((ID) => ID != prId);
                }
                else
                {
                    lBlackListNew = prId ? [ ...stBlackList, prId ] : [ ...stBlackList ];

                    // lBlackListNew.push(prId);

                    setBlackListedByCheckBox(true);
                }

                setBlackList(lBlackListNew);

                utils.setInLocalStorage(gLclStrgKeyPopUpBlackList, lBlackListNew);
            },
            [ stBlackList ]
        );

        const lHandleClickCon = useCallback(
            (e : React.MouseEvent<HTMLDivElement, MouseEvent>) =>
            {
                e.stopPropagation();
            },
            []
        );

        const lHandleClickBackground = useCallback(
            (e : React.MouseEvent<HTMLDivElement, MouseEvent>) =>
            {
                e.stopPropagation();

                if (prDismissable)
                    prFuncRemovePopUp();
            },
            []
        );

        const lStyleConBackground = useMemo<React.CSSProperties>(
            () =>
            {
                return {
                    ...styles.background,
                    backgroundColor: theme.std.popUp.backgroundTransparent,
                    ...prStyles?.background
                };
            },
            [  theme ]
        );

        const lStyleCon = useMemo<React.CSSProperties>(
            () =>
            {
                return {
                    backgroundColor: theme.std.popUp.background,
                    color: theme.std.popUp.font,
                    border: `1px solid ${theme.std.popUp.border}`,
                    ...styles.con,
                    ...prStyles?.con
                };
            },
            [ theme ]
        );

        const lStyleTitle = useMemo<React.CSSProperties>(
            () =>
            {
                return {
                    font: theme.std.popUp.font,
                    ...styles.title,
                    ...prStyles?.title,
                };
            },
            [ theme ]
        );

        const lStyleMessage = useMemo<React.CSSProperties>(
            () =>
            {
                return {
                    font: theme.std.popUp.font,
                    ...styles.message,
                    ...prStyles?.message,
                };
            },
            [ theme ]
        );

        const lStyleButton = useMemo<StylesButtonStd>(
            () =>
            {
                return {
                    con:
                    {
                        ...styles.button,
                        backgroundColor: theme.std.popUp.buttonBackgroundColor,
                        border: `1px solid ${theme.std.popUp.buttonBorderColor}`,
                        ...prStyles?.button
                    },
                    text:
                    {
                        color: theme.std.popUp.buttonFontColor,
                    }
                };
            },
            [ theme ]
        );

        // Don't display if the pop-up has been black-listed.
        if (!(prId ? (!stBlackList.includes(prId) || stBlackListedByCheckBox) : true))
        {
            return null;
        }

        return (
            <div
                onClick = { lHandleClickBackground }
                style = { lStyleConBackground }
            >
                <div
                    onClick = { lHandleClickCon }
                    style = { lStyleCon }
                >
                    {/* Title */}
                    <TextStd prText = { prTitle } prIsBold prStyle = { lStyleTitle } />

                    {/* Message */}
                    <TextStd prText = { prMessage } prStyle = { lStyleMessage } />

                    {/* Buttons */}
                    {
                        prButtons.map(
                            (button, index) =>
                            {
                                return (
                                    <ButtonStd 
                                        prText = { button.text } 
                                        prIsBold
                                        prOnPress = { 
                                            () => 
                                            { 
                                                prFuncRemovePopUp();

                                                if (button.onPress) 
                                                    button.onPress(); 
                                            }
                                        }
                                        prStyles = { lStyleButton }
                                        key = { index }
                                    />
                                )
                            }
                        )
                    }

                    {/* {
                        (prShowNeverShowAgainCheckbox && prId) && (
                            <CheckBoxStd 
                                prText = "Never Show Again"
                                prIsChecked = { stBlackList.includes(prId) }
                                prOnPress = { handlePressNeverShowAgain }
                                prStyles = { prStylesCheckBox }
                                prTheme = { prTheme.checkBox }
                            />
                        )
                    } */}
                </div>

            </div>
        );
    }

);

const styles : { [key: string]: CSSProperties } =
{
    background:
    {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center", 
        flex: 1,
        width: "100%",
        height: "100%",
        paddingLeft: 10, paddingRight: 10
        // paddingLeft: utilsGlobalStyles.spacingN(-1),
        // paddingRight: utilsGlobalStyles.spacingN(-1),
    },
    con: 
    {
        flexDirection: "column",
        maxWidth: 550,
        width: window.innerWidth * 0.8,
        rowGap: 15, padding: 15,
        // rowGap: utilsGlobalStyles.spacingN(-1),
        // padding: utilsGlobalStyles.fontSizeN(),
        borderRadius: 10
    },
    title:
    {
        fontSize: 17
    },
    message:
    {
        fontSize: 15
    },
    button:
    {
        paddingTop: "0.75em", paddingBottom: "0.75em",
        // paddingTop: utilsGlobalStyles.fontSizeN() / 2,
        // paddingBottom: utilsGlobalStyles.fontSizeN() / 2,
        borderRadius: 10
    }
};

function PopUpOk(title : string, message : string, dismissable : boolean = true, id: string = "") : PopUpProps
{
    return {
        title: title,
        message: message,
        buttons: [
            { text: "OK" }
        ],
        dismissable: dismissable,
        id: id
    }
}

function CopyPopUpProps(pPopUpProps : PopUpProps) : PopUpProps
{
    return {
        title: pPopUpProps.title,
        message: pPopUpProps.message,
        buttons: pPopUpProps.buttons,
        dismissable: pPopUpProps.dismissable,
        id: pPopUpProps.id
    };
}

/*
* A localStorage key whose value is an array of IDs (strings) which refer to the pop-up messages that can no longer
  be displayed. A pop-up usually makes it to this 'blacklist' when the user selects the 'Do Not Show Again' checkbox
  when the pop-up annoys them.
*/
const gLclStrgKeyPopUpBlackList = "PopUpBlackList";

export { PopUpStd as default, PopUpOk, CopyPopUpProps, gLclStrgKeyPopUpBlackList as lclStrgKeyPopUpBlackList };

export type { StylesPopUpStd }
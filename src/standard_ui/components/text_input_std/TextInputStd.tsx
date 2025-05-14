import React, { useState, useRef, useEffect, useMemo, useCallback, memo, CSSProperties } from "react";
import PropTypes from 'prop-types';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { ButtonStd, useTheme, StylesButtonStd, IconFunc } from "../../standard_ui";

import "./TextInputStd.css";

type StyleTextInputStd =
{
    con: CSSProperties;
}

interface PropsTextInputStd
{
    prText: string;
    prIsBold?: boolean;
    prIsActive?: boolean;
    prUseOverlayInactive?: boolean;
    prPlaceholder?: string;
    prMaxLength?: number;
    prOnChangeText: (pText : string) => void;
    prSecureTextEntry?: boolean;
    prMultiline?: boolean;
    prMaxHeight?: number;
    prStyles?: StyleTextInputStd;
};

/*
* The app's text input component.
* This component can be used to enter both single and multi-line input.

* Props:
    > prText: The text to be rendered.
    > prSize: the size of the text. IMPORTANT: this is not fontSize, but rather the 'rank' of the fontSize (see 
      styles.js for more info).
    > prisBold: whether the text is bold.
    > prPlaceholder: the placeholder text (i.e. what is displayed when given an empty string).
    > prMaxLength: the maximum length of the text that can be inputted.
    > prOnChangeText: the function that's called when the user adds/removes text.
    > prSecureTextEntry: determines whether to hide the user's input. When true, the user's text is, by default hidden, 
      but an 'eye' button is rendered that allows the user to toggle this. Note that if multiline is true, this will not
      work.
    > prMultiline: whether the user can enter multiple lines.
    > prMaxHeight: the maximum height of the container before the component scrolls. This may be useful for creating a
      text-based messaging system, whereby the textbox starts at a normal single-line height, but expands to a set 
      maximum as the user enters more lines/characters.
    > prStyle: any additional styling to apply to the TextInput element. Note that fontWeight, fontSize, 
      borderRadius, and borderColor attributes will be overridden.

* Problems:
    > The width doesn't automatically fit.
*/
const TextInputStd = memo(
    
    function TextInputStd({ prText, prIsBold = false, prIsActive = true, prUseOverlayInactive = false, 
                            prPlaceholder = "", prMaxLength, prOnChangeText, prSecureTextEntry, prMultiline, 
                            prMaxHeight = 250, prStyles } : PropsTextInputStd)
    {
        const { theme } = useTheme();

        // Whether text is visible (only relevant if the secureTextEntry flag has been set to true).
        const [ stIsTextVisible, setIsTextVisible ] = useState<boolean>(false);

        // A reference to the text-area element (i.e. multi-line text).
        const rfTextArea = useRef<HTMLTextAreaElement | null>(null);

        /*
        * This allows the text-area element to automatically expand in height as the user enters text.
        */
        useEffect(
            () => 
            {
                if (!(rfTextArea.current))
                    return;

                // Reset the text-area's height momentarily to get the correct scrollHeight for the textarea.
                rfTextArea.current.style.height = "0px";
                const lScrollHeight = rfTextArea.current.scrollHeight;

                // We then set the height directly, outside of the render loop
                // Trying to set this with state or a ref will produce an incorrect value.
                rfTextArea.current.style.height = lScrollHeight + "px";
            }, 
            [ rfTextArea, prText ]
        );

        const lOnChangeText = useCallback(
            (e : React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | undefined) =>
            {
                if (e)
                    prOnChangeText(e.target.value)
            },
            [ prOnChangeText ]
        );

        const lOnPressBtnVisibility = useCallback(
            () =>
            {
                setIsTextVisible(
                    (prev : boolean) => { return !prev; }
                );
            },
            []
        );

        // Whether the hide/unhide icon appears to the right of the text.
        const lIsEyeShown = (prSecureTextEntry && !prMultiline);

        // The text to display.
        const lTextDisplay = (prSecureTextEntry && !stIsTextVisible) ? '*'.repeat(prText.length) : prText;

        const lStyleCon = useMemo<CSSProperties>(
            () =>
            {
                return {
                    ...styles.container,
                    backgroundColor: prIsActive || prUseOverlayInactive ? theme.std.textInput.background : theme.std.textInput.backgroundInactive,
                    borderColor: prIsActive ? theme.std.textInput.border : theme.std.textInput.borderInactive,
                    borderRadius: "0.5em",
                    paddingTop: prMultiline ? "1em" : 0,
                    paddingBottom: prMultiline ? "1em" : 0,
                    maxHeight: prMaxHeight,
                    color: prIsActive || prUseOverlayInactive ? theme.std.textInput.font : theme.std.textInput.fontInactive,
                    fontWeight: prIsBold ? 700 : 'normal', 
                    fontSize: 16,
                    ...prStyles?.con,
                };
            },
            [ theme, prIsActive, prUseOverlayInactive, prStyles, prIsBold, prMaxHeight, prMultiline ]
        );

        const lStyleInputMulti = useMemo<CSSProperties>(
            () =>
            {
                return {
                    marginLeft: "1em",
                    marginRight: lIsEyeShown ? 0 : "1em",
                    flex: 1,
                    fontSize: "1em",
                    color: "inherit",
                    ...styles.textElement,
                    //textAlignVertical: numLines > 1 ? "top" : "auto"
                }
            },
            [ lIsEyeShown ]
        );

        const lStyleInputSingle = useMemo<CSSProperties>(
            () =>
            {
                return {
                    marginLeft: "1em",
                    marginRight: lIsEyeShown ? 0 : "1em",
                    height: "3em",
                    flex: 1,
                    fontSize: "1em",
                    color: "inherit",
                    ...styles.textElement,
                    //textAlignVertical: numLines > 1 ? "top" : "auto"
                }
            },
            [ lIsEyeShown ]
        );

        const lStyleBtnVisibility = useMemo<StylesButtonStd>(
            () =>
            {
                return {
                    con:
                    {
                        ...styles.btnVisibility, 
                    }
                }
            },
            [ theme ]
        );

        // const lStyleIconEye = useMemo(
        //     () =>
        //     {
        //         return {
        //             color: prIsActive || prUseOverlayInactive ? theme.std.textInput.eyeIcon : theme.std.textInput.eyeIconInactive, 
        //             fontSize: "1.25em"
        //         }
        //     },
        //     [ theme, prIsActive, prUseOverlayInactive ]
        // );

        const lStyleOverlayInactive = useMemo(
            () =>
            {
                return {
                    ...styles.overlayInactive, 
                    backgroundColor: theme.std.textInput.overlayInactive, 
                    display: !prIsActive && prUseOverlayInactive ? "block" : "none"
                };
            },
            [ theme, prIsActive, prUseOverlayInactive ]
        );

        return (
            <div
                className = "textInputStandard hideScrollBar"
                style = { lStyleCon }
            >
                {
                    (prMultiline) && (
                        <textarea
                            className = "hideScrollBar"
                            maxLength = { prMaxLength }
                            placeholder = { prPlaceholder }
                            value = { lTextDisplay }
                            onChange = { lOnChangeText }
                            rows = { 1 }
                            style = { lStyleInputMulti }
                            ref = { rfTextArea }
                            disabled = { !prIsActive }
                        >
                        </textarea>
                    )
                }

                {
                    (!prMultiline) && (
                        <input 
                            //type = "text" 
                            //value = { lTextDisplay } 
                            type = { (prSecureTextEntry && !stIsTextVisible) ? "password" : "text" }
                            value = { prText } 
                            maxLength = { prMaxLength }
                            placeholder = { prPlaceholder }
                            onChange = { lOnChangeText }
                            style = { lStyleInputSingle }
                            disabled = { !prIsActive }
                        />
                    )
                }

                {
                    lIsEyeShown && (
                        <ButtonStd 
                            prIcon = { stIsTextVisible ? iconEyeClose : iconEyeOpen } 
                            prIconSize = { 25 } 
                            prIconColour = { prIsActive || prUseOverlayInactive ? theme.std.textInput.eyeIcon : theme.std.textInput.eyeIconInactive }
                            prOnPress = { lOnPressBtnVisibility }
                            prStyles = { lStyleBtnVisibility }
                        />
                    )
                }

                <div style = { lStyleOverlayInactive }></div>

            </div>
        );
    }

);

const iconEyeOpen : IconFunc = (pSize : number, pColour : string) =>
{
    return <Visibility sx = {{ color: pColour, fontSize: pSize }} />
}

const iconEyeClose : IconFunc = (pSize : number, pColour : string) =>
{
    return <VisibilityOff sx = {{ color: pColour, fontSize: pSize }} />
}

const styles : { [key: string]: CSSProperties } =
{
    container:
    {
        border: "1px solid",
        flexDirection: "row",
        justifyContent: "space-between",
        overflowY: "scroll",
        flexShrink: 0,
        position: "relative",
        overflow: "hidden"
    },
    textElement:
    {
        backgroundColor: "transparent",
        border: "none"
    },
    btnVisibility:
    {
        backgroundColor: "transparent",
        paddingLeft: "1em", 
        paddingRight: "1em",
    },
    overlayInactive:
    {
        position: "absolute", left: 0, top: 0,
        width: "100%",
        height: "100%",
    }
};

export default TextInputStd;

export type { StyleTextInputStd }
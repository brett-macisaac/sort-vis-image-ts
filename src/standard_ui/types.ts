// import { NavigateFunction } from 'react-router-dom';

import { JSX } from "react";

type IconFunc = (pSize: number, pColour: string) => JSX.Element;
type IconFuncMultiColour = (pSize: number, pColours: string[]) => JSX.Element;

type Direction = 'U' | 'D' | 'L' | 'R';

type Orientation = 'Vertical' | 'Horizontal';


type NavButtonProps = 
{
    text?: string,
    icon?: IconFunc,
    iconLocation?: Direction
    destination?: string,
    showConfirmPopUp?: boolean,
    titleConfirmPopUp?: string,
    messageConfirmPopUp?: string,

    // onPress?: (pNavFunc : NavigateFunction) => void,
};

// The object that contains the text and function used to create a button in the PopUpStd component.
type PopUpButtonProps =
{
    text: string,
    onPress?: () => void,
}

// The object that can be passed into a PageContainerStd component to display a pop-up.
type PopUpProps =
{
    title: string,
    message: string,
    buttons: PopUpButtonProps[],
    dismissable?: boolean,
    id?: string,
}

export type { IconFunc, IconFuncMultiColour, Direction, Orientation, NavButtonProps, PopUpButtonProps, PopUpProps }
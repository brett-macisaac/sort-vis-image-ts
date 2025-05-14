import React, { useState, useEffect, useContext, useRef, useMemo, CSSProperties } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import PaletteIcon from '@mui/icons-material/Palette';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { ButtonStd, PageContainerStd, useTheme, useWindowSize, SliderStd, ComboBoxStd, 
         StylesPageContainerStd, StylesButtonStd, StylesComboBoxStd, StylesSliderStd, 
         IconFunc } from "../../standard_ui/standard_ui";

import { sortAlgoNames, ranges } from './sort_resources_image';
import { Dimension2D } from './SortableImage';

interface PropsSortView
{
    prIndexSelectedSortAlgo: number;
    prSpeed: number;
    prOnPlayPause: (pSorting?: boolean) => Promise<void>;
    prOnChangeSliderSpeed: (pSpeed: number) => void;
    prOnPressBtnSortDir: () => Promise<void>;
    prOnPressCmbSortAlgo: React.Dispatch<React.SetStateAction<number>>;
    prOnPressBtnShuffle: () => Promise<void>;
    prOnPressBtnStop: () => void;
    prOnPressBtnVolume: () => Promise<void>;
    prOnPressChangeDirection: () => Promise<void>;
    prOnPressDownload: () => void;
    prResizeImage: (pMaxWidth : number, pMaxHeight : number) => Promise<void>;
    prUpdater: object;
    prRefBtnStop: React.RefObject<HTMLDivElement | null>;
    prRefBtnSkipNext: React.RefObject<HTMLDivElement | null>;
    prRefBtnSkipPrev: React.RefObject<HTMLDivElement | null>;
    prRefBtnPlayPause: React.RefObject<HTMLDivElement | null>;
    prRefBtnImageUpload: React.RefObject<HTMLInputElement | null>;
    prIsSorting: boolean;
    prIsPaused: boolean;
    prIsAscending: boolean;
    prIsVolumeOn: boolean;
    prIsLoading: boolean;
    prRefCanvas: React.RefObject<HTMLCanvasElement | null>;
}

function SortView({ prIndexSelectedSortAlgo, prSpeed, prOnChangeSliderSpeed, 
                    prOnPlayPause, prOnPressBtnSortDir, prOnPressCmbSortAlgo, 
                    prOnPressBtnShuffle, prOnPressBtnStop, prOnPressDownload, prOnPressChangeDirection, prResizeImage, prUpdater,
                    prRefBtnStop, prRefBtnSkipNext, prRefBtnSkipPrev, prRefBtnPlayPause, prRefBtnImageUpload, prIsSorting, prIsPaused, 
                    prIsAscending, prIsVolumeOn, prIsLoading, prRefCanvas } : PropsSortView) 
{

    // Acquire global theme.
    const { theme } = useTheme();

    const windowSize = useWindowSize();

    const navigate = useNavigate();

    // Whether to display the app in 'landscape' orientation.
    const lIsLandScape = useMemo<boolean>(
        () =>
        {
            if (windowSize.isLandscape)
            {
                return !windowSize.isBigScreen;
            }
            else
            {
                return false;
            }
        },
        [ windowSize ]
    );

    const lStyleCon = useMemo<StylesPageContainerStd>(
        () =>
        {
            return lIsLandScape ? styleConLandscape : styleConPortrait;
        },
        [ lIsLandScape ]
    );

    const lStyleConComboBox = useMemo<CSSProperties>(
        () =>
        {
            return lIsLandScape ? styleConComboBoxLandscape : styleConComboBoxPortrait;
        },
        [ lIsLandScape ]
    );

    const lStyleConElements = useMemo<CSSProperties>(
        () =>
        {
            return lIsLandScape ? styleConElementsLandscape : styleConElementsPortrait;
        },
        [ lIsLandScape ]
    );

    const lStyleConSliders = useMemo<CSSProperties>(
        () =>
        {
            return lIsLandScape ? { ...styleConSliders, ...styleConSlidersLandscape } : 
                                  { ...styleConSliders, ...styleConSlidersPortrait };
        },
        [ lIsLandScape ]
    );

    const lStyleBtnSortDirection = useMemo<StylesButtonStd>(
        () =>
        {
            return {
                con:
                {
                    height: gSizeComboBox, //!lIsLandScape ? "100%" : "",
                    width: gSizeComboBox, //lIsLandScape ? "100%" : "",
                    padding: 5,
                    borderRadius: gBorderRadiusGeneral,
                }
            }
        },
        []
    );

    const lStyleBtnAction = useMemo<StylesButtonStd>(
        () =>
        {
            return { 
                    con: { 
                    padding: gPaddingBtnAction,
                    flexShrink: 0,
                    borderRadius: gBorderRadiusGeneral
                } 
            };
        },
        []
    );

    // Props related to the buttons.
    let lButtonProps = useMemo<ButtonProps>(
        () => 
        { 
            // The total available space along the direction that the buttons are arranged (i.e. either vertical or horizontal).
            let lSpaceAvailable = lIsLandScape ? windowSize.height : windowSize.width;

            // The size of the gap between the buttons along the direction that the buttons are arranged (i.e. either vertical or horizontal).
            let lGap = lSpaceAvailable * 0.04;

            // The size of each button along the direction that the buttons are arranged (i.e. either vertical or horizontal).
            let lSize = (lSpaceAvailable - 2 * gPaddingGeneral - 6 * lGap - 14 * gPaddingBtnAction) / 7;

            // Make sure the size is between the min and max.
            lSize = lSize > 115 ? 115 : lSize;
            lSize = lSize < 40 ? 40 : lSize;

            return { size: lSize * 0.98, gap: lGap }; 
        },
        [ windowSize, lIsLandScape ]
    );

    const lMaxImageDimensions = useMemo<Dimension2D>(
        () =>
        {
            let lMaxWidth, lMaxHeight;

            if (lIsLandScape)
            {
                lMaxHeight = windowSize.height - 2 * gPaddingGeneral;

                lMaxWidth = 400;
            }
            else
            {
                lMaxWidth = windowSize.width - 2 * gPaddingGeneral;

                lMaxHeight = 400;
            }

            return { width: lMaxWidth, height: lMaxHeight }
        },
        [ windowSize, lIsLandScape ]
    );

    useEffect(
        () =>
        {
            prResizeImage(lMaxImageDimensions.width, lMaxImageDimensions.height);
        },
        [ lMaxImageDimensions ]
    );

    const lStyleConButtonsOuter = useMemo<CSSProperties>(
        () =>
        {
            if (lIsLandScape)
            {
                return {
                    ...styleConButtonsOuter, ...styleConButtonsLandscapeOuter, overflowY: "scroll"
                };
            }
            else
            {
                return {
                    ...styleConButtonsOuter, ...styleConButtonsPortraitOuter, overflowX: "scroll"
                };
            }
        },
        [ theme, lIsLandScape ]
    );

    const lStyleConButtonsInner = useMemo<CSSProperties>(
        () =>
        {
            if (lIsLandScape)
            {
                return {
                    ...styleConButtonsInner, ...styleConButtonsLandscapeInner, rowGap: lButtonProps.gap
                };
            }
            else
            {
                return {
                    ...styleConButtonsInner, ...styleConButtonsPortraitInner, columnGap: lButtonProps.gap
                };
            }
        },
        [ theme, lButtonProps, lIsLandScape ]
    );

    const lStyleSlider = useMemo<StylesSliderStd>(
        () =>
        {
            return { 
                con: {
                    borderRadius: gBorderRadiusGeneral,
                }
            };
        },
        []
    );

    const lStyleComboBox = useMemo<StylesComboBoxStd>(
        () =>
        {
            return { 
                con: { 
                    borderRadius: gBorderRadiusGeneral,
                    flexGrow: 1, 
                    width: lIsLandScape ? gSizeSlider : 1, // The '1' is required to be set so that flexGrow works.
                    height: !lIsLandScape ? gSizeSlider : 1, // The '1' is required to be set so that flexGrow works.
                    maxWidth: 600
                },
                conItems: {
                    border: `1px solid ${theme.cst.sortView.border}`, 
                    borderRadius: gBorderRadiusGeneral,
                    marginTop: !lIsLandScape ? 7 : 0,
                    marginLeft: lIsLandScape ? 7 : 0,
                }
            };
        },
        [ theme, lIsLandScape ]
    );

    const lIconBtnSortDir = useMemo<IconFunc>(
        () =>
        {
            return prIsAscending ? (pSize : number, pColour : string) => { return <ArrowUpwardIcon sx = {{ color: pColour, fontSize: pSize }} /> } :
                                   (pSize : number, pColour : string) => { return <ArrowDownwardIcon sx = {{ color: pColour, fontSize: pSize }} /> };
        },
        [ prIsAscending ]
    );

    const lIconBtnPlayPause = useMemo<IconFunc>(
        () =>
        {
            return (!prIsSorting || prIsPaused) ? (pSize : number, pColour : string) => { return <PlayArrowIcon sx = {{ color: pColour, fontSize: pSize }} /> } :
                                                  (pSize : number, pColour : string) => { return <PauseIcon sx = {{ color: pColour, fontSize: pSize }} /> };
        },
        [ prIsPaused, prIsSorting ]
    );

    const lIconBtnStop = useMemo<IconFunc>(
        () =>
        {
            return prIsSorting ? (pSize : number, pColour : string) => { return <StopIcon sx = {{ color: pColour, fontSize: pSize }} /> } :
                                 (pSize : number, pColour : string) => { return <PaletteIcon sx = {{ color: pColour, fontSize: pSize }} /> };
        },
        [ prIsSorting ]
    );

    const llIconBtnUploadImage = useMemo<React.JSX.Element | undefined>(
        () =>
        {
            if (!iconUploadImage)
                return undefined;

            const lColour = theme.cst.sortView.iconButton;

            return iconUploadImage(lButtonProps.size, lColour);
        },
        [ theme, lButtonProps ]
    );

    return ( 
        <PageContainerStd
            prStyles = { lStyleCon }
            prShowHeader = { false }
            prIsLoading = { prIsLoading }
        >

            <div style = { lStyleConComboBox }>
                <ComboBoxStd
                    prItems = { sortAlgoNames } prIndexSelected = { prIndexSelectedSortAlgo }
                    prDirection = { lIsLandScape ? "R" : "D" } 
                    prLength = { lIsLandScape ? undefined : "100%" } 
                    prOnPress = { prOnPressCmbSortAlgo }
                    prHideScrollBar = { false }
                    prMaxLengthItemBox = { lIsLandScape ? Math.min(windowSize.width * 0.4, 400) : Math.min(windowSize.height * 0.4, 400) }
                    prStyles = { lStyleComboBox }
                    prIsActive = { !prIsSorting }
                />
                <ButtonStd 
                    prIcon = { lIconBtnSortDir }
                    prIconSize = { 35 } prIconColour = { theme.cst.sortView.iconButton }
                    prStyles = { lStyleBtnSortDirection } prIsBorderDisabled = { false }
                    prOnPress = { prOnPressBtnSortDir }
                    prIsActive = { !prIsSorting }
                />
            </div>

            {/* Render image */}
            <div style = { lStyleConElements } className = "hideScrollBar" onClick = { prOnPressChangeDirection }>
                <canvas ref = { prRefCanvas } style = { styleCanvas }>

                </canvas>
            </div>

            <div style = { lStyleConSliders }>
                <SliderStd 
                    prIsVertical = { lIsLandScape } prIsVerticalTopDown = { false }
                    prMin = { 1 } prMax = { ranges.speed.max } prValue = { prSpeed } prStep = { 1 }
                    prMinAllowed = { ranges.speed.min }
                    prOnChange = { prOnChangeSliderSpeed }
                    prLabel = "SPEED"
                    prHeight = { lIsLandScape ? "100%" : gSizeSlider }
                    prWidth = { lIsLandScape ? gSizeSlider : undefined }
                    prStyles = { lStyleSlider } prShowValue = { false }
                /> 
            </div>

            {/* Render buttons */}
            <div style = { lStyleConButtonsOuter } className = "hideScrollBar"> 
                <div style = { lStyleConButtonsInner }>
                <ButtonStd 
                        prIcon = { lIconBtnPlayPause }
                        prIconSize = { lButtonProps.size }
                        prIconColour = { theme.cst.sortView.iconButton }
                        prStyles = { lStyleBtnAction }
                        prRef = { prRefBtnPlayPause }
                        prOnPress = { prOnPlayPause }
                    />
                    <ButtonStd 
                        prIcon = { iconSkipPrev }
                        prIconSize = { lButtonProps.size }
                        prIconColour = { theme.cst.sortView.iconButton }
                        prStyles = { lStyleBtnAction }
                        prRef = { prRefBtnSkipPrev }
                        prIsActive = { !prIsSorting || prIsPaused }
                    />
                    <ButtonStd 
                        prIcon = { iconSkipNext }
                        prIconSize = { lButtonProps.size }
                        prIconColour = { theme.cst.sortView.iconButton }
                        prStyles = { lStyleBtnAction }
                        prRef = { prRefBtnSkipNext }
                        prIsActive = { !prIsSorting || prIsPaused }
                    />
                    <ButtonStd 
                        prIcon = { lIconBtnStop }
                        prIconSize = { lButtonProps.size }
                        prIconColour = { theme.cst.sortView.iconButton }
                        prStyles = { lStyleBtnAction }
                        prRef = { prRefBtnStop }
                        prOnPress = { prOnPressBtnStop }
                    />
                    <ButtonStd 
                        prIcon = { iconShuffle }
                        prIconSize = { lButtonProps.size }
                        prIconColour = { theme.cst.sortView.iconButton }
                        prStyles = { lStyleBtnAction }
                        prOnPress = { prOnPressBtnShuffle }
                        prIsActive = { !prIsSorting }
                    />
                    <label htmlFor = "inputImage" style = { styleLabelUploadImage }>
                        { llIconBtnUploadImage }
                        <input type = "file" id = "inputImage" style = { styleInputUploadImage } accept = "image/*" ref = { prRefBtnImageUpload } disabled = { prIsSorting } />
                    </label>
                    <ButtonStd 
                        prIcon = { iconDownloadImage }
                        prIconSize = { lButtonProps.size }
                        prIconColour = { theme.cst.sortView.iconButton }
                        prStyles = { lStyleBtnAction }
                        prOnPress = { prOnPressDownload }
                        prIsActive = { !prIsSorting || prIsPaused }
                    />
                </div>
            </div>

        </PageContainerStd>
    );
}

const gBorderRadiusGeneral : number = 10;
const gPaddingGeneral : number = 10;

const gPaddingCon : number = 0;

const gPaddingBtnAction : number = 3;

const gColRowGap : number = 15;

// The 'size' (i.e. width or height, depending on screen orientation) of the combobox.
const gSizeComboBox : number = 60;

// The 'size' (i.e. width or height, depending on screen orientation) of the slider.
const gSizeSlider : number = 60;

const styleConLandscape : StylesPageContainerStd =
{
    con:
    {
        alignItems: "center",
        flexDirection: "row",
        padding: gPaddingGeneral,
        columnGap: gColRowGap,
    }
};

const styleConPortrait : StylesPageContainerStd =
{
    con:
    {
        alignSelf: "center",
        maxWidth: 1350,
        alignItems: "center",
        flexDirection: "column",
        padding: gPaddingGeneral,
        rowGap: gColRowGap,
    }
};

const styleConComboBoxLandscape : CSSProperties =
{
    flexDirection: "column-reverse",
    height: "100%", // todo: was using 100%, but there was an issue where the height would collapse to contents.
    flexShrink: 0,
    rowGap: 10
};

const styleConComboBoxPortrait : CSSProperties =
{
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    flexShrink: 0,
    columnGap: 10
};

const styleConElementsLandscape : CSSProperties =
{
    flexGrow: 1, 
    height: "100%", // todo: was using 100%, but there was an issue where the height would collapse to 0.
    flexDirection: "row", 
    alignItems: "flex-end", justifyContent: "center", 
    overflowY: "scroll", // overflowX: "scroll",
};

const styleConElementsPortrait : CSSProperties =
{
    flexGrow: 1, 
    width: "100%", 
    flexDirection: "column", 
    alignItems: "start", justifyContent: "start", 
    overflowY: "scroll",
};

const styleConSliders : CSSProperties =
{
    // alignSelf: "flex-start",
    flexShrink: 0,
    flexGrow: 0,
};

const styleConSlidersLandscape : CSSProperties =
{
    // alignSelf: "flex-start",
    height: "100%", // "100%" on FireFox this didn't work sometimes for some reason.
    // minHeight: "100%",
    flexDirection: "row",
    flexShrink: 0,
    flexGrow: 0,
    columnGap: gColRowGap,
    // paddingTop: gPaddingGeneral,
    // paddingBottom: gPaddingGeneral,
};

const styleConSlidersPortrait : CSSProperties =
{
    // alignSelf: "flex-start",
    width: "100%",
    flexDirection: "column",
    flexShrink: 0,
    flexGrow: 0,
    rowGap: gColRowGap,
    // paddingLeft: gPaddingGeneral,
    // paddingRight: gPaddingGeneral,
    alignItems: "center"
};

const styleConButtonsOuter : CSSProperties =
{
    // alignItems: "center"
    // padding: gPaddingConButtonsOuter
};
const styleConButtonsInner : CSSProperties =
{
    // margin: "auto"
};

const styleConButtonsLandscapeOuter : CSSProperties =
{
    height: "100%",
};
const styleConButtonsLandscapeInner : CSSProperties =
{
    flexDirection: "column",
    // margin: "auto"
};

const styleConButtonsPortraitOuter : CSSProperties =
{
    width: "100%",
};
const styleConButtonsPortraitInner : CSSProperties =
{
    flexDirection: "row",
    // margin: "auto"
};

const styleInputUploadImage : CSSProperties =
{
    display: "none"
};

const styleLabelUploadImage : CSSProperties =
{
    display: "flex",
    padding: gPaddingBtnAction,
    flexShrink: 0,
    backgroundColor: "black",
    borderRadius: "1em",
    justifyContent: "center"
};

const styleCanvas : CSSProperties =
{
    margin: "auto"
};

const iconShuffle : IconFunc = (pSize : number, pColour : string) =>
{
    return <ShuffleIcon sx = {{ color: pColour, fontSize: pSize }} />
};

const iconSkipNext : IconFunc = (pSize : number, pColour : string) =>
{
    return <SkipNextIcon sx = {{ color: pColour, fontSize: pSize }} />
};

const iconSkipPrev : IconFunc = (pSize : number, pColour : string) =>
{
    return <SkipPreviousIcon sx = {{ color: pColour, fontSize: pSize }} />
};


const iconUploadImage : IconFunc = (pSize : number, pColour : string) =>
{
    return <FileUploadIcon sx = {{ color: pColour, fontSize: pSize }} />
};

const iconDownloadImage : IconFunc = (pSize : number, pColour : string) =>
{
    return <FileDownloadIcon sx = {{ color: pColour, fontSize: pSize }} />
};

type ButtonProps = 
{
    size: number;
    gap: number;
}

export default SortView;
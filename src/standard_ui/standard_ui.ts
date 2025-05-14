// Import contexts.
import ThemeProvider, { useTheme } from "./contexts/ThemeContext";
import WindowSizeProvider, { useWindowSize } from "./contexts/WindowSizeContext";

// Utility functions.
import utils from "./utils";

// Import Components.
// import ButtonNextPageStd from "./components/button_next_page_std/ButtonNextPageStd";
import ButtonStd, { StylesButtonStd } from "./components/button_std/ButtonStd";
// import ButtonThemeStd from "./components/button_theme_std/ButtonThemeStd";
// import CheckBoxStd from "./components/check_box_std/CheckBoxStd";
import ComboBoxStd, { StylesComboBoxStd } from "./components/combo_box_std/ComboBoxStd";
// import ContainerStd from "./components/container_std/ContainerStd";
// import CountLabelStd from "./components/count_label_std/CountLabelStd";
import HeaderStd, { StylesHeaderStd } from "./components/header_std/HeaderStd";
import NavBarStd, { StylesNavBarStd } from "./components/navbar_std/NavBarStd";
// import HeaderButtonStd from "./components/header_button_std/HeaderButtonStd";
// import LinkStd from "./components/link_std/LinkStd";
// import NavBarSingleStd from "./components/nav_bar_single_std/NavBarSingleStd";
import PageContainerStd, { StylesPageContainerStd } from "./components/page_container_std/PageContainerStd";
import PopUpStd, { PopUpOk, StylesPopUpStd, CopyPopUpProps } from "./components/pop_up_std/PopUpStd";
import SliderStd, { StylesSliderStd }  from "./components/slider_std/SliderStd";
// import TableStd from "./components/table_std/TableStd";
import TextInputStd, { StyleTextInputStd } from "./components/text_input_std/TextInputStd";
import TextStd from "./components/text_std/TextStd";
import LoadAreaStd from "./components/loading_area_std/LoadAreaStd";

import { PopUpProps, NavButtonProps, IconFunc } from "./types";


// Export everything in the package.
export { 
    // Contexts.
    ThemeProvider, WindowSizeProvider,
    useTheme, useWindowSize,

    // Utility functions.
    utils,

    // Components.
    // ButtonNextPageStd, 
    ButtonStd, 
    // ButtonThemeStd, 
    // CheckBoxStd, 
    ComboBoxStd,
    // ContainerStd, 
    // CountLabelStd, 
    HeaderStd, 
    NavBarStd,
    // HeaderButtonStd, 
    // LinkStd,
    // NavBarSingleStd, 
    PageContainerStd, 
    PopUpStd, PopUpOk, CopyPopUpProps,
    TextInputStd, 
    SliderStd,
    // TableStd,
    TextStd,
    LoadAreaStd
};

export type { 
    StylesPopUpStd, StylesButtonStd, StylesHeaderStd, StyleTextInputStd, StylesPageContainerStd, StylesNavBarStd,
    IconFunc, PopUpProps, NavButtonProps, StylesComboBoxStd, StylesSliderStd
};
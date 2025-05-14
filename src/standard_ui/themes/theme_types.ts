type ThemeTextStd =
{
    color: string;
}

type ThemeButtonStd =
{
    background: string;
    border: string;
    font: string;

    backgroundInactive: string;
    borderInactive: string;
    fontInactive: string;

    overlayInactive: string;
}

type ThemeButtonNextPageStd =
{
    background: string;
    border: string;
    font: string;
    icon: string;
    iconBackgroundColor: string;
}

type ThemeButtonThemeStd =
{
    content: string;
    header: string;
    navBar: string;
    border: string;
}

type ThemeCheckBoxStd =
{
    background: string;
    border: string;
    font: string;
    fontCheck: string;
    backgroundBoxSel: string;
    backgroundBoxUnsel: string;

    backgroundInactive: string;
    borderInactive: string;
    fontInactive: string;
    fontCheckInactive: string;
    backgroundBoxSelInactive: string;
    backgroundBoxUnselInactive: string;

    overlayInactive: string;
}

type ThemeComboBoxStd =
{
    background: string;
    backgroundItems: string;
    border: string;
    font: string;
    fontPlaceholder: string;
    iconArrow: string;

    backgroundInactive: string;
    borderInactive: string;
    fontInactive: string;
    fontPlaceholderInactive: string;
    iconArrowInactive: string;

    overlayInactive: string;
}

type ThemeContainerStd =
{
    background: string;
    border: string;
}

type ThemeCountLabelStd =
{
    background: string;
    border: string;
    font: string;
    fontValue: string;
    backgroundValue: string;
    borderLeftColorValue: string;
}

type ThemeTextInputStd =
{
    background: string;
    font: string;
    border: string;
    eyeIcon: string;

    backgroundInactive: string;
    fontInactive: string;
    borderInactive: string;
    eyeIconInactive: string;

    overlayInactive: string;
}

type ThemeHeaderButtonStd =
{
    font: string;
    icon: string;
}

type ThemeHeaderStd =
{
    background: string;
    border: string;
    logoColours: string[];
    button: ThemeHeaderButtonStd;
}

// type NavBarSingleStd = 
// {
//     background: string;
//     border: string;
//     font: string;
//     backgroundButton: string;
// }

type ThemeNavBarButtonStd = 
{
    fontActive: string;
    fontInactive: string;
    iconActive: string;
    iconInactive: string;
}

type ThemeNavBarStd = 
{
    background: string;
    border: string;
    button: ThemeNavBarButtonStd;
}

type ThemePopUpStd = 
{
    backgroundTransparent: string;
    background: string;
    border: string;
    font: string;

    buttonBackgroundColor: string;
    buttonBorderColor: string;
    buttonFontColor: string;
}

type ThemeSliderStd = 
{
    borderCon: string;
    backgroundProgress: string;
    borderProgress: string;
    font: string;
    backgroundTrack: string;

    borderConInactive: string;
    backgroundProgressInactive: string;
    borderProgressInactive: string;
    fontInactive: string;
    backgroundTrackInactive: string;

    overlayInactive: string;
}

type ThemeTableStd =
{
    background: string;
    backgroundHeaderCell: string;
    backgroundContentCell: string;
    border: string;
}

type ThemeLoadAreaStd =
{
    background: string;
    backgroundTranslucent: string;
    loadIcon: string;
}

type ThemePageContainerStd =
{
    background: string;

    // header: ThemeHeaderStd;

    // navBarSingle: NavBarSingleStd;

    // navBar: NavBarStd;

    // loadArea: ThemeLoadAreaStd;
    // popUp: ThemePopUpStd;
}

type ThemeElementView =
{
    background: string; 
    backgroundComp: string; 
    backgroundSwap: string; 
    backgroundSet: string; 
    border: string; 
}

type ThemeSortView =
{
    backgroundButton: string; 

    iconButton: string;

    border: string;
}

type Theme = 
{
    name: string;

    isDark: boolean;

    // This object defines the theme for the library's components.
    std:
    {
        text: ThemeTextStd;

        button: ThemeButtonStd;
    
        buttonNextPage: ThemeButtonNextPageStd;
    
        buttonTheme: ThemeButtonThemeStd;
    
        checkBox: ThemeCheckBoxStd;
    
        comboBox: ThemeComboBoxStd;
    
        container: ThemeContainerStd;
    
        countLabel: ThemeCountLabelStd;
    
        textInput: ThemeTextInputStd;
    
        pageContainer: ThemePageContainerStd;

        header: ThemeHeaderStd;

        navBar: ThemeNavBarStd

        popUp: ThemePopUpStd;
    
        slider: ThemeSliderStd;
    
        table: ThemeTableStd;
    
        loadArea: ThemeLoadAreaStd;
    }

    // This object defines the theme for the app's custom components.
    cst: 
    {
        elementView: ThemeElementView

        sortView: ThemeSortView;
    }
}

export type { 
    ThemeTextStd, ThemeButtonStd, ThemeButtonNextPageStd, ThemeButtonThemeStd, ThemeCheckBoxStd, 
    ThemeComboBoxStd, ThemeContainerStd, ThemeCountLabelStd, ThemeTextInputStd, ThemePageContainerStd,
    ThemePopUpStd, ThemeSliderStd, ThemeTableStd, ThemeLoadAreaStd, Theme 
};
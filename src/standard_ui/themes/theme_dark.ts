import { Theme } from "./theme_types"

const dark : Theme =
{
    // The theme's name.
    name: "dark",

    isDark: true,

    std:
    {
        text:
        {
            color: "#FFFFFF"
        },

        button: 
        {
            background: "#000000",
            border: "#FAFAFA",
            font: "#FFFFFF",

            backgroundInactive: "#353535",
            borderInactive: "#8B8B8B",
            fontInactive: "#8B8B8B",

            overlayInactive: "#35353567"
        },

        buttonNextPage: 
        {
            background: "#000000",
            border: "#FAFAFA",
            font: "#FFFFFF",
            icon: "#FAFAFA",
            iconBackgroundColor: "transparent"
        },

        buttonTheme: 
        {
            content: "#272727",
            header: "#000000",
            navBar: "#000000",
            border: "#FAFAFA",
        },

        checkBox: 
        {
            background: "#000000",
            border: "#FAFAFA",
            font: "#ffffff",
            fontCheck: "#000000",
            backgroundBoxSel: "#FFFFFF",
            backgroundBoxUnsel: "#000000",

            backgroundInactive: "#353535",
            borderInactive: "#8B8B8B",
            fontInactive: "#8B8B8B",
            fontCheckInactive: "#8B8B8B",
            backgroundBoxSelInactive: "#353535",
            backgroundBoxUnselInactive: "#353535",

            overlayInactive: "#35353567"
        },

        comboBox:
        {
            background: "#000000",
            backgroundItems: "#000000",
            border: "#FAFAFA",
            font: "#ffffff",
            fontPlaceholder: "#ffffff",
            iconArrow: "#ffffff",

            backgroundInactive: "#353535",
            borderInactive: "#8B8B8B",
            fontInactive: "#8B8B8B",
            fontPlaceholderInactive: "#8B8B8B",
            iconArrowInactive: "#8B8B8B",

            overlayInactive: "#35353567"
        },

        container:
        {
            background: "transparent",
            border: "#FAFAFA",
        },

        countLabel:
        {
            background: "#000000",
            border: "#FAFAFA",
            font: "#ffffff",
            fontValue: "#ffffff",
            backgroundValue: "#000000",
            borderLeftColorValue: "#FAFAFA",
        },

        textInput:
        {
            background: "transparent",
            font: "#FFFFFF",
            border: "#FAFAFA",
            eyeIcon: "#FAFAFA",

            backgroundInactive: "#383737", 
            fontInactive: "#8B8B8B",
            borderInactive: "#8B8B8B",
            eyeIconInactive: "#8B8B8B",

            overlayInactive: "#15151567"
        },

        header: 
        {
            background: "#000000",
            border: "#FAFAFA",
            logoColours: [ "#FAFAFA" ],
            button: 
            {
                font: "#FAFAFA",
                icon: "#FAFAFA"
            }
        },

        navBar: 
        {
            background: "#000000",
            border: "#FAFAFA",
            button: 
            {
                fontActive: "#FAFAFA",
                fontInactive: "#FAFAFA66",
                iconActive: "#FAFAFA",
                iconInactive: "#FAFAFA66",
            }
        },

        pageContainer:
        {
            background: "#272727",
        },

        popUp:
        {
            backgroundTransparent: "#00000099",
            background: "#272727",
            border: "#FAFAFA",
            font: "#FFFFFF",

            buttonBackgroundColor: "#000000",
            buttonBorderColor: "#FAFAFA",
            buttonFontColor: "#FFFFFF",
        },

        slider:
        {
            borderCon: "#FAFAFA",
            backgroundProgress: "#000000",
            borderProgress: "#FAFAFA",
            font: "#ffffff",
            backgroundTrack: "transparent",

            borderConInactive: "#8B8B8B",
            backgroundProgressInactive: "#383737",
            borderProgressInactive: "#8B8B8B",
            fontInactive: "#8B8B8B",
            backgroundTrackInactive: "transparent",

            overlayInactive: "#15151567"
        },

        table:
        {
            background: "transparent",
            backgroundHeaderCell: "#000000",
            backgroundContentCell: "transparent",
            border: "#FAFAFA",
        },

        loadArea:
        {
            background: "#272727",
            backgroundTranslucent: "#00000099",
            loadIcon: "#FAFAFA",
        },
    },

    cst: 
    {
        elementView:
        {
            background: "#000000", 
            backgroundComp: "#FF5900",
            backgroundSwap: "#FF0000",
            backgroundSet: "#FF0000",
            border: "transparent"
        },

        sortView:
        {
            backgroundButton: "#000000", 
            iconButton: "#ffffff",
            border: "#ffffff",
        }
    }
};

export { dark as default };
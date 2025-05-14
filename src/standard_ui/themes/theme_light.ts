import { Theme } from "./theme_types"

const light : Theme =
{
    // The theme's name.
    name: "light",

    isDark: false,

    std:
    {
        text:
        {
            color: "#000000"
        },

        button: 
        {
            background: "#000000",
            border: "#000000",
            font: "#FFFFFF",

            backgroundInactive: "#CACACAFF",
            borderInactive: "#8B8B8B",
            fontInactive: "#666666FF",

            overlayInactive: "#CAC9C967"
        },

        buttonNextPage: 
        {
            background: "#FFFFFF",
            border: "#000000",
            font: "#000000",
            icon: "#000000",
            iconBackgroundColor: "transparent"
        },

        buttonTheme: 
        {
            content: "#272727",
            header: "#000000",
            navBar: "#000000",
            border: "#000000",
        },

        checkBox: 
        {
            background: "#FFFFFF",
            border: "#000000",
            font: "#000000",
            fontCheck: "#FFFFFF",
            backgroundBoxSel: "#000000",
            backgroundBoxUnsel: "#FFFFFF",

            backgroundInactive: "#CACACAFF",
            borderInactive: "#8B8B8B",
            fontInactive: "#666666FF",
            fontCheckInactive: "#666666FF",
            backgroundBoxSelInactive: "#CACACAFF",
            backgroundBoxUnselInactive: "#CACACAFF",

            overlayInactive: "#CAC9C967"
        },

        comboBox:
        {
            background: "#FFFFFF",
            backgroundItems: "#FFFFFF",
            border: "#000000",
            font: "#000000",
            fontPlaceholder: "#000000",
            iconArrow: "#000000",

            backgroundInactive: "#CACACAFF",
            borderInactive: "#8B8B8B",
            fontInactive: "#666666FF",
            fontPlaceholderInactive: "#666666FF",
            iconArrowInactive: "#666666FF",

            overlayInactive: "#CAC9C967"
        },

        container:
        {
            background: "transparent",
            border: "#000000",
        },

        countLabel:
        {
            background: "#FFFFFF",
            border: "#000000",
            font: "#000000",
            fontValue: "#000000",
            backgroundValue: "#FFFFFF",
            borderLeftColorValue: "#000000",
        },

        textInput:
        {
            background: "transparent",
            font: "#000000",
            border: "#000000",
            eyeIcon: "#000000",

            backgroundInactive: "#CACACAFF", 
            fontInactive: "#666666FF",
            borderInactive: "#666666FF",
            eyeIconInactive: "#666666FF",

            overlayInactive: "#CAC9C967"
        },

        header: 
        {
            background: "#FFFFFF",
            border: "#000000",
            logoColours: [ "#000000" ],
            button: 
            {
                font: "#000000",
                icon: "#000000"
            }
        },

        navBar: 
        {
            background: "#FFFFFF",
            border: "#000000",
            button: 
            {
                fontActive: "#000000",
                fontInactive: "#666666FF",
                iconActive: "#000000",
                iconInactive: "#666666FF",
            }
        },

        pageContainer:
        {
            background: "#FFFFFF",
        },

        popUp:
        {
            backgroundTransparent: "#FFFFFF99",
            background: "#FFFFFF",
            border: "#000000",
            font: "#000000",

            buttonBackgroundColor: "#FFFFFF",
            buttonBorderColor: "#000000",
            buttonFontColor: "#000000",
        },

        slider:
        {
            borderCon: "#000000",
            backgroundProgress: "#E7E7E7FF",
            borderProgress: "#000000",
            font: "#000000",
            backgroundTrack: "transparent",

            borderConInactive: "#666666FF",
            backgroundProgressInactive: "#383737",
            borderProgressInactive: "#666666FF",
            fontInactive: "#666666FF",
            backgroundTrackInactive: "transparent",

            overlayInactive: "#CAC9C967"
        },

        table:
        {
            background: "transparent",
            backgroundHeaderCell: "#FFFFFF",
            backgroundContentCell: "transparent",
            border: "#000000",
        },

        loadArea:
        {
            background: "#FFFFFF",
            backgroundTranslucent: "#FFFFFF99",
            loadIcon: "#000000",
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
            iconButton: "#FFFFFF",
            border: "#000000",
        }
    }
};

export { light as default };
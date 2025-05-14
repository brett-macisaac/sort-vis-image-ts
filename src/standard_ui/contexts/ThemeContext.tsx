import React, { createContext, useContext, useState, useMemo, useCallback, useRef } from 'react';
import utils from '../utils';
import themesDefault, { themeDefault } from "../themes/themes.ts";
import { Theme } from "../themes/theme_types.ts";

interface ValueThemeContext
{ 
    theme: Theme, 
    themes: Theme[],
    switchTheme : (pThemeName : string) => void,
    addTheme : (pTheme : Theme) => void,
    incrementTheme: () => void
}

const ThemeContext = createContext<ValueThemeContext>(
    { 
        theme: themeDefault, 
        themes: themesDefault, 
        switchTheme: (_pThemeName : string) => { console.log("ThemeContext: Empty switch function. Is the component a child of ThemeProvider?"); }, 
        addTheme: (_pTheme : Theme) => { console.log("ThemeContext: Empty add function. Is the component a child of ThemeProvider?"); },
        incrementTheme: () => { console.log("ThemeContext: Empty increment function. Is the component a child of ThemeProvider?"); }
    }
);

/*
* A localStorage key whose value is a string that corresponding to the app's current theme.
*/
const gLclStrgKeyThemeName = "themeName";

interface PropsThemeProvider
{
    children: React.ReactNode
}

function ThemeProvider({ children } : PropsThemeProvider) 
{
    /* The name of the current theme. */
    const [ stTheme, setTheme ] = useState(themeDefault); // utils.getFromLocalStorage(gLclStrgKeyThemeName, ""

    const rfThemes = useRef<Theme[]>(themesDefault);

    /**
    * Updates the current theme.

    * Parameters:
        @param pThemeName The name of the theme that will be set.
    */
    const switchTheme = useCallback(
        (pThemeName : string) : void =>
        {
            if (!pThemeName)
            {
                console.log("No theme name provided.");
                return;
            }

            const lTheme : Theme | undefined = rfThemes.current.find((pVal : Theme) => { return pVal.name == pThemeName; });

            if (!lTheme)
            {
                console.log(`The theme '${pThemeName}' doesn't refer to a theme.`);
                return;
            }

            setTheme(lTheme);

            // Locally store the new theme's name.
            utils.setInLocalStorage(gLclStrgKeyThemeName, pThemeName);
        },
        []
    );

    /**
    * Changes the theme to the 'next' one.
    */
    const incrementTheme = useCallback(
        () : void =>
        {
            setTheme(
                (pPrevTheme : Theme) : Theme =>
                {
                    let lIndexCurr : number = rfThemes.current.findIndex((pVal : Theme) => { return pVal.name == pPrevTheme.name; });

                    let lIndexNext : number = (lIndexCurr + 1) % rfThemes.current.length;

                    return rfThemes.current[lIndexNext]
                }
            );
        },
        []
    );

    /**
    * Adds a theme.

    * Parameters:
        @param pThemeName The name of the theme that will be set.
    */
    const addTheme = useCallback(
        (pTheme : Theme) : void =>
        {
            rfThemes.current.push(pTheme);
        },
        []
    );

    const lValue = useMemo<ValueThemeContext>(
        () =>
        {
            return { 
                theme: stTheme, themes: rfThemes.current, 
                switchTheme, addTheme, incrementTheme
            }
        },
        [ stTheme, switchTheme, addTheme, incrementTheme ]
    );

    return (
        <ThemeContext.Provider 
            value = { lValue }
        >
            { children }
        </ThemeContext.Provider>
    );
}

function useTheme() 
{
    return useContext(ThemeContext);
}


export { ThemeProvider as default, useTheme };
import React, { createContext, useContext, useState, useEffect } from 'react';
// import utils from '../utils';

import { debounce } from "lodash";

interface WindowSize
{
    width : number,
    height : number,
    isLandscape: boolean,

    // Whether the screen is the typical size of a PC/laptop/tablet (i.e. not a 'narrow' device like a phone).
    isBigScreen: boolean,
}

function getWindowSize() : WindowSize
{
    return { 
        width: window.innerWidth, 
        height: window.innerHeight, 
        isLandscape: window.innerWidth > window.innerHeight,
        isBigScreen: window.innerWidth > 1000 && window.innerHeight > 800
    };
};

const WindowSizeContext = createContext<WindowSize>(getWindowSize());

interface PropsWindowSizeProvider
{
    children: React.ReactNode
}

function WindowSizeProvider({ children } : PropsWindowSizeProvider) 
{
    /* The dimensions/size of the window. */
    const [ stWindowSize, setWindowSize ] = useState<WindowSize>(getWindowSize());

    /**
    * Updates stWindowSize.
    */
    const updateWindowSize = () =>
    {
        setWindowSize(getWindowSize());
    };

    /*
    * Setup the event listener to update stWindowSize whenever the window size changes.
    */
    useEffect(
        () =>
        {
            // Initialise window size.
            updateWindowSize();

            const debouncedUpdateWindowSize = debounce(updateWindowSize, 200);

            // Set-up an event-listener for window resize.
            window.addEventListener('resize', debouncedUpdateWindowSize);

            return () =>
            {
                // Remove event listener.
                window.removeEventListener('resize', debouncedUpdateWindowSize);
            }
        },
        []
    );

    return (
        <WindowSizeContext.Provider 
            value = { stWindowSize }
        >
            { children }
        </WindowSizeContext.Provider>
    );
}

function useWindowSize() 
{
    return useContext(WindowSizeContext);
}


export { WindowSizeProvider as default, useWindowSize };
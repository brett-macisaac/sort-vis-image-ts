import React, { useMemo, memo } from "react";

import ClipLoader from "react-spinners/ClipLoader";

import { useTheme } from "../../standard_ui";

interface PropsLoadAreaStd
{
    prIsActive: boolean;
    prIsTranslucent?: boolean;
    prSizeIcon?: number;
}

/**
* A View that covers 100% of its parent's width and height, displaying a loading icon in its centre, with optional 
  transparency.

* Props:
    @param { bool } prIsActive Whether it is displayed.
    @param { bool } [prIsTranslucent=false] Whether the background is translucent (otherwisem it's solid).
    @param { number } [prSizeIcon=50] The size of the load icon.
*/
const LoadAreaStd = memo(

    function LoadAreaStd({ prIsActive, prIsTranslucent = false, prSizeIcon = 50 }: PropsLoadAreaStd)
    {
        const { theme } = useTheme();

        const lStyleCon = useMemo<React.CSSProperties>(
            () =>
            {
                return {
                    ...styles.con, 
                    backgroundColor: prIsTranslucent ? theme.std.loadArea.backgroundTranslucent : theme.std.loadArea.background,
                    display: prIsActive ? undefined : "none"
                };
            },
            [ prIsActive, prIsTranslucent, theme ]
        );

        return (
            <div style = { lStyleCon }>
                <ClipLoader
                    color = { theme.std.loadArea.loadIcon }
                    loading = { prIsActive }
                    size = { prSizeIcon }
                />
            </div>
        );
    }

);

const styles : { [key: string] : React.CSSProperties } =
{
    con:
    {
        position: "absolute", 
        width: '100%', height: '100%', 
        justifyContent: 'center', alignItems: 'center', 
        zIndex: 100
    },
};

export default LoadAreaStd;
import { Theme } from "./theme_types.ts";

import dark from "./theme_dark";
import light from "./theme_light.ts";

/*
*  Default themes for the app's components.
*/
const themesDefault : Theme[] = []
themesDefault.push(dark);
themesDefault.push(light);

const themeDefault : Theme = dark;

export {
    themesDefault as default, themeDefault
};
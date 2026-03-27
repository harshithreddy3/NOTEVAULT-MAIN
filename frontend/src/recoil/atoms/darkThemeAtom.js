import { atom } from "recoil";

export const darkThemeAtom = atom({
    key: "darkTheme",
    default: JSON.parse(localStorage.getItem('darkTheme')) || false,
});
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => cleanup());

// jsdom doesn't implement scrollIntoView; CityCombobox calls it for the active option.
Element.prototype.scrollIntoView = function () {};

// jsdom doesn't implement matchMedia either; ConfirmationView asks it whether the
// layout is stacked and whether motion is reduced. Nothing matches by default,
// which stands in for a wide window. Tests that care override it.
window.matchMedia = ((media: string) =>
  ({
    media,
    matches: false,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => false,
    addListener() {},
    removeListener() {},
  }) as unknown as MediaQueryList) as typeof window.matchMedia;

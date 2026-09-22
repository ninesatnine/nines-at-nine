import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => cleanup());

// jsdom doesn't implement scrollIntoView; CityCombobox calls it for the active option.
Element.prototype.scrollIntoView = function () {};

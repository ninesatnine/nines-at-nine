import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CityCombobox } from "./CityCombobox";

function Harness({ onPick = () => {} }: { onPick?: (city: string) => void }) {
  const [value, setValue] = useState("");
  return <CityCombobox id="city" value={value} onChange={setValue} onPick={onPick} />;
}

const optionNames = () =>
  screen
    .queryAllByRole("option")
    .map((o) => o.querySelector("span")?.textContent ?? o.textContent);

describe("CityCombobox", () => {
  it("lists every city on focus, before anything is typed", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("combobox"));
    expect(screen.queryAllByRole("option").length).toBeGreaterThan(100);
    expect(screen.getByRole("combobox").getAttribute("aria-expanded")).toBe("true");
  });

  it("narrows the list letter by letter", async () => {
    render(<Harness />);
    const input = screen.getByRole("combobox");
    await userEvent.type(input, "Ko");
    expect(optionNames().length).toBeGreaterThan(1);
    await userEvent.type(input, "lk");
    expect(optionNames()).toEqual(["Kolkata"]);
  });

  it("shows the older name alongside the current one", async () => {
    render(<Harness />);
    await userEvent.type(screen.getByRole("combobox"), "bangal");
    const option = screen.getByRole("option");
    expect(option.querySelector("span")?.textContent).toBe("Bengaluru");
    expect(option.querySelector("small")?.textContent).toBe("Bangalore");
  });

  it("says so when nothing matches", async () => {
    render(<Harness />);
    await userEvent.type(screen.getByRole("combobox"), "Xyz");
    expect(screen.getByRole("option").textContent).toMatch(/No match/);
  });

  it("selects a city with the mouse", async () => {
    const onPick = vi.fn();
    render(<Harness onPick={onPick} />);
    const input = screen.getByRole("combobox");
    await userEvent.type(input, "Pun");
    await userEvent.click(screen.getByRole("option", { name: "Pune" }));
    expect(input).toHaveProperty("value", "Pune");
    expect(onPick).toHaveBeenCalledWith("Pune");
    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });

  it("selects a city with arrow keys and Enter", async () => {
    render(<Harness />);
    const input = screen.getByRole("combobox");
    await userEvent.type(input, "Mum");
    expect(input.getAttribute("aria-activedescendant")).toBeTruthy();
    await userEvent.keyboard("{Enter}");
    expect(input).toHaveProperty("value", "Mumbai");
  });

  it("closes the list on Escape but keeps the typed text", async () => {
    render(<Harness />);
    const input = screen.getByRole("combobox");
    await userEvent.type(input, "Ch");
    await userEvent.keyboard("{Escape}");
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(input).toHaveProperty("value", "Ch");
  });

  it("settles an alias to the canonical name on blur", async () => {
    render(<Harness />);
    const input = screen.getByRole("combobox");
    await userEvent.type(input, "gurgaon");
    await userEvent.tab();
    await waitFor(() => expect(input).toHaveProperty("value", "Gurugram"));
  });
});

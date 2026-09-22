import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WaitlistForm } from "./WaitlistForm";

async function fillIn(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("First name"), "ada");
  await user.type(screen.getByLabelText("Email address"), "ada@example.com");
  await user.type(screen.getByLabelText("City"), "Jai");
  await user.click(screen.getByRole("option", { name: "Jaipur" }));
  await user.click(screen.getByRole("checkbox"));
}

const submit = () => screen.getByRole("button", { name: "Join the waitlist" });

describe("WaitlistForm", () => {
  it("says every field is required", () => {
    render(<WaitlistForm onJoined={() => {}} />);
    expect(screen.getByText("All fields are required.")).toBeTruthy();
  });

  it("hands over the name, email and city when complete, and sends nothing", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const onJoined = vi.fn();
    render(<WaitlistForm onJoined={onJoined} />);
    await fillIn(user);
    await user.click(submit());

    expect(onJoined).toHaveBeenCalledOnce();
    expect(onJoined.mock.calls[0][0]).toEqual({
      name: "Ada",
      email: "ada@example.com",
      city: "Jaipur",
    });
    // The API needs gender and age too, so page one is offline.
    expect(fetchMock).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("blocks submission and shows an error for every missing field", async () => {
    const onJoined = vi.fn();
    render(<WaitlistForm onJoined={onJoined} />);
    await userEvent.click(submit());

    expect(onJoined).not.toHaveBeenCalled();
    expect(screen.getByText("Enter your first name.")).toBeTruthy();
    expect(screen.getByText(/name@example\.com/)).toBeTruthy();
    expect(screen.getByText("Enter the city you live in.")).toBeTruthy();
    expect(screen.getByText("Please confirm you’re 18 or older.")).toBeTruthy();
  });

  it("rejects a city that is not on the list", async () => {
    const user = userEvent.setup();
    const onJoined = vi.fn();
    render(<WaitlistForm onJoined={onJoined} />);
    await user.type(screen.getByLabelText("First name"), "Ada");
    await user.type(screen.getByLabelText("Email address"), "ada@example.com");
    await user.type(screen.getByLabelText("City"), "Some Small Town");
    await user.click(screen.getByRole("checkbox"));
    await user.click(submit());

    expect(onJoined).not.toHaveBeenCalled();
    expect(screen.getByText("Choose your city from the list.")).toBeTruthy();
  });

  it("rejects a malformed email", async () => {
    const user = userEvent.setup();
    const onJoined = vi.fn();
    render(<WaitlistForm onJoined={onJoined} />);
    await user.type(screen.getByLabelText("First name"), "Ada");
    await user.type(screen.getByLabelText("Email address"), "nope");
    await user.click(submit());

    expect(onJoined).not.toHaveBeenCalled();
    expect(screen.getByText(/name@example\.com/)).toBeTruthy();
  });

  it("stays silent for the honeypot", async () => {
    const user = userEvent.setup();
    const onJoined = vi.fn();
    const { container } = render(<WaitlistForm onJoined={onJoined} />);
    await fillIn(user);
    const trap = container.querySelector("#website") as HTMLInputElement;
    await user.type(trap, "https://spam.example");
    await user.click(submit());

    expect(onJoined).not.toHaveBeenCalled();
  });
});

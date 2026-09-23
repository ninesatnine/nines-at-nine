import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmationView } from "./ConfirmationView";

const joined = { name: "Ada", email: "ada@example.com", city: "Pune" };

/** jsdom has no canvas, so stand in for just enough of it to reach toBlob. */
function stubCanvas() {
  // createRadialGradient's result gets addColorStop called on it.
  const gradient = { addColorStop: () => undefined };
  const ctx = new Proxy(
    { canvas: null, font: "", fillStyle: "", strokeStyle: "", lineWidth: 0, letterSpacing: "" },
    {
      get: (target, prop) => (prop in target ? Reflect.get(target, prop) : () => gradient),
      set: (target, prop, value) => Reflect.set(target, prop, value),
    },
  );
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    ctx as unknown as CanvasRenderingContext2D,
  );
  vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation((cb) =>
    cb(new Blob(["png"], { type: "image/png" })),
  );
}

function mockFetch(body: unknown, status = 201) {
  const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

let clicks: HTMLAnchorElement[];

beforeEach(() => {
  stubCanvas();
  clicks = [];
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
    this: HTMLAnchorElement,
  ) {
    clicks.push(this);
  });
  // Spy on the two methods only — replacing URL itself breaks next/image.
  URL.createObjectURL = vi.fn(() => "blob:card");
  URL.revokeObjectURL = vi.fn();
  // jsdom has no font loading API.
  Object.defineProperty(document, "fonts", { value: undefined, configurable: true });
  // jsdom never loads images, so neither onload nor onerror would ever fire.
  vi.stubGlobal(
    "Image",
    class {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      naturalWidth = 186;
      naturalHeight = 240;
      set src(_value: string) {
        queueMicrotask(() => this.onload?.());
      }
    },
  );
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

async function complete(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "Woman" }));
  await user.type(screen.getByLabelText("MY AGE"), "30");
}

describe("ConfirmationView", () => {
  const submit = () => screen.getByRole("button", { name: /Submit/ });
  // Two ways to save once revealed: the main button, and the icon in the card's corner.
  const saveBtn = () => screen.getByRole("button", { name: "Save your card" });
  const cornerSave = () => screen.getByRole("button", { name: "Save your card as an image" });

  it("covers the card until the entry is registered", () => {
    render(<ConfirmationView joined={joined} onBack={() => {}} />);
    expect(
      screen.getByText("Complete the rest of the details to reveal your card."),
    ).toBeTruthy();
    expect(submit()).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Save your card/ })).toBeNull();
  });

  it("reveals the card on a successful submit, and only then offers the save", async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetch({ status: "created", count: 255 }, 201);
    render(<ConfirmationView joined={joined} onBack={() => {}} />);
    await complete(user);

    // Nothing sent while filling in the card.
    expect(fetchMock).not.toHaveBeenCalled();

    await user.click(submit());

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      name: "Ada",
      email: "ada@example.com",
      gender: "female",
      age: "30",
      city: "Pune",
    });

    // Uncovered, numbered, and the button has become the save.
    await waitFor(() =>
      expect(
        screen.queryByText("Complete the rest of the details to reveal your card."),
      ).toBeNull(),
    );
    expect(screen.getByText("Nº 255")).toBeTruthy();
    expect(screen.getByText("CARD COMPLETE")).toBeTruthy();
    expect(saveBtn()).toBeTruthy();
    expect(cornerSave()).toBeTruthy();

    // Submitting did not download anything on its own.
    expect(clicks).toHaveLength(0);
  });

  it("downloads the card, named after the number, on the second press", async () => {
    const user = userEvent.setup();
    mockFetch({ status: "created", count: 255 }, 201);
    render(<ConfirmationView joined={joined} onBack={() => {}} />);
    await complete(user);
    await user.click(submit());
    await waitFor(() => expect(screen.getByText("Nº 255")).toBeTruthy());

    await user.click(saveBtn());

    await waitFor(() => expect(clicks).toHaveLength(1));
    expect(clicks[0].download).toBe("nines-at-nine-card-255.png");
  });

  it("downloads from the icon in the card's corner too", async () => {
    const user = userEvent.setup();
    mockFetch({ status: "created", count: 255 }, 201);
    render(<ConfirmationView joined={joined} onBack={() => {}} />);
    await complete(user);
    await user.click(submit());
    await waitFor(() => expect(screen.getByText("Nº 255")).toBeTruthy());

    await user.click(cornerSave());

    await waitFor(() => expect(clicks).toHaveLength(1));
    expect(clicks[0].download).toBe("nines-at-nine-card-255.png");
  });

  it("accepts 200 for an entry that already existed", async () => {
    const user = userEvent.setup();
    mockFetch({ status: "updated", count: 42 }, 200);
    render(<ConfirmationView joined={joined} onBack={() => {}} />);
    await complete(user);
    await user.click(submit());

    await waitFor(() => expect(screen.getByText("Nº 42")).toBeTruthy());
    expect(saveBtn()).toBeTruthy();
  });

  it("keeps the card covered when registration is rejected, and says why", async () => {
    const user = userEvent.setup();
    mockFetch({ error: "gender must be one of: male, female, other" }, 400);
    render(<ConfirmationView joined={joined} onBack={() => {}} />);
    await complete(user);
    await user.click(submit());

    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toBe(
        "gender must be one of: male, female, other",
      ),
    );
    expect(
      screen.getByText("Complete the rest of the details to reveal your card."),
    ).toBeTruthy();
    expect(clicks).toHaveLength(0);
    expect(screen.queryByText(/Nº \d/)).toBeNull();
  });

  it("will not submit, or send anything, until gender and age are given", async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetch({ status: "created", count: 1 }, 201);
    render(<ConfirmationView joined={joined} onBack={() => {}} />);
    await user.click(submit());

    expect(fetchMock).not.toHaveBeenCalled();
    expect(clicks).toHaveLength(0);
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toBe("Add your gender and age first"),
    );
  });
});

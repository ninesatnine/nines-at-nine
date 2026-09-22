"use client";

import { type RefObject, useEffect, useId, useRef, useState } from "react";

import { type CityMatch, exactCity, matchCities } from "@/lib/cities";

type Props = {
  id: string;
  value: string;
  /** Fires on every keystroke and on picking from the list. */
  onChange: (value: string) => void;
  /** Fires only when a city is settled on, by click, Enter or blur. */
  onPick?: (city: string) => void;
  describedBy?: string;
  invalid?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
};

/** Splits `name` around the first occurrence of `query`, for the <mark>. */
function highlight(name: string, query: string) {
  const q = query.trim();
  const at = q ? name.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (at < 0) return <>{name}</>;
  return (
    <>
      {name.slice(0, at)}
      <mark>{name.slice(at, at + q.length)}</mark>
      {name.slice(at + q.length)}
    </>
  );
}

export function CityCombobox({
  id,
  value,
  onChange,
  onPick,
  describedBy,
  invalid = false,
  inputRef,
}: Props) {
  const listId = `${useId()}-city-list`;
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<CityMatch[]>([]);
  const [active, setActive] = useState(-1);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(blurTimer.current), []);

  function refresh(next: string) {
    const matches = matchCities(next);
    setOptions(matches);
    // With an empty box every city is listed, so nothing is preselected.
    setActive(next.trim() && matches.length ? 0 : -1);
    setOpen(true);
  }

  function pick(index: number) {
    const option = options[index];
    if (!option) return;
    onChange(option.name);
    onPick?.(option.name);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) refresh(value);
      else if (options.length) setActive((i) => (i + 1 + options.length) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (options.length) setActive((i) => (i - 1 + options.length) % options.length);
    } else if (e.key === "Enter" && open && active >= 0) {
      e.preventDefault();
      pick(active);
    } else if (e.key === "Escape" && open) {
      e.stopPropagation();
      setOpen(false);
    }
  }

  const activeId = open && active >= 0 ? `${listId}-${active}` : undefined;

  return (
    <div className="combo">
      <input
        id={id}
        ref={inputRef}
        name="city"
        type="text"
        autoComplete="off"
        placeholder="Start typing your city"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={activeId}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        value={value}
        onFocus={() => refresh(value)}
        onChange={(e) => {
          onChange(e.target.value);
          refresh(e.target.value);
        }}
        onKeyDown={onKeyDown}
        onBlur={() => {
          // Let a click on an option land before the list closes.
          blurTimer.current = setTimeout(() => {
            setOpen(false);
            const canonical = exactCity(value);
            if (canonical) {
              onChange(canonical);
              onPick?.(canonical);
            }
          }, 120);
        }}
      />
      <svg
        className="combo-caret"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
      <ul className="combo-list" id={listId} role="listbox" aria-label="Cities" hidden={!open}>
        {options.length === 0 ? (
          <li className="none" role="option" aria-selected={false} aria-disabled="true">
            No match. Try the nearest big city.
          </li>
        ) : (
          options.map((option, i) => (
            <li
              key={option.name}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(i)}
            >
              <span>{highlight(option.name, value)}</span>
              {option.alias ? <small>{option.alias}</small> : null}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

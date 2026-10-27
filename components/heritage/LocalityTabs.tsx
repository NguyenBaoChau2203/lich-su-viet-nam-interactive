"use client";

import type { MouseEvent } from "react";

type Props = {
  active: "places" | "people";
  placesHref: string;
  peopleHref: string;
  onSwitch(mode: "places" | "people"): void;
};

const modified = (event: MouseEvent) =>
  event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey;

export function LocalityTabs({ active, placesHref, peopleHref, onSwitch }: Props) {
  return (
    <nav className="locality-tabs" aria-label="Phân loại nội dung theo địa phương">
      <a
        href={placesHref}
        className={`locality-tab${active === "places" ? " is-active" : ""}`}
        aria-current={active === "places" ? "page" : undefined}
        onClick={(event) => {
          if (!modified(event)) {
            event.preventDefault();
            onSwitch("places");
          }
        }}
      >
        Địa danh
      </a>
      <a
        href={peopleHref}
        className={`locality-tab${active === "people" ? " is-active" : ""}`}
        aria-current={active === "people" ? "page" : undefined}
        onClick={(event) => {
          if (!modified(event)) {
            event.preventDefault();
            onSwitch("people");
          }
        }}
      >
        Nhân vật
      </a>
    </nav>
  );
}

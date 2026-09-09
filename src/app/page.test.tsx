import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("Home", () => {
  it("introduces the history exploration MVP", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /khám phá lịch sử việt nam/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/25–35 sự kiện tiêu biểu/i)).toBeInTheDocument();
  });
});

import React from "react";
import { render } from "@testing-library/react";
import UserPage from "./UserPage";

describe("HomePage", () => {
  describe("Layout", () => {
    it("has root page div", () => {
      const { queryByTestId } = render(<UserPage />);
      const UserPageDiv = queryByTestId("UserPage");
      expect(UserPageDiv).toBeInTheDocument();
    });
  });
});

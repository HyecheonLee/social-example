import React from "react";
import {render} from "@testing-library/react";
import HoaxSubmit from "./HoaxSubmit";

describe('HoaxSubmit', function () {
  describe('Layout', () => {
    it('has textarea', () => {
      const {container} = render(<HoaxSubmit/>);
      const textArea = container.querySelector("textarea");
      expect(textArea).toBeInTheDocument();
    });
    it('has image', () => {
      const {container} = render(<HoaxSubmit/>);
      const img = container.querySelector("img");
      expect(img).toBeInTheDocument();
    });
    it('displays textarea 1 line', () => {
      const {container} = render(<HoaxSubmit/>);
      const textArea = container.querySelector("textarea");
      expect(textArea.rows).toBe(1)
    });
  });
});
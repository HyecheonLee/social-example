import React from "react";
import {fireEvent, render} from "@testing-library/react";
import HoaxSubmit from "./HoaxSubmit";
import {createStore} from "redux";
import rootReducer from "../redux";
import {Provider} from "react-redux";

const defaultState = {
  id: 1,
  username: "user1",
  displayName: "display1",
  image: "profile1.png",
  password: "P4ssword",
  isLoggedIn: true
};

let store;
const setup = (state = defaultState) => {
  store = createStore(rootReducer, {auth: {...state}});
  return render(
      <Provider store={store}>
        <HoaxSubmit/>
      </Provider>
  );
};

describe("HoaxSubmit", function () {
  describe("Layout", () => {
    it("has textarea", () => {
      const {container} = setup();
      const textArea = container.querySelector("textarea");
      expect(textArea).toBeInTheDocument();
    });
    it("has image", () => {
      const {container} = setup();
      const img = container.querySelector("img");
      expect(img).toBeInTheDocument();
    });
    it("displays textarea 1 line", () => {
      const {container} = setup();
      const textArea = container.querySelector("textarea");
      expect(textArea.rows).toBe(1);
    });
    it("display user image", () => {
      const {container} = setup();
      const img = container.querySelector("img");
      expect(img.src).toContain("/images/profile/" + defaultState.image);
    });
  });
  describe("Interaction", () => {
    it("displays 3 row when focused to textarea", () => {
      const {container} = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      expect(textArea.rows).toBe(3);
    });
    it("displays hoaxify button when focused to textarea", () => {
      const {container, queryByText} = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      const hoaxifyButton = queryByText("Hoaxify");
      expect(hoaxifyButton).toBeInTheDocument();
    });
    it("displays Cancel button when focused to textarea", () => {
      const {container, queryByText} = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      const cancelButton = queryByText("Cancel");
      expect(cancelButton).toBeInTheDocument();
    });
    it("does not display Hoaxify button when not focused to textarea", () => {
      const {container, queryByText} = setup();
      const HoaxifyButton = queryByText("Hoaxify");
      expect(HoaxifyButton).not.toBeInTheDocument();
    });
    it("does not display Cancel button when not focused to textarea", () => {
      const {container, queryByText} = setup();
      const cancelButton = queryByText("Cancel");
      expect(cancelButton).not.toBeInTheDocument();
    });
    it("returns back to unfocused state after clicking the cancel", () => {
      const {container, queryByText} = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      const cancelButton = queryByText("Cancel");
      fireEvent.click(cancelButton);
      expect(queryByText("Cancel")).not.toBeInTheDocument();
    });
  });
});

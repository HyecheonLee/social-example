import React from "react";
import {render} from "@testing-library/react";
import HomePage from "./HomePage";
import {createStore} from "redux";
import rootReducer from "../redux";
import {Provider} from "react-redux";
import HoaxSubmit from "../components/HoaxSubmit";

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
        <HomePage/>
      </Provider>
  );
};

describe("HomePage", () => {
  describe("Layout", () => {
    it("has root page div", () => {
      const {queryByTestId} = setup();
      const homePageDiv = queryByTestId("homepage");
      expect(homePageDiv).toBeInTheDocument();
    });
  });
});

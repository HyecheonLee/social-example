import React from "react";
import {
  fireEvent,
  render,
  waitForDomChange,
  waitForElement
} from "@testing-library/react";
import UserSignupPage from "./UserSignupPage";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
const mockStore = configureStore([]);
describe("UserSignupPage", () => {
  let setup;
  let store;
  beforeEach(() => {
    store = mockStore({
      myState: "sample text"
    });
    setup = props => {
      return render(
        <Provider store={store}>
          <UserSignupPage {...props} />
        </Provider>
      );
    };
  });
  describe("Layout", () => {
    it("has header of Sign Up", () => {
      const { container } = setup();
      const header = container.querySelector("h1");
      expect(header).toHaveTextContent("Sign up");
    });
    it("has input for display name", () => {
      let { queryByPlaceholderText } = setup();
      let displayNameInput = queryByPlaceholderText("Your display name");
      expect(displayNameInput).toBeInTheDocument();
    });
    it("has input for name", () => {
      let { queryByPlaceholderText } = setup();
      let usernameInput = queryByPlaceholderText("Your username");
      expect(usernameInput).toBeInTheDocument();
    });
    it("has input for password", () => {
      let { queryByPlaceholderText } = setup();
      let passwordInput = queryByPlaceholderText("Your password");
      expect(passwordInput).toBeInTheDocument();
    });
    it("has password type for password input", () => {
      let { queryByPlaceholderText } = setup();
      let passwordInput = queryByPlaceholderText("Your password");
      expect(passwordInput.type).toBe("password");
    });
    it("has input for password repeat", () => {
      let { queryByPlaceholderText } = setup();
      let passwordRepeat = queryByPlaceholderText("Repeat your password");
      expect(passwordRepeat).toBeInTheDocument();
    });
    it("has password type for password repeat input", () => {
      let { queryByPlaceholderText } = setup();
      let passwordRepeat = queryByPlaceholderText("Repeat your password");
      expect(passwordRepeat.type).toBe("password");
    });
    it("has submit button", () => {
      let { container } = setup();
      let button = container.querySelector("button");
      expect(button).toBeInTheDocument();
    });
  });
  describe("Inter actions", () => {
    const mockAsyncDelayed = () =>
      jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });
    const changeEvent = value => {
      return {
        target: {
          value
        }
      };
    };
    let button,
      displayNameInput,
      usernameInput,
      passwordInput,
      passwordRepeatInput;
    const setupForSubmit = props => {
      let rendered = setup(props);

      const { container, queryByPlaceholderText } = rendered;

      displayNameInput = queryByPlaceholderText("Your display name");
      usernameInput = queryByPlaceholderText("Your username");
      passwordInput = queryByPlaceholderText("Your password");
      passwordRepeatInput = queryByPlaceholderText("Repeat your password");

      fireEvent.change(displayNameInput, changeEvent("displayName"));
      fireEvent.change(usernameInput, changeEvent("username"));
      fireEvent.change(passwordInput, changeEvent("password"));
      fireEvent.change(passwordRepeatInput, changeEvent("password"));

      button = container.querySelector("button");
      return rendered;
    };

    it("sets the displayName value into state", () => {
      const { queryByPlaceholderText } = setup();
      const displayNameInput = queryByPlaceholderText("Your display name");
      const changeEvent = {
        target: {
          value: "my-display-name"
        }
      };
      fireEvent.change(displayNameInput, changeEvent);
      expect(displayNameInput).toHaveValue("my-display-name");
    });
    it("sets the username value into state", () => {
      const { queryByPlaceholderText } = setup();
      const usernameInput = queryByPlaceholderText("Your username");
      const changeEvent = {
        target: {
          value: "username"
        }
      };
      fireEvent.change(usernameInput, changeEvent);
      expect(usernameInput).toHaveValue("username");
    });
    it("sets the password value into state", () => {
      const { queryByPlaceholderText } = setup();
      const passwordInput = queryByPlaceholderText("Your password");
      const changeEvent = {
        target: {
          value: "password"
        }
      };
      fireEvent.change(passwordInput, changeEvent);
      expect(passwordInput).toHaveValue("password");
    });
    it("sets the passwordRepeat value into state", () => {
      const { queryByPlaceholderText } = setup();
      const passwordRepeatInput = queryByPlaceholderText(
        "Repeat your password"
      );
      const changeEvent = {
        target: {
          value: "passwordRepeat"
        }
      };
      fireEvent.change(passwordRepeatInput, changeEvent);
      expect(passwordRepeatInput).toHaveValue("passwordRepeat");
    });
    it("calls postSignup when the fields are valid and the actions are provided in props", () => {
      store.dispatch = jest.fn().mockResolvedValueOnce({});
      setupForSubmit();
      fireEvent.click(button);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
    });

    it("does not throw exception when clicking the button when actions not provided in props", () => {
      setupForSubmit();
      expect(() => fireEvent.click(button).not.toThrow());
    });
    xit("calls post with user body when the fields are valid", () => {
      store.dispatch = jest.fn().mockResolvedValueOnce({});
      setupForSubmit();
      fireEvent.click(button);
      const expectedUserObject = {
        username: "username",
        displayName: "displayName",
        password: "password"
      };
      expect(store.dispatch).toHaveBeenCalledWith(expectedUserObject);
    });
    xit("does not allow user to click the sign up button when there is an ongoing api call", () => {
      const actions = {
        postSignup: mockAsyncDelayed()
      };
      setupForSubmit({ actions });
      fireEvent.click(button);

      fireEvent.click(button);
      expect(actions.postSignup).toHaveBeenCalledTimes(1);
    });
    xit("display spinner when there is an orgoing api call", () => {
      const actions = {
        postSignup: mockAsyncDelayed()
      };
      const { queryByText } = setupForSubmit({ actions });
      fireEvent.click(button);

      const spinner = queryByText("Loading...");
      expect(spinner).toBeInTheDocument();
    });
    it("hides spinner after api call finishes successfully", async () => {
      store.dispatch = mockAsyncDelayed();
      const { queryByText } = setupForSubmit();
      fireEvent.click(button);

      await waitForDomChange();

      const spinner = queryByText("Loading...");
      expect(spinner).not.toBeInTheDocument();
    });
    it("hides spinner after api call finishes error", async () => {
      store.dispatch = store.dispatch = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            reject({
              response: { data: {} }
            });
          }, 300);
        });
      });
      const { queryByText } = setupForSubmit();
      fireEvent.click(button);

      await waitForDomChange();

      const spinner = queryByText("Loading...");
      expect(spinner).not.toBeInTheDocument();
    });
    it("displays validation error fro displayName when error is received for the field", async () => {
      store.dispatch = jest.fn().mockRejectedValue({
        response: {
          data: {
            validationErrors: {
              displayName: "Cannot be null"
            }
          }
        }
      });
      const { queryByText } = setupForSubmit();
      fireEvent.click(button);

      const errorMessage = await waitForElement(() =>
        queryByText("Cannot be null")
      );
      expect(errorMessage).toBeInTheDocument();
    });
    it("disables the signup button when password repeat does not match to password", function() {
      setupForSubmit();
      fireEvent.change(passwordRepeatInput, changeEvent("new-pass"));
      expect(button).toBeDisabled();
    });
    it("disables the signup button when password does not match to password repeat", function() {
      setupForSubmit();
      fireEvent.change(passwordInput, changeEvent("new-pass"));
      expect(button).toBeDisabled();
    });
    it("displays error styles for password repeat input password repeat mismatch", () => {
      const { queryByText } = setupForSubmit();
      fireEvent.change(passwordRepeatInput, changeEvent("new-pass"));
      const mismatchWarning = queryByText("Repeat your password");
      expect(mismatchWarning).toBeInTheDocument();
    });
    it("displays error style for password repeat input when password input mismatch", () => {});
    it("hides the validation error when user changes the content of displayName", async () => {
      store.dispatch = jest.fn().mockRejectedValue({
        response: {
          data: {
            validationErrors: {
              displayName: "Cannot be null"
            }
          }
        }
      });
      const { queryByText } = setupForSubmit();
      fireEvent.click(button);

      await waitForElement(() => queryByText("Cannot be null"));
      fireEvent.change(displayNameInput, changeEvent("name updated"));

      const errorMessage = queryByText("Cannot be null");
      expect(errorMessage).not.toBeInTheDocument();
    });
    it("hides the validation error when user changes the content of username", async () => {
      store.dispatch = jest.fn().mockRejectedValue({
        response: {
          data: {
            validationErrors: {
              username: "Username cannot be null"
            }
          }
        }
      });
      const { queryByText } = setupForSubmit();
      fireEvent.click(button);

      await waitForElement(() => queryByText("Username cannot be null"));
      fireEvent.change(usernameInput, changeEvent("name updated"));

      const errorMessage = queryByText("Username cannot be null");
      expect(errorMessage).not.toBeInTheDocument();
    });
    it("hides the validation error when user changes the content of password", async () => {
      store.dispatch = jest.fn().mockRejectedValue({
        response: {
          data: {
            validationErrors: {
              password: "cannot be null"
            }
          }
        }
      });
      const { queryByText } = setupForSubmit();
      fireEvent.click(button);

      await waitForElement(() => queryByText("cannot be null"));
      fireEvent.change(passwordInput, changeEvent("name updated"));

      const errorMessage = queryByText("cannot be null");
      expect(errorMessage).not.toBeInTheDocument();
    });
    it("redirects to homePage after successful signup", async () => {
      store.dispatch = jest.fn().mockResolvedValue({});
      const history = {
        push: jest.fn()
      };
      setupForSubmit({ history });
      fireEvent.click(button);

      await waitForDomChange();

      expect(history.push).toHaveBeenCalledWith("/");
    });
  });
});
console.error = () => {};

import React from "react";
import {
  fireEvent,
  render,
  waitForDomChange,
  waitForElement
} from "@testing-library/react";
import LoginPage from "./LoginPage";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

const mockStore = configureStore([]);

describe("LoginPage", () => {
  let setup;
  let store;
  beforeEach(() => {
    store = mockStore({});
    setup = props => {
      return render(
        <Provider store={store}>
          <LoginPage {...props} />
        </Provider>
      );
    };
  });
  describe("Layout", () => {
    it("has header of Login", () => {
      const { container } = setup();
      const header = container.querySelector("h1");
      expect(header).toHaveTextContent("Login");
    });
    it("has input for username", () => {
      const { queryByPlaceholderText } = setup();
      const usernameInput = queryByPlaceholderText("Your username");
      expect(usernameInput).toBeInTheDocument();
    });
    it("has input for password", () => {
      const { queryByPlaceholderText } = setup();
      const passwordInput = queryByPlaceholderText("Your password");
      expect(passwordInput).toBeInTheDocument();
    });
    it("has password type for password input", () => {
      const { queryByPlaceholderText } = setup();
      const passwordInput = queryByPlaceholderText("Your password");
      expect(passwordInput.type).toBe("password");
    });
    it("has login button", () => {
      const { container } = setup();
      const button = container.querySelector("button");
      expect(button).toBeInTheDocument();
    });
  });
  describe("Interactions", () => {
    const changeEvent = content => {
      return {
        target: {
          value: content
        }
      };
    };
    const mockAsyncDelayed = () =>
      jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });
    let usernameInput, passwordInput, button;

    function setupForSubmit(props) {
      const rendered = setup(props);
      const { container, queryByPlaceholderText } = rendered;

      usernameInput = queryByPlaceholderText("Your username");
      fireEvent.change(usernameInput, changeEvent("my-user-name"));

      passwordInput = queryByPlaceholderText("Your password");
      fireEvent.change(passwordInput, changeEvent("P4ssword"));

      button = container.querySelector("button");
      return rendered;
    }

    it("sets the username value into state", () => {
      const { queryByPlaceholderText } = setup();
      const usernameInput = queryByPlaceholderText("Your username");
      fireEvent.change(usernameInput, changeEvent("my-user-name"));
      expect(usernameInput).toHaveValue("my-user-name");
    });
    it("sets the password value into state", () => {
      const { queryByPlaceholderText } = setup();
      const passwordInput = queryByPlaceholderText("Your password");
      fireEvent.change(passwordInput, changeEvent("p4ssword"));
      expect(passwordInput).toHaveValue("p4ssword");
    });
    it("calls postLogin when the actions are provided in props and input fields have value", () => {
      store.dispatch = jest.fn().mockResolvedValueOnce({});
      setupForSubmit();
      fireEvent.click(button);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
    });
    it("does not throw exception when clicking the button when actions not provide in props", () => {
      setupForSubmit();
      expect(() => fireEvent.click(button)).not.toThrow();
    });
    xit("calls postLogin with credentials in body", () => {
      store.dispatch = jest.fn().mockResolvedValueOnce({});
      setupForSubmit();
      fireEvent.click(button);
      const expectedUserObject = {
        username: "my-user-name",
        password: "P4ssword"
      };
      expect(store.dispatch).toHaveBeenCalledWith(expectedUserObject);
    });
    it("enables the button when username and password is not empty ", () => {
      setupForSubmit();
      expect(button).not.toBeDisabled();
    });
    it("disables the button when username  is  empty ", () => {
      setupForSubmit();
      fireEvent.change(usernameInput, changeEvent(""));
      expect(button).toBeDisabled();
    });
    it("disables the button when  password is  empty ", () => {
      setupForSubmit();
      fireEvent.change(passwordInput, changeEvent(""));
      expect(button).toBeDisabled();
    });
    it("displays alert when login fails", async () => {
      store.dispatch = jest.fn().mockRejectedValue({
        response: {
          data: {
            message: "Login failed"
          }
        }
      });
      const { queryByText } = setupForSubmit();
      fireEvent.click(button);
      const alert = await waitForElement(() => queryByText("Login failed"));
      expect(alert).toBeInTheDocument();
    });
    it("clears alert when user changes username", async () => {
      store.dispatch = jest.fn().mockRejectedValue({
        response: {
          data: {
            message: "Login failed"
          }
        }
      });
      const { queryByText } = setupForSubmit();
      fireEvent.click(button);

      await waitForElement(() => queryByText("Login failed"));
      fireEvent.change(usernameInput, changeEvent("updated-username"));

      const alert = queryByText("Login failed");
      expect(alert).not.toBeInTheDocument();
    });
    it("does not allow user to click the Login button when there is an ongoing api call", () => {
      store.dispatch = mockAsyncDelayed();
      setupForSubmit();
      fireEvent.click(button);
      fireEvent.click(button);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
    });
    it("displays spinner when there is an ongoing api call", () => {
      const actions = {
        postLogin: mockAsyncDelayed()
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
    it("hides spinner after api call finishes wit error", async () => {
      store.dispatch = jest.fn().mockImplementation(() => {
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
    it("redirects to homePage after successful login", async () => {
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

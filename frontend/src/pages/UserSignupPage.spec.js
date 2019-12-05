import React from "react";
import {
  render,
  fireEvent,
  waitForDomChange,
  waitForElement
} from "@testing-library/react";
import UserSignupPage from "./UserSignupPage";

describe("UserSignupPage", () => {
  describe("Layout", () => {
    it("has header of Sign Up", () => {
      const { container } = render(<UserSignupPage />);
      const header = container.querySelector("h1");
      expect(header).toHaveTextContent("Sign up");
    });
    it("has input for display name", () => {
      let { queryByPlaceholderText } = render(<UserSignupPage />);
      let displayNameInput = queryByPlaceholderText("당신의 아이디");
      expect(displayNameInput).toBeInTheDocument();
    });
    it("has input for name", () => {
      let { queryByPlaceholderText } = render(<UserSignupPage />);
      let usernameInput = queryByPlaceholderText("당신의 성함");
      expect(usernameInput).toBeInTheDocument();
    });
    it("has input for password", () => {
      let { queryByPlaceholderText } = render(<UserSignupPage />);
      let passwordInput = queryByPlaceholderText("당신의 비밀번호");
      expect(passwordInput).toBeInTheDocument();
    });
    it("has password type for password input", () => {
      let { queryByPlaceholderText } = render(<UserSignupPage />);
      let passwordInput = queryByPlaceholderText("당신의 비밀번호");
      expect(passwordInput.type).toBe("password");
    });
    it("has input for password repeat", () => {
      let { queryByPlaceholderText } = render(<UserSignupPage />);
      let passwordRepeat = queryByPlaceholderText("비밀번호 확인");
      expect(passwordRepeat).toBeInTheDocument();
    });
    it("has password type for password repeat input", () => {
      let { queryByPlaceholderText } = render(<UserSignupPage />);
      let passwordRepeat = queryByPlaceholderText("비밀번호 확인");
      expect(passwordRepeat.type).toBe("password");
    });
    it("has submit button", () => {
      let { container } = render(<UserSignupPage />);
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
      let rendered = render(<UserSignupPage {...props} />);
      const { container, queryByPlaceholderText } = rendered;
      displayNameInput = queryByPlaceholderText("당신의 아이디");
      usernameInput = queryByPlaceholderText("당신의 성함");
      passwordInput = queryByPlaceholderText("당신의 비밀번호");
      passwordRepeatInput = queryByPlaceholderText("비밀번호 확인");
      button = container.querySelector("button");

      fireEvent.change(displayNameInput, changeEvent("displayName"));
      fireEvent.change(usernameInput, changeEvent("username"));
      fireEvent.change(passwordInput, changeEvent("password"));
      fireEvent.change(passwordRepeatInput, changeEvent("password"));

      return rendered;
    };

    it("sets the displayName value into state", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const displayNameInput = queryByPlaceholderText("당신의 아이디");
      const changeEvent = {
        target: {
          value: "my-display-name"
        }
      };
      fireEvent.change(displayNameInput, changeEvent);
      expect(displayNameInput).toHaveValue("my-display-name");
    });
    it("sets the username value into state", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const usernameInput = queryByPlaceholderText("당신의 성함");
      const changeEvent = {
        target: {
          value: "username"
        }
      };
      fireEvent.change(usernameInput, changeEvent);
      expect(usernameInput).toHaveValue("username");
    });
    it("sets the password value into state", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const passwordInput = queryByPlaceholderText("당신의 비밀번호");
      const changeEvent = {
        target: {
          value: "password"
        }
      };
      fireEvent.change(passwordInput, changeEvent);
      expect(passwordInput).toHaveValue("password");
    });
    it("sets the passwordRepeat value into state", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const passwordRepeatInput = queryByPlaceholderText("비밀번호 확인");
      const changeEvent = {
        target: {
          value: "passwordRepeat"
        }
      };
      fireEvent.change(passwordRepeatInput, changeEvent);
      expect(passwordRepeatInput).toHaveValue("passwordRepeat");
    });
    it("calls postSignup when the fields are valid and the actions are provided in props", () => {
      const actions = {
        postSignup: jest.fn().mockResolvedValueOnce({})
      };
      setupForSubmit({ actions });
      fireEvent.click(button);
      expect(actions.postSignup).toHaveBeenCalledTimes(1);
    });

    it("does not throw exception when clicking the button when actions not provided in props", () => {
      setupForSubmit();
      expect(() => fireEvent.click(button).not.toThrow());
    });
    it("calls post with user body when the fields are valid", () => {
      const actions = {
        postSignup: jest.fn().mockResolvedValueOnce({})
      };
      setupForSubmit({ actions });
      fireEvent.click(button);
      const expectedUserObject = {
        username: "username",
        displayName: "displayName",
        password: "password"
      };
      expect(actions.postSignup).toHaveBeenCalledWith(expectedUserObject);
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
      const actions = {
        postSignup: mockAsyncDelayed()
      };
      const { queryByText } = setupForSubmit({ actions });
      fireEvent.click(button);

      await waitForDomChange();

      const spinner = queryByText("Loading...");
      expect(spinner).not.toBeInTheDocument();
    });
    it("hides spinner after api call finishes error", async () => {
      const actions = {
        postSignup: jest.fn().mockImplementation(() => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              reject({
                response: { data: {} }
              });
            }, 300);
          });
        })
      };
      const { queryByText } = setupForSubmit({ actions });
      fireEvent.click(button);

      await waitForDomChange();

      const spinner = queryByText("Loading...");
      expect(spinner).not.toBeInTheDocument();
    });
    it("displays validation error fro displayName when error is received for the field", async () => {
      const actions = {
        postSignup: jest.fn().mockRejectedValue({
          response: {
            data: {
              validationErrors: {
                displayName: "Cannot be null"
              }
            }
          }
        })
      };
      const { queryByText } = setupForSubmit({ actions });
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
      const mismatchWarning = queryByText("비밀번호 확인");
      expect(mismatchWarning).toBeInTheDocument();
    });
    it("displays error style for password repeat input when password input mismatch", () => {});
    it("hides the validation error when user changes the content of displayName", async () => {
      const actions = {
        postSignup: jest.fn().mockRejectedValue({
          response: {
            data: {
              validationErrors: {
                displayName: "Cannot be null"
              }
            }
          }
        })
      };
      const { queryByText } = setupForSubmit({ actions });
      fireEvent.click(button);

      await waitForElement(() => queryByText("Cannot be null"));
      fireEvent.change(displayNameInput, changeEvent("name updated"));

      const errorMessage = queryByText("Cannot be null");
      expect(errorMessage).not.toBeInTheDocument();
    });
    it("hides the validation error when user changes the content of username", async () => {
      const actions = {
        postSignup: jest.fn().mockRejectedValue({
          response: {
            data: {
              validationErrors: {
                username: "Username cannot be null"
              }
            }
          }
        })
      };
      const { queryByText } = setupForSubmit({ actions });
      fireEvent.click(button);

      await waitForElement(() => queryByText("Username cannot be null"));
      fireEvent.change(usernameInput, changeEvent("name updated"));

      const errorMessage = queryByText("Username cannot be null");
      expect(errorMessage).not.toBeInTheDocument();
    });
    it("hides the validation error when user changes the content of password", async () => {
      const actions = {
        postSignup: jest.fn().mockRejectedValue({
          response: {
            data: {
              validationErrors: {
                password: "cannot be null"
              }
            }
          }
        })
      };
      const { queryByText } = setupForSubmit({ actions });
      fireEvent.click(button);

      await waitForElement(() => queryByText("cannot be null"));
      fireEvent.change(passwordInput, changeEvent("name updated"));

      const errorMessage = queryByText("cannot be null");
      expect(errorMessage).not.toBeInTheDocument();
    });
  });
});
console.error = () => {};

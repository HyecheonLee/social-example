import React from "react";
import { fireEvent, render, waitForDomChange } from "@testing-library/react";
import HoaxSubmit from "./HoaxSubmit";
import { createStore } from "redux";
import rootReducer from "../redux";
import { Provider } from "react-redux";
import * as apiCalls from "../api/apiCalls";

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
  store = createStore(rootReducer, { auth: { ...state } });
  return render(
    <Provider store={store}>
      <HoaxSubmit />
    </Provider>
  );
};

describe("HoaxSubmit", function() {
  describe("Layout", () => {
    it("has textarea", () => {
      const { container } = setup();
      const textArea = container.querySelector("textarea");
      expect(textArea).toBeInTheDocument();
    });
    it("has image", () => {
      const { container } = setup();
      const img = container.querySelector("img");
      expect(img).toBeInTheDocument();
    });
    it("displays textarea 1 line", () => {
      const { container } = setup();
      const textArea = container.querySelector("textarea");
      expect(textArea.rows).toBe(1);
    });
    it("display user image", () => {
      const { container } = setup();
      const img = container.querySelector("img");
      expect(img.src).toContain("/images/profile/" + defaultState.image);
    });
  });
  describe("Interaction", () => {
    let textArea;
    const setupFocused = () => {
      const rendered = setup();
      textArea = rendered.container.querySelector("textarea");
      fireEvent.focus(textArea);
      return rendered;
    };
    it("displays 3 row when focused to textarea", () => {
      const { container } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      expect(textArea.rows).toBe(3);
    });
    it("displays hoaxify button when focused to textarea", () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      const hoaxifyButton = queryByText("Hoaxify");
      expect(hoaxifyButton).toBeInTheDocument();
    });
    it("displays Cancel button when focused to textarea", () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      const cancelButton = queryByText("Cancel");
      expect(cancelButton).toBeInTheDocument();
    });
    it("does not display Hoaxify button when not focused to textarea", () => {
      const { container, queryByText } = setup();
      const HoaxifyButton = queryByText("Hoaxify");
      expect(HoaxifyButton).not.toBeInTheDocument();
    });
    it("does not display Cancel button when not focused to textarea", () => {
      const { container, queryByText } = setup();
      const cancelButton = queryByText("Cancel");
      expect(cancelButton).not.toBeInTheDocument();
    });
    it("returns back to unfocused state after clicking the cancel", () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      const cancelButton = queryByText("Cancel");
      fireEvent.click(cancelButton);
      expect(queryByText("Cancel")).not.toBeInTheDocument();
    });
    it("calls postHoax with hoax request  object when clicking Hoaxify", () => {
      apiCalls.postHoax = jest.fn().mockResolvedValue({});
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: "Test hoax content" } });

      const hoaxifyButton = queryByText("Hoaxify");
      fireEvent.click(hoaxifyButton);
      expect(apiCalls.postHoax).toHaveBeenCalledWith({
        content: "Test hoax content"
      });
    });
    it("return back to unfocused state after successful postHoax action", async () => {
      apiCalls.postHoax = jest.fn().mockResolvedValue({});
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: "Test hoax content" } });

      const hoaxifyButton = queryByText("Hoaxify");
      fireEvent.click(hoaxifyButton);

      await waitForDomChange();
      expect(queryByText("Hoaxify")).not.toBeInTheDocument();
    });
    it("clear content after successful postHoax action", async () => {
      apiCalls.postHoax = jest.fn().mockResolvedValue({});
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: "Test hoax content" } });

      const hoaxifyButton = queryByText("Hoaxify");
      fireEvent.click(hoaxifyButton);

      await waitForDomChange();
      expect(queryByText("Test hoax content")).not.toBeInTheDocument();
    });
    it("clear content after clicking cancel", () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: "Test hoax content" } });

      fireEvent.click(queryByText("Cancel"));
      expect(queryByText("Test hoax content")).not.toBeInTheDocument();
    });
    it("disables Hoaxify button when there is postHoax api call", async () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: "Test hoax content" } });

      const mockFunction = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {}, 300);
        });
      });
      apiCalls.postHoax = mockFunction;

      const hoaxifyButton = queryByText("Hoaxify");
      fireEvent.click(hoaxifyButton);

      fireEvent.click(hoaxifyButton);
      expect(mockFunction).toBeCalledTimes(1);
    });
    it("disables Cancel button when there is postHoax api call", async () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: "Test hoax content" } });

      const mockFunction = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {}, 300);
        });
      });
      apiCalls.postHoax = mockFunction;

      const hoaxifyButton = queryByText("Hoaxify");
      fireEvent.click(hoaxifyButton);

      const cancelButton = queryByText("Cancel");
      fireEvent.click(cancelButton);
      expect(mockFunction).toBeCalledTimes(1);
    });
    it("disables spinner when where is postHoax api call", async () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: "Test hoax content" } });

      const mockFunction = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {}, 300);
        });
      });
      apiCalls.postHoax = mockFunction;

      const hoaxifyButton = queryByText("Hoaxify");
      fireEvent.click(hoaxifyButton);

      expect(queryByText("Loading...")).toBeInTheDocument();
    });
    it("enables Hoaxify button when postHoax api call fails", async () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: "Test hoax content" } });

      const mockFunction = jest.fn().mockRejectedValueOnce({
        response: {
          data: {
            validationErrors: {
              content:
                "반드시 최소값 10과(와) 최대값 5000 사이의 크기이어야 합니다."
            }
          }
        }
      });
      apiCalls.postHoax = mockFunction;

      const hoaxifyButton = queryByText("Hoaxify");
      fireEvent.click(hoaxifyButton);

      await waitForDomChange();

      expect(queryByText("Hoaxify")).not.toBeDisabled();
    });
    it("enables Cancel button when postHoax api call fails", async () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: "Test hoax content" } });

      const mockFunction = jest.fn().mockRejectedValueOnce({
        response: {
          data: {
            validationErrors: {
              content:
                "반드시 최소값 10과(와) 최대값 5000 사이의 크기이어야 합니다."
            }
          }
        }
      });
      apiCalls.postHoax = mockFunction;

      const hoaxifyButton = queryByText("Hoaxify");
      fireEvent.click(hoaxifyButton);

      await waitForDomChange();

      expect(queryByText("Cancel")).not.toBeDisabled();
    });
    it("enables Hoaxify button successful postHoax action", async () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: "Test hoax content" } });

      const hoaxifyButton = queryByText("Hoaxify");
      fireEvent.click(hoaxifyButton);

      await waitForDomChange();
      fireEvent.focus(textArea);
      expect(queryByText("Hoaxify")).not.toBeDisabled();
    });
    it("displays validation error for content", async () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: "Test hoax content" } });

      const mockFunction = jest.fn().mockRejectedValueOnce({
        response: {
          data: {
            validationErrors: {
              content:
                "반드시 최소값 10과(와) 최대값 5000 사이의 크기이어야 합니다."
            }
          }
        }
      });
      apiCalls.postHoax = mockFunction;

      const hoaxifyButton = queryByText("Hoaxify");
      fireEvent.click(hoaxifyButton);

      await waitForDomChange();

      expect(
        queryByText(
          "반드시 최소값 10과(와) 최대값 5000 사이의 크기이어야 합니다."
        )
      ).toBeInTheDocument();
    });
    it("displays file attachment input when text area focused", () => {
      const { container } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);

      const uploadInput = container.querySelector("input");
      expect(uploadInput.type).toBe("file");
    });
    it("displays image component when file selected", async () => {
      apiCalls.postHoaxFile = jest.fn().mockResolvedValue({
        data: {
          id: 1,
          name: "random-name.png"
        }
      });
      const { container } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);

      const uploadInput = container.querySelector("input");
      expect(uploadInput.type).toBe("file");

      const file = new File(["dummy content"], "example.png", {
        type: "image/png"
      });

      fireEvent.change(uploadInput, { target: { files: [file] } });

      await waitForDomChange();

      const images = container.querySelectorAll("img");
      const attachmentImage = images[1];
      expect(attachmentImage.src).toContain("data:image/png;base64");
    });
    it("removes selected image after clicking cancel", async () => {
      apiCalls.postHoaxFile = jest.fn().mockResolvedValue({
        data: {
          id: 1,
          name: "random-name.png"
        }
      });
      const { queryByText, container } = setupFocused();

      const uploadInput = container.querySelector("input");
      expect(uploadInput.type).toBe("file");

      const file = new File(["dummy content"], "example.png", {
        type: "image/png"
      });
      fireEvent.change(uploadInput, { target: { files: [file] } });

      await waitForDomChange();

      fireEvent.click(queryByText("Cancel"));
      fireEvent.focus(textArea);

      const images = container.querySelectorAll("img");
      expect(images.length).toBe(1);
    });

    it("clears validation error after clicking cancel", async () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: "Test hoax content" } });

      const mockFunction = jest.fn().mockRejectedValueOnce({
        response: {
          data: {
            validationErrors: {
              content:
                "반드시 최소값 10과(와) 최대값 5000 사이의 크기이어야 합니다."
            }
          }
        }
      });
      apiCalls.postHoax = mockFunction;

      const hoaxifyButton = queryByText("Hoaxify");
      fireEvent.click(hoaxifyButton);

      await waitForDomChange();
      fireEvent.click(queryByText("Cancel"));
      expect(
        queryByText(
          "반드시 최소값 10과(와) 최대값 5000 사이의 크기이어야 합니다."
        )
      ).not.toBeInTheDocument();
    });
    it("clears validation error after content is changed", async () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: "Test hoax content" } });

      const mockFunction = jest.fn().mockRejectedValueOnce({
        response: {
          data: {
            validationErrors: {
              content:
                "반드시 최소값 10과(와) 최대값 5000 사이의 크기이어야 합니다."
            }
          }
        }
      });
      apiCalls.postHoax = mockFunction;

      const hoaxifyButton = queryByText("Hoaxify");
      fireEvent.click(hoaxifyButton);

      await waitForDomChange();
      fireEvent.change(textArea, {
        target: { value: "Test hoax content update" }
      });
      expect(
        queryByText(
          "반드시 최소값 10과(와) 최대값 5000 사이의 크기이어야 합니다."
        )
      ).not.toBeInTheDocument();
    });
    it("calls postHoaxFile when file selected", async () => {
      apiCalls.postHoaxFile = jest.fn().mockResolvedValue({
        data: {
          id: 1,
          name: "random-name.png"
        }
      });

      const { container } = setupFocused();

      const uploadInput = container.querySelector("input");
      expect(uploadInput.type).toBe("file");

      const file = new File(["dummy content"], "example.png", {
        type: "image/png"
      });
      fireEvent.change(uploadInput, { target: { files: [file] } });

      await waitForDomChange();
      expect(apiCalls.postHoaxFile).toHaveBeenCalledTimes(1);
    });
    it("calls postHoax with hoax with file attachment object when clicking Hoaxify", async () => {
      apiCalls.postHoaxFile = jest.fn().mockResolvedValue({
        data: {
          id: 1,
          name: "random-name.png"
        }
      });
      const { queryByText, container } = setupFocused();
      fireEvent.change(textArea, { target: { value: "Test hoax content" } });

      const uploadInput = container.querySelector("input");
      expect(uploadInput.type).toBe("file");

      const file = new File(["dummy content"], "example.png", {
        type: "image/png"
      });
      fireEvent.change(uploadInput, { target: { files: [file] } });

      await waitForDomChange();

      const hoaxifyButton = queryByText("Hoaxify");

      apiCalls.postHoax = jest.fn().mockResolvedValue({});
      fireEvent.click(hoaxifyButton);

      expect(apiCalls.postHoax).toHaveBeenCalledWith({
        content: "Test hoax content",
        attachment: {
          id: 1,
          name: "random-name.png"
        }
      });
    });
    it("clears image after postHoax success", async () => {
      apiCalls.postHoaxFile = jest.fn().mockResolvedValue({
        data: {
          id: 1,
          name: "random-name.png"
        }
      });
      const { queryByText, container } = setupFocused();
      fireEvent.change(textArea, { target: { value: "Test hoax content" } });

      const uploadInput = container.querySelector("input");
      expect(uploadInput.type).toBe("file");

      const file = new File(["dummy content"], "example.png", {
        type: "image/png"
      });
      fireEvent.change(uploadInput, { target: { files: [file] } });

      await waitForDomChange();

      const hoaxifyButton = queryByText("Hoaxify");

      apiCalls.postHoax = jest.fn().mockResolvedValue({});
      fireEvent.click(hoaxifyButton);

      await waitForDomChange();

      fireEvent.focus(textArea);
      const images = container.querySelectorAll("img");
      expect(images.length).toBe(1);
    });
    it('calls postHoax without file attachment after cancelling previous file selection', async () => {
      apiCalls.postHoaxFile = jest.fn().mockResolvedValue({
        data: {
          id: 1,
          name: 'random-name.png'
        }
      });
      const { queryByText, container } = setupFocused();
      fireEvent.change(textArea, { target: { value: 'Test hoax content' } });

      const uploadInput = container.querySelector('input');
      expect(uploadInput.type).toBe('file');

      const file = new File(['dummy content'], 'example.png', {
        type: 'image/png'
      });
      fireEvent.change(uploadInput, { target: { files: [file] } });

      await waitForDomChange();

      fireEvent.click(queryByText('Cancel'));
      fireEvent.focus(textArea);

      const hoaxifyButton = queryByText('Hoaxify');

      apiCalls.postHoax = jest.fn().mockResolvedValue({});
      fireEvent.change(textArea, { target: { value: 'Test hoax content' } });
      fireEvent.click(hoaxifyButton);

      expect(apiCalls.postHoax).toHaveBeenCalledWith({
        content: 'Test hoax content'
      });
    });
  });
});

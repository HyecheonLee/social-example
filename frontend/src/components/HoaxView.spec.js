import React from "react";
import { fireEvent, render, waitForDomChange } from "@testing-library/react";
import HoaxView from "./HoaxView";
import { MemoryRouter } from "react-router-dom";
import rootReducer from "../redux";
import { createStore } from "redux";
import { Provider } from "react-redux";

const loggedInStateUser1 = {
  id: 1,
  username: "user1",
  displayName: "display1",
  image: "profile1.png",
  password: "P4ssword",
  isLoggedIn: true
};

const loggedInStateUser2 = {
  id: 2,
  username: "user2",
  displayName: "display2",
  image: "profile2.png",
  password: "P4ssword",
  isLoggedIn: true
};

const hoaxWithoutAttachment = {
  id: 1,
  user: {
    id: 1,
    username: "user1",
    displayName: "display1",
    image: "profile1.png"
  },
  content: "This is the latest hoax"
};
const hoaxWithAttachment = {
  id: 1,
  user: {
    id: 1,
    username: "user1",
    displayName: "display1",
    image: "profile1.png"
  },
  content: "This is the latest hoax",
  attachment: {
    fileType: "image/png",
    name: "attached-image.png"
  }
};
const hoaxWithPdfAttachment = {
  id: 10,
  content: "This is the first hoax",
  user: {
    id: 1,
    username: "user1",
    displayName: "display1",
    image: "profile1.png"
  },
  attachment: {
    fileType: "application/pdf",
    name: "attached.pdf"
  }
};

const setup = (hoax = hoaxWithoutAttachment, state = loggedInStateUser1) => {
  const oneMinute = 60 * 1000;
  hoax.timestamp = new Date(new Date() - oneMinute);
  const store = createStore(rootReducer, { auth: { ...state } });
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <HoaxView hoax={hoax} />
      </MemoryRouter>
    </Provider>
  );
};
describe("HoaxView", () => {
  describe("Layout", () => {
    it("displays hoax content", () => {
      const { queryByText } = setup();
      expect(queryByText("This is the latest hoax")).toBeInTheDocument();
    });
    it("displays users image", () => {
      const { container } = setup();
      const image = container.querySelector("img");
      expect(image.src).toContain("/images/profile/profile1.png");
    });
    it("displays displayName@user", () => {
      const { queryByText } = setup();
      expect(queryByText("display1@user1")).toBeInTheDocument();
    });
    it("displays relative time", () => {
      const { queryByText } = setup();
      expect(queryByText("1 minute ago")).toBeInTheDocument();
    });
    it("has link to user page", () => {
      const { container } = setup();
      const anchor = container.querySelector("a");
      expect(anchor.getAttribute("href")).toBe("/user1");
    });
    it("displays file attachment image", () => {
      const { container } = setup(hoaxWithAttachment);
      const images = container.querySelectorAll("img");
      expect(images.length).toBe(2);
    });
    it("does not displays file attachment when attachment type is not image", () => {
      const { container } = setup(hoaxWithPdfAttachment);
      const images = container.querySelectorAll("img");
      expect(images.length).toBe(1);
    });
    it("sets the attachment path as source for file attachment image", () => {
      const { container } = setup(hoaxWithAttachment);
      const images = container.querySelectorAll("img");
      const attachmentImage = images[1];
      expect(attachmentImage.src).toContain(
        "/images/attachments/" + hoaxWithAttachment.attachment.name
      );
    });
    it("displays delete button when hoax owned by logged in user", () => {
      const { container } = setup();
      expect(container.querySelector("button")).toBeInTheDocument();
    });
    it("does not display delete button when hoax is not owned by logged in user", () => {
      const { container } = setup(hoaxWithoutAttachment, loggedInStateUser2);
      expect(container.querySelector("button")).not.toBeInTheDocument();
    });
  });
});

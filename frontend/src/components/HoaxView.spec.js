import React from "react";
import { fireEvent, render, waitForDomChange } from "@testing-library/react";
import HoaxView from "./HoaxView";
import { MemoryRouter } from "react-router-dom";

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

const setup = (hoax = hoaxWithoutAttachment) => {
  const oneMinute = 60 * 1000;
  hoax.timestamp = new Date(new Date() - oneMinute);
  return render(
    <MemoryRouter>
      <HoaxView hoax={hoax} />
    </MemoryRouter>
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
  });
});

import React from "react";
import {fireEvent, render} from "@testing-library/react";
import ProfileCard from './ProfileCard';

const user = {
  id: 1,
  username: "user1",
  displayName: "display1",
  image: "profile1.png"
};
describe('ProfileCard', () => {
  describe('Layout', () => {
    it('displays the displayName@username', () => {
      const {queryByText} = render(<ProfileCard user={user}/>);
      const userInfo = queryByText("display1@user1");
      expect(userInfo).toBeInTheDocument();
    });
    it("has images", () => {
      const {container} = render(<ProfileCard user={user}/>);
      const image = container.querySelector("img");
      expect(image).toBeInTheDocument();
    });
    it("displays default image when user does not have one", () => {
      const userWithoutImage = {
        ...user,
        image: undefined,
      };
      const {container} = render(<ProfileCard user={userWithoutImage}/>);
      const image = container.querySelector("img");
      expect(image.src).toContain("/profile.png");
    });
    it("displays user image when user has one", () => {
      const {container} = render(<ProfileCard user={user}/>);
      const image = container.querySelector("img");
      expect(image.src).toContain(`/images/profile/${user.image}`);
    });
    it("display edit button when isEditable property set as true", () => {
      const {queryByText} = render(<ProfileCard user={user}
                                                isEditable={true}/>);
      const editButton = queryByText("Edit");
      expect(editButton).toBeInTheDocument();
    });
    it("does not display edit button when isEditable property set as false",
        () => {
          const {queryByText} = render(<ProfileCard user={user}/>);
          const editButton = queryByText("Edit");
          expect(editButton).not.toBeInTheDocument();
        });
    it("displays displayName input when inEditMode property set as true",
        () => {
          const {container, queryByText} = render(<ProfileCard user={user}
                                                               isEditable={true}/>);
          const editButton = queryByText("Edit");
          fireEvent.click(editButton);
          const displayInput = container.querySelector("input");
          expect(displayInput).toBeInTheDocument();
        });
    it("displays the current displayName in input in edit mode",
        () => {
          const {container, queryByText} = render(<ProfileCard user={user}
                                                               isEditable={true}/>);
          const editButton = queryByText("Edit");
          fireEvent.click(editButton);

          const displayInput = container.querySelector("input");
          expect(displayInput.value).toBe(user.displayName);
        });
    it("hides the displayName@username in edit mode",
        () => {
          const {container, queryByText} = render(<ProfileCard user={user}
                                                               isEditable={true}/>);
          const editButton = queryByText("Edit");
          fireEvent.click(editButton);

          const userInfo = queryByText("display1@user1");
          expect(userInfo).not.toBeInTheDocument();
        });
    it("displays label for displayName in edit mode",
        () => {
          const {container, queryByText} = render(<ProfileCard user={user}
                                                               isEditable={true}/>);
          const editButton = queryByText("Edit");
          fireEvent.click(editButton);

          const label = container.querySelector("label");
          expect(label).toHaveTextContent("Change Display Name for user1");
        });
    it("hides the edit button in edit mode and isEditable provided as true",
        () => {
          const {container, queryByText} = render(<ProfileCard user={user}
                                                               isEditable={true}/>);
          const editButton = queryByText("Edit");
          fireEvent.click(editButton);
          expect(editButton).not.toBeInTheDocument();
        });
    it("displays Save button in edit mode",
        () => {
          const {container, queryByText} = render(<ProfileCard user={user}
                                                               isEditable={true}/>);
          const editButton = queryByText("Edit");
          fireEvent.click(editButton);
          const saveButton = queryByText("Save");
          expect(saveButton).toBeInTheDocument();
        });
    it("displays Cancel button in edit mode",
        () => {
          const {container, queryByText} = render(<ProfileCard user={user}
                                                               isEditable={true}/>);
          const editButton = queryByText("Edit");
          fireEvent.click(editButton);
          const saveButton = queryByText("Cancel");
          expect(saveButton).toBeInTheDocument();
        });
  });
});
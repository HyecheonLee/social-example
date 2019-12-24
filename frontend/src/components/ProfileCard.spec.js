import React from "react";
import {
  fireEvent,
  render,
  waitForElement,
  waitForDomChange
} from "@testing-library/react";
import ProfileCard from "./ProfileCard";
import * as apiCalls from "../api/apiCalls";
import {Provider} from "react-redux";
import configureStore from "../redux/configureStore";
import {MemoryRouter, Route} from "react-router-dom";

const user = {
  id: 1,
  username: "user1",
  displayName: "display1",
  image: "profile1.png"
};

const mockSuccessUpdateUser = {
  data: {
    id: 1,
    username: "user1",
    displayName: "display1-update",
    image: "profile1.png"
  }
};

const mockFailGetUser = {
  response: {
    data: {
      message: "User not found"
    }
  }
};
const mockFailUpdateUser = {
  response: {
    data: {
      validationErrors: {
        displayName: "It must have minimum 4 and maximum 255 characters",
        image: "PNG 와 JPG 파일만 허용 됩니다."
      }
    }
  }
};
const setUserOneLoggedInStorage = () => {
  localStorage.setItem(
      "hoax-auth",
      JSON.stringify({
        id: 1,
        username: "user1",
        displayName: "display1",
        image: "profile1.png",
        password: "P4ssword",
        isLoggedIn: true
      })
  );
};

describe("ProfileCard", () => {
  let store;

  function setupForEdit() {
    setUserOneLoggedInStorage();
    store = configureStore(false);
    const path = "/user1";
    const rendered = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[path]}>
            <Route path="/:username">
              <ProfileCard user={user}/>
            </Route>
          </MemoryRouter>
        </Provider>
    );
    const {container, queryByText} = rendered;
    const editButton = queryByText("Edit");
    fireEvent.click(editButton);
    return rendered;
  }

  function setup(user = user) {
    store = configureStore(false);
    const path = "/user1";
    const rendered = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[path]}>
            <Route path="/:username">
              <ProfileCard user={user}/>
            </Route>
          </MemoryRouter>
        </Provider>
    );
    return rendered;
  }

  describe("Layout", () => {
    it("displays the displayName@username", () => {
      const {queryByText} = setup();
      const userInfo = queryByText("display1@user1");
      expect(userInfo).toBeInTheDocument();
    });
    it("has images", () => {
      const {container} = setup();
      const image = container.querySelector("img");
      expect(image).toBeInTheDocument();
    });
    it("displays default image when user does not have one", () => {
      const userWithoutImage = {
        ...user,
        image: undefined
      };
      const {container} = setup(userWithoutImage);
      const image = container.querySelector("img");
      expect(image.src).toContain("/profile.png");
    });
    it("displays user image when user has one", () => {
      const {container} = setup();
      const image = container.querySelector("img");
      expect(image.src).toContain(`/images/profile/${user.image}`);
    });
    it("display edit button when isEditable property set as true", () => {
      setUserOneLoggedInStorage();
      const {queryByText} = setup();
      const editButton = queryByText("Edit");
      expect(editButton).toBeInTheDocument();
    });
    it("does not display edit button when isEditable property set as false",
        () => {
          const {queryByText} = setup();
          const editButton = queryByText("Edit");
          expect(editButton).not.toBeInTheDocument();
        });
    it("displays displayName input when inEditMode property set as true",
        () => {
          const {container, queryByText} = setupForEdit();
          const displayInput = container.querySelector("input");
          expect(displayInput).toBeInTheDocument();
        });
    it("displays the current displayName in input in edit mode", () => {
      const {container, queryByText} = setupForEdit();
      const displayInput = container.querySelector("input");
      expect(displayInput.value).toBe(user.displayName);
    });
    it("hides the displayName@username in edit mode", () => {
      const {container, queryByText} = setupForEdit();
      const userInfo = queryByText("display1@user1");
      expect(userInfo).not.toBeInTheDocument();
    });
    it("displays label for displayName in edit mode", () => {
      const {container, queryByText} = setupForEdit();
      const label = container.querySelector("label");
      expect(label).toHaveTextContent("Change Display Name for user1");
    });
    it("hides the edit button in edit mode and isEditable provided as true",
        () => {
          const {container, queryByText} = setupForEdit();
          const editButton = queryByText("Edit");
          expect(editButton).not.toBeInTheDocument();
        });
    it("displays Save button in edit mode", () => {
      const {container, queryByText} = setupForEdit();
      const saveButton = queryByText("Save");
      expect(saveButton).toBeInTheDocument();
    });
    it("displays Cancel button in edit mode", () => {
      setUserOneLoggedInStorage();
      const {queryByText} = setupForEdit();
      const saveButton = queryByText("Cancel");
      expect(saveButton).toBeInTheDocument();
    });
  });
  describe("interaction", () => {
    const mockDelayedUpdateSuccess = () => {
      return jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessUpdateUser);
          }, 300);
        });
      });
    };
    it("calls updateUser api when clicking save", async () => {
      const {queryByText} = setupForEdit();
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const saveButton = queryByText("Save");
      fireEvent.click(saveButton);

      expect(apiCalls.updateUser).toHaveBeenCalledTimes(1);
    });
    it("calls updateUser api with user id", async () => {
      const {queryByText} = setupForEdit();
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const saveButton = queryByText("Save");
      fireEvent.click(saveButton);

      const userId = apiCalls.updateUser.mock.calls[0][0];
      expect(userId).toBe(user.id);
    });
    it("calls updateUser api request body having changed displayName",
        async () => {
          const {container, queryByText} = setupForEdit();
          apiCalls.updateUser = jest.fn().mockResolvedValue(
              mockSuccessUpdateUser);
          const displayInput = container.querySelector("input");
          fireEvent.change(displayInput, {target: {value: "display1-update"}});
          const saveButton = queryByText("Save");
          fireEvent.click(saveButton);

          const requestBody = apiCalls.updateUser.mock.calls[0][1];
          expect(requestBody.displayName).toBe("display1-update");
        });
    it("returns to non edit mode after successful updateUser api call",
        async () => {
          const {container, queryByText} = setupForEdit();
          apiCalls.updateUser = jest.fn().mockResolvedValue(
              mockSuccessUpdateUser);
          const saveButton = queryByText("Save");
          fireEvent.click(saveButton);
          const updateDisplayName = await waitForElement(() =>
              queryByText("display1-update@user1")
          );
          expect(updateDisplayName).toBeInTheDocument();
        });
    it("returns to original displayName after its changed in edit mode but cancelled",
        () => {
          const {container, queryByText} = setupForEdit();
          const displayInput = container.querySelector("input");
          fireEvent.change(displayInput, {target: {value: "display1-update"}});
          const cancelBtn = queryByText("Cancel");
          fireEvent.click(cancelBtn);
          const displayName = queryByText("display1@user1");
          expect(displayName).toBeInTheDocument();
        });
    it("returns to last updated displayName when display name is changed for another time but cancelled",
        async () => {
          const {queryByText, container} = await setupForEdit();
          let displayInput = container.querySelector("input");
          fireEvent.change(displayInput, {target: {value: "display1-update"}});
          apiCalls.updateUser = jest.fn().mockResolvedValue(
              mockSuccessUpdateUser);

          const saveButton = queryByText("Save");
          fireEvent.click(saveButton);

          const editButtonAfterClickingSave = await waitForElement(() =>
              queryByText("Edit")
          );
          fireEvent.click(editButtonAfterClickingSave);

          displayInput = container.querySelector("input");
          fireEvent.change(displayInput, {
            target: {value: "display1-update-second-time"}
          });
          const cancelButton = queryByText("Cancel");
          fireEvent.click(cancelButton);

          const lastSavedData = container.querySelector("h4");

          expect(lastSavedData).toHaveTextContent("display1-update@user1");
        });
    it("displays spinner when there is updateUser api call", async () => {
      const {queryByText} = await setupForEdit();
      apiCalls.updateUser = mockDelayedUpdateSuccess();

      const saveBtn = queryByText("Save");
      fireEvent.click(saveBtn);
      const spinner = queryByText("Loading...");
      expect(spinner).toBeInTheDocument();
    });
    it("disables save button when there is updateUser api call", async () => {
      const {queryByText} = await setupForEdit();
      apiCalls.updateUser = mockDelayedUpdateSuccess();

      const saveBtn = queryByText("Save");
      fireEvent.click(saveBtn);
      expect(saveBtn).toBeDisabled();
    });
    it("disables cancel button when there is updateUser api call", async () => {
      const {queryByText} = await setupForEdit();
      apiCalls.updateUser = mockDelayedUpdateSuccess();

      const saveBtn = queryByText("Save");
      fireEvent.click(saveBtn);

      const cancelBtn = queryByText("Cancel");

      expect(cancelBtn).toBeDisabled();
    });
    it("enables save button after updateUser api call success", async () => {
      const {queryByText} = await setupForEdit();
      apiCalls.updateUser = mockDelayedUpdateSuccess();

      const saveBtn = queryByText("Save");
      fireEvent.click(saveBtn);

      const editButtonAfterClickingSave = await waitForElement(() =>
          queryByText("Edit")
      );

      fireEvent.click(editButtonAfterClickingSave);

      const saveButtonAfterSecondEdit = queryByText("Save");

      expect(saveButtonAfterSecondEdit).not.toBeDisabled();
    });
    it("enables cancel button after updateUser api call success", async () => {
      const {queryByText} = await setupForEdit();
      apiCalls.updateUser = mockDelayedUpdateSuccess();

      const saveBtn = queryByText("Save");
      fireEvent.click(saveBtn);

      const editButtonAfterClickingSave = await waitForElement(() =>
          queryByText("Edit")
      );

      fireEvent.click(editButtonAfterClickingSave);

      const cancelButtonAfterSecondEdit = queryByText("Cancel");

      expect(cancelButtonAfterSecondEdit).not.toBeDisabled();
    });
    it("enables save button after updateUser api call fail", async () => {
      const {queryByText, container} = await setupForEdit();
      let displayInput = container.querySelector("input");
      fireEvent.change(displayInput, {target: {value: "display1-update"}});
      apiCalls.updateUser = jest.fn().mockRejectedValue(mockFailGetUser);

      const saveButton = queryByText("Save");
      fireEvent.click(saveButton);

      await waitForDomChange();

      expect(saveButton).not.toBeDisabled();
    });
    it("display file input when inEditMode property set as true", async () => {
      const {container} = await setupForEdit();
      const inputs = container.querySelectorAll("input");
      const uploadInput = inputs[1];
      expect(uploadInput.type).toBe("file");
    });
    it("display file selected image in edit mode", async () => {
      const {container} = await setupForEdit();
      const inputs = container.querySelectorAll("input");
      const uploadInput = inputs[1];
      const file = new File(["dummy content"], "example.png", {
        type: "image/png"
      });

      fireEvent.change(uploadInput, {target: {files: [file]}});

      await waitForDomChange();

      const image = container.querySelector("img");
      expect(image.src).toContain("data:image/png;base64");
    });
    it("returns back to the original image even the new image is added to upload box but canceled",
        async () => {
          const {queryByText, container} = await setupForEdit();
          const inputs = container.querySelectorAll("input");
          const uploadInput = inputs[1];
          const file = new File(["dummy content"], "example.png", {
            type: "image/png"
          });

          fireEvent.change(uploadInput, {target: {files: [file]}});

          await waitForDomChange();
          const cancelButton = queryByText("Cancel");
          fireEvent.click(cancelButton);

          const image = container.querySelector("img");
          expect(image.src).toContain("/images/profile/profile1.png");
        });
    it("does not throw error after file not selected", async () => {
      const {container} = await setupForEdit();
      const inputs = container.querySelectorAll("input");
      const uploadInput = inputs[1];
      expect(() =>
          fireEvent.change(uploadInput, {target: {files: []}})
      ).not.toThrow();
    });
    it("calls updateUser api with request body having new image without data:image/png;base64",
        async () => {
          const {queryByText, container} = await setupForEdit();
          apiCalls.updateUser = jest.fn().mockResolvedValue(
              mockSuccessUpdateUser);

          const inputs = container.querySelectorAll("input");
          const uploadInput = inputs[1];
          const file = new File(["dummy content"], "example.png", {
            type: "image/png"
          });

          fireEvent.change(uploadInput, {target: {files: [file]}});

          await waitForDomChange();
          const saveButton = queryByText("Save");
          fireEvent.click(saveButton);

          const requestBody = apiCalls.updateUser.mock.calls[0][1];

          expect(requestBody.image).not.toContain("data:image/png;base64");
        });
    it("displays validation error for displayName when update api fails",
        async () => {
          const {queryByText} = await setupForEdit();
          apiCalls.updateUser = jest.fn().mockRejectedValue(
              mockFailUpdateUser);

          const saveButton = queryByText("Save");
          fireEvent.click(saveButton);
          await waitForDomChange();

          const errorMessage = queryByText(
              "It must have minimum 4 and maximum 255 characters");
          expect(errorMessage).toBeInTheDocument();
        });
    it("shows validation error for file when update api fails", async () => {
      const {queryByText} = await setupForEdit();
      apiCalls.updateUser = jest.fn().mockRejectedValue(
          mockFailUpdateUser);

      const saveButton = queryByText("Save");
      fireEvent.click(saveButton);
      await waitForDomChange();

      const errorMessage = queryByText(
          "PNG 와 JPG 파일만 허용 됩니다.");
      expect(errorMessage).toBeInTheDocument();
    });
    it("removes validation error for displayName when user changes the displayName",
        async () => {
          const {queryByText, container} = await setupForEdit();
          apiCalls.updateUser = jest.fn().mockRejectedValue(
              mockFailUpdateUser);

          const saveButton = queryByText("Save");
          fireEvent.click(saveButton);
          await waitForDomChange();
          const displayInput = container.querySelectorAll("input")[0];
          fireEvent.change(displayInput, {target: {value: "new-display-name"}});

          const errorMessage = queryByText(
              "It must have minimum 4 and maximum 255 characters");
          expect(errorMessage).not.toBeInTheDocument();
        });
    it("removes validation error for file when user changes the file",
        async () => {
          const {queryByText, container} = await setupForEdit();
          apiCalls.updateUser = jest.fn().mockRejectedValue(
              mockFailUpdateUser);

          const saveButton = queryByText("Save");
          fireEvent.click(saveButton);
          await waitForDomChange();
          const displayInput = container.querySelectorAll("input")[1];

          const newFile = new File(["another content"], "example2.png", {
            type: "image/png"
          });
          fireEvent.change(displayInput, {target: {files: [newFile]}});

          const errorMessage = queryByText("PNG 와 JPG 파일만 허용 됩니다.");
          expect(errorMessage).not.toBeInTheDocument();
        });
    it("removes validation error if user cancels", async () => {
      const {queryByText, container} = await setupForEdit();
      apiCalls.updateUser = jest.fn().mockRejectedValue(
          mockFailUpdateUser);

      const saveButton = queryByText("Save");
      fireEvent.click(saveButton);
      await waitForDomChange();
      fireEvent.click(queryByText("Cancel"));
      fireEvent.click(queryByText("Edit"));

      const errorMessage = queryByText(
          "It must have minimum 4 and maximum 255 characters");
      expect(errorMessage).not.toBeInTheDocument();
    });
    it("updates redux state after updateUser api call success", async () => {
      const {queryByText, container} = await setupForEdit();
      const inputs = container.querySelector("input");
      fireEvent.change(inputs, {target: {value: "display1-update"}});
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const saveButton = queryByText("Save");
      fireEvent.click(saveButton);
      await waitForDomChange();

      const {auth} = store.getState();
      expect(auth.displayName).toBe(
          mockSuccessUpdateUser.data.displayName);
      expect(auth.image).toBe(
          mockSuccessUpdateUser.data.image);
    });
    it("updates localStorage after updateUser api call success", async () => {
      const {queryByText, container} = await setupForEdit();
      const inputs = container.querySelector("input");
      fireEvent.change(inputs, {target: {value: "display1-update"}});
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const saveButton = queryByText("Save");
      fireEvent.click(saveButton);
      await waitForDomChange();

      const auth = JSON.parse(localStorage.getItem("hoax-auth"));
      expect(auth.displayName).toBe(
          mockSuccessUpdateUser.data.displayName);
      expect(auth.image).toBe(
          mockSuccessUpdateUser.data.image);
    });
  });
});

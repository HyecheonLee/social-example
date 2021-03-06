import React from "react";
import {render, waitForElement} from "@testing-library/react";
import UserPage from "./UserPage";
import * as apiCalls from '../api/apiCalls';
import {Provider} from "react-redux";
import configureStore from "../redux/configureStore";
import {MemoryRouter} from "react-router-dom";

const mockSuccessGetUser = {
  data: {
    id: 1,
    username: "user1",
    displayName: "display1",
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

const match = {
  params: {
    username: "user1"
  }
};
const setup = (props) => {
  const store = configureStore(false);
  return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/user1"]}>
          <UserPage {...props}/>
        </MemoryRouter>
      </Provider>
  )
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
apiCalls.loadHoaxes = jest.fn().mockResolvedValue({
  data: {
    content: [],
    number: 0,
    size: 3
  }
});

describe("HomePage", () => {
  describe("Layout", () => {
    it("has root page div", () => {
      const {queryByTestId} = setup({match});
      const UserPageDiv = queryByTestId("UserPage");
      expect(UserPageDiv).toBeInTheDocument();
    });
    it("displays the displayName@username when user data loaded", async () => {
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
      const {queryByText} = setup({match})
      const text = await waitForElement(() => queryByText("display1@user1"));
      expect(text).toBeInTheDocument();
    });
    it("displays not found alert when user not found", async () => {
      apiCalls.getUser = jest.fn().mockRejectedValue(mockFailGetUser);
      const {queryByText} = setup({match});
      const alert = await waitForElement(() => queryByText("User not found"));
      expect(alert).toBeInTheDocument();
    });
    it("displays spinner while loading user data", async () => {
      const mockDelayedResponse = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetUser)
          }, 300)
        })
      });
      apiCalls.getUser = mockDelayedResponse;
      const {queryAllByText} = setup({match});
      const spinners = queryAllByText("Loading...");
      expect(spinners.length).not.toBe(0);
    });
    it("displays the edit button when loggedInUser matches to user in url",
        async () => {
          setUserOneLoggedInStorage();
          apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
          const {queryByText} = setup({match});
          await waitForElement(() => queryByText("display1@user1"));
          const editButton = queryByText("Edit");
          expect(editButton).toBeInTheDocument();
        });
  });
  describe("Lifecycle", () => {
    it("call getUser when it is rendered", () => {
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
      setup({match});
      expect(apiCalls.getUser).toHaveBeenCalledTimes(1)
    });
    it("call getUser for user1 when it is rendered with user1 in match", () => {
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
      setup({match});
      expect(apiCalls.getUser).toHaveBeenCalledWith("user1");
    });
  });
});

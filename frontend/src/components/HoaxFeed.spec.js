import React from "react";
import {
  fireEvent,
  render,
  waitForDomChange,
  waitForElement
} from "@testing-library/react";
import HoaxFeed from "./HoaxFeed";
import * as apiCalls from "../api/apiCalls";
import { MemoryRouter } from "react-router-dom";
import { createStore } from "redux";
import rootReducer from "../redux";
import { Provider } from "react-redux";

const originalSetInterval = window.setInterval;
const originalClearInterval = window.clearInterval;

let timedFunction;

const useFakeIntervals = () => {
  window.setInterval = (callback, interval) => {
    timedFunction = callback;
  };
  window.clearInterval = () => {
    timedFunction = undefined;
  };
};

const useRealIntervals = () => {
  window.setInterval = originalSetInterval;
  window.clearInterval = originalClearInterval;
};

const runTimer = () => {
  timedFunction && timedFunction();
};
const loggedInStateUser1 = {
  id: 1,
  username: "user1",
  displayName: "display1",
  image: "profile1.png",
  password: "P4ssword",
  isLoggedIn: true
};
const setup = (props, state = loggedInStateUser1) => {
  const store = createStore(rootReducer, { auth: { ...state } });
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <HoaxFeed {...props} />
      </MemoryRouter>
    </Provider>
  );
};
const mockEmptyResponse = {
  data: {
    content: []
  }
};

const mockSuccessGetHoaxesSinglePage = {
  data: {
    content: [
      {
        id: 10,
        content: "This is the latest hoax",
        timestamp: "2019-12-26 16:55:09",
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png"
        }
      }
    ],
    number: 0,
    first: true,
    last: true,
    size: 5,
    totalPages: 1
  }
};
const mockSuccessGetHoaxesMiddleOfMultiPage = {
  data: {
    content: [
      {
        id: 10,
        content: "This hoax is in middle page",
        timestamp: "2019-12-26 16:55:09",
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png"
        }
      }
    ],
    number: 0,
    first: false,
    last: false,
    size: 5,
    totalPages: 1
  }
};
const mockSuccessGetHoaxesFirstOfMultiPage = {
  data: {
    content: [
      {
        id: 10,
        content: "This is the newest hoax",
        timestamp: "2019-12-26 16:55:09",
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png"
        }
      },
      {
        id: 9,
        content: "This is 9",
        timestamp: "2019-12-27 16:55:09",
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png"
        }
      }
    ],
    number: 0,
    first: true,
    last: false,
    size: 5,
    totalPages: 2
  }
};
const mockSuccessGetNewHoaxesList = {
  data: {
    content: [
      {
        id: 12,
        content: "This is the newest hoax test",
        timestamp: "2019-12-26 16:55:09",
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png"
        }
      },
      {
        id: 11,
        content: "This is 9",
        timestamp: "2019-12-27 16:55:09",
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png"
        }
      }
    ],
    number: 0,
    first: true,
    last: true,
    size: 5,
    totalPages: 2
  }
};
const mockSuccessGetHoaxesLastOfMultiPage = {
  data: {
    content: [
      {
        id: 1,
        content: "This is the oldest hoax",
        timestamp: "2019-12-26 16:55:09",
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png"
        }
      },
      {
        id: 9,
        content: "This is 9",
        timestamp: "2019-12-27 16:55:09",
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png"
        }
      }
    ],
    number: 0,
    first: true,
    last: true,
    size: 5,
    totalPages: 2
  }
};
describe("HoaxFeed", function() {
  describe("Lifecycle", () => {
    it("calls loadHoaxes when it is rendered", () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockEmptyResponse);
      setup();
      expect(apiCalls.loadHoaxes).toHaveBeenCalled();
    });
    it("calls loadHoaxes with user parameter when it is rendered with user property", () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockEmptyResponse);
      setup({ username: "user1" });
      expect(apiCalls.loadHoaxes).toHaveBeenCalledWith("user1");
    });
    it("calls loadHoaxes with user parameter when it is rendered without user property", () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockEmptyResponse);
      setup();
      const parameter = apiCalls.loadHoaxes.mock.calls[0][0];
      expect(parameter).toBe("");
    });
    fit("calls loadNewHoaxCount with topHoax id", async () => {
      useFakeIntervals();
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByText } = setup();
      await waitForDomChange();
      runTimer();
      await waitForElement(() => queryByText("This is the latest hoax"));
      const firstParam = apiCalls.loadNewHoaxCount.mock.calls[0][0];
      expect(firstParam).toBe(10);
      useRealIntervals();
    });
    fit("calls loadNewHoaxCount with topHoax id ans username when rendered with user property", async () => {
      useFakeIntervals();
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByText } = setup({ username: "user1" });
      await waitForDomChange();
      runTimer();
      await waitForElement(() => queryByText("This is the latest hoax"));
      expect(apiCalls.loadNewHoaxCount).toHaveBeenCalledWith(10, "user1");
      useRealIntervals();
    });
    fit("displays new hoax count as 1 after loadNewHoaxCount success", async () => {
      useFakeIntervals();
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByText } = setup({ username: "user1" });
      await waitForDomChange();
      runTimer();
      const newHoaxCount = await waitForElement(() =>
        queryByText("There is 1 new hoax")
      );
      expect(newHoaxCount).toBeInTheDocument();
      useRealIntervals();
    });
    fit("displays new hoax count as 2 after loadNewHoaxCount success", async () => {
      useFakeIntervals();
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 2 } });
      const { queryByText } = setup({ username: "user1" });
      await waitForDomChange();
      runTimer();
      const newHoaxCount = await waitForElement(() =>
        queryByText("There are 2 new hoax")
      );
      expect(newHoaxCount).toBeInTheDocument();
      useRealIntervals();
    });
    fit("does not call loadNewHoaxCount after component is unmounted", async () => {
      useFakeIntervals();
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByText, unmount } = setup({ username: "user1" });
      await waitForDomChange();
      runTimer();
      await waitForElement(() => queryByText("There is 1 new hoax"));
      unmount();
      expect(apiCalls.loadNewHoaxCount).toHaveBeenCalledTimes(1);
      useRealIntervals();
    });
    fit("displays new hoax count as 1 after loadNewHoaxCount success when user does not", async () => {
      useFakeIntervals();
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockEmptyResponse);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByText } = setup({ username: "user1" });
      await waitForDomChange();
      runTimer();
      const newHoaxCount = await waitForElement(() =>
        queryByText("There is 1 new hoax")
      );

      expect(newHoaxCount).toBeInTheDocument();
      useRealIntervals();
    });
  });
  describe("Layout", () => {
    it("displays no hoax message when the response has empty page ", async () => {
      apiCalls.loadHoaxes = jest.fn().mockResolvedValue(mockEmptyResponse);
      const { queryByText } = setup();
      const message = await waitForElement(() =>
        queryByText("There are no hoaxes")
      );
      expect(message).toBeInTheDocument();
    });
    it("does not display no hoax messge when the response has page of hoax ", () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesSinglePage);
      const { queryByText } = setup();
      waitForDomChange();
      expect(queryByText("There are no hoaxes")).not.toBeInTheDocument();
    });
    it("displays spinner when loading the hoaxes", async () => {
      apiCalls.loadHoaxes = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetHoaxesSinglePage);
          }, 300);
        });
      });
      const { queryByText } = setup();
      expect(queryByText("Loading...")).toBeInTheDocument();
      await waitForDomChange();
    });
    it("displays hoax content", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesSinglePage);
      const { queryByText } = setup();
      const hoaxContent = await waitForElement(() =>
        queryByText("This is the latest hoax")
      );
      expect(hoaxContent).toBeInTheDocument();
    });
    it("displays Load More when there are next pages", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      const { queryByText } = setup();
      const hoaxContent = await waitForElement(() => queryByText("Load More"));
      expect(hoaxContent).toBeInTheDocument();
    });
  });
  describe("Interactions", () => {
    it("calls loadOldHoaxes with hoax id when clicking Load More", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadOldHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesLastOfMultiPage);
      const { queryByText } = setup();
      const loadMore = await waitForElement(() => queryByText("Load More"));
      fireEvent.click(loadMore);
      const firstParam = apiCalls.loadOldHoaxes.mock.calls[0][0];
      expect(firstParam).toBe(9);
    });
    it("calls loadOldHoaxes with hoax id and username when clicking Load More when rendered with user property", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadOldHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesLastOfMultiPage);
      const { queryByText } = setup({ username: "user1" });
      const loadMore = await waitForElement(() => queryByText("Load More"));
      fireEvent.click(loadMore);
      expect(apiCalls.loadOldHoaxes).toHaveBeenCalledWith(9, "user1");
    });
    it("displays loaded old hoax when loadOldHoaxes api call success", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadOldHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesLastOfMultiPage);
      const { queryByText } = setup({ username: "user1" });
      const loadMore = await waitForElement(() => queryByText("Load More"));
      fireEvent.click(loadMore);
      const oldHoax = await waitForElement(() =>
        queryByText("This is the oldest hoax")
      );
      expect(oldHoax).toBeInTheDocument();
    });
    it("hides Load More when loadOldHoaxes api call returns last page", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadOldHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesLastOfMultiPage);
      const { queryByText } = setup({ username: "user1" });
      const loadMore = await waitForElement(() => queryByText("Load More"));
      fireEvent.click(loadMore);
      const oldHoax = await waitForElement(() =>
        queryByText("This is the oldest hoax")
      );
      expect(queryByText("Load More")).not.toBeInTheDocument();
    });
    fit("calls loadNewHoaxes with hoax id when clicking New Hoax Count Card", async () => {
      useFakeIntervals();
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetNewHoaxesList);
      const { queryByText } = setup();
      await waitForDomChange();
      runTimer();
      const newHoaxCount = await waitForElement(() =>
        queryByText("There is 1 new hoax")
      );
      fireEvent.click(newHoaxCount);
      const firstParam = apiCalls.loadNewHoaxes.mock.calls[0][0];
      expect(firstParam).toBe(10);
      useRealIntervals();
    });
    fit("calls loadNewHoaxes with hoax id and username when clicking New Hoax Count Card", async () => {
      useFakeIntervals();
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetNewHoaxesList);
      const { queryByText } = setup({ username: "user1" });
      await waitForDomChange();
      runTimer();
      const newHoaxCount = await waitForElement(() =>
        queryByText("There is 1 new hoax")
      );
      fireEvent.click(newHoaxCount);
      expect(apiCalls.loadNewHoaxes).toHaveBeenCalledWith(10, "user1");
      useRealIntervals();
    });
    fit("displays loaded new hoax loadNewHoaxes api call success", async () => {
      useFakeIntervals();
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetNewHoaxesList);
      const { queryByText } = setup({ username: "user1" });
      await waitForDomChange();
      runTimer();
      const newHoaxCount = await waitForElement(() =>
        queryByText("There is 1 new hoax")
      );
      fireEvent.click(newHoaxCount);
      const newHoax = await waitForElement(() =>
        queryByText("This is the newest hoax test")
      );
      expect(newHoax).toBeInTheDocument();
      useRealIntervals();
    });
    fit("hides new hoax count when loadNewHoaxes api call success", async () => {
      useFakeIntervals();
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetNewHoaxesList);
      const { queryByText } = setup({ username: "user1" });
      await waitForDomChange();
      runTimer();
      const newHoaxCount = await waitForElement(() =>
        queryByText("There is 1 new hoax")
      );
      fireEvent.click(newHoaxCount);
      await waitForElement(() => queryByText("This is the newest hoax test"));
      expect(queryByText("There is 1 new hoax")).not.toBeInTheDocument();
      useRealIntervals();
    });
    fit("does not allow loadOldHoaxes to be called when there is an active api call about it", async () => {
      // useFakeIntervals();
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadOldHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesLastOfMultiPage);
      const { queryByText } = setup();
      const loadMore = await waitForElement(() => queryByText("Load More"));
      fireEvent.click(loadMore);
      fireEvent.click(loadMore);
      // runTimer();
      expect(apiCalls.loadOldHoaxes).toHaveBeenCalledTimes(1);
      // useRealIntervals();
    });
    fit("replaces Load More spinner when there is an active api call about it", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadOldHoaxes = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetHoaxesLastOfMultiPage);
          }, 300);
        });
      });
      const { queryByText } = setup();
      const loadMore = await waitForElement(() => queryByText("Load More"));
      fireEvent.click(loadMore);
      const spinner = await waitForElement(() => queryByText("Loading..."));
      expect(spinner).toBeInTheDocument();
      expect(queryByText("Load More")).not.toBeInTheDocument();
    });
    fit("replaces Load More spinner when there is an active api call about it", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadOldHoaxes = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetHoaxesLastOfMultiPage);
          }, 300);
        });
      });
      const { queryByText } = setup();
      const loadMore = await waitForElement(() => queryByText("Load More"));
      fireEvent.click(loadMore);
      const spinner = await waitForElement(() => queryByText("Loading..."));
      expect(spinner).toBeInTheDocument();
      expect(queryByText("Load More")).not.toBeInTheDocument();
    });
    fit("replaces Spinner with Load More after active api call for loadOldHoaxes finishes with middle page response", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadOldHoaxes = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetHoaxesMiddleOfMultiPage);
          }, 300);
        });
      });
      const { queryByText } = setup();
      const loadMore = await waitForElement(() => queryByText("Load More"));
      fireEvent.click(loadMore);
      await waitForElement(() => queryByText("This hoax is in middle page"));
      expect(queryByText("Loading...")).not.toBeInTheDocument();
      expect(queryByText("Load More")).toBeInTheDocument();
    });
    fit("replaces Spinner with Load More after active api call for loadOldHoaxes finishes error", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadOldHoaxes = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            reject({ response: { data: {} } });
          }, 300);
        });
      });
      const { queryByText } = setup();
      const loadMore = await waitForElement(() => queryByText("Load More"));
      fireEvent.click(loadMore);
      await waitForElement(() => queryByText("Loading..."));
      await waitForDomChange();
      expect(queryByText("Loading...")).not.toBeInTheDocument();
      expect(queryByText("Load More")).toBeInTheDocument();
    });
    fit("does not allow loadNewHoaxes to be called when there is an active api call about it", async () => {
      useFakeIntervals();
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetNewHoaxesList);
      const { queryByText } = setup({ user: "user1" });
      await waitForDomChange();
      runTimer();
      const newHoaxCount = await waitForElement(() =>
        queryByText("There is 1 new hoax")
      );
      fireEvent.click(newHoaxCount);
      fireEvent.click(newHoaxCount);

      expect(apiCalls.loadNewHoaxes).toHaveBeenCalledTimes(1);
      useRealIntervals();
    });
    fit("replaces There is 1 new hoax with spinner when there is an active api call about it", async () => {
      useFakeIntervals();
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewHoaxes = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetNewHoaxesList);
          }, 300);
        });
      });
      const { queryByText } = setup();
      await waitForDomChange();
      runTimer();
      const newHoaxCount = await waitForElement(() =>
        queryByText("There is 1 new hoax")
      );
      fireEvent.click(newHoaxCount);
      const spinner = await waitForElement(() => queryByText("Loading..."));
      expect(spinner).toBeInTheDocument();
      expect(queryByText("There is 1 new hoax")).not.toBeInTheDocument();
      useRealIntervals();
    });
    fit("removes Spinner and There is 1 new hoax after active api call for loadNewHoaxes finishes with success", async () => {
      useFakeIntervals();
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetNewHoaxesList);
      const { queryByText } = setup({ user: "user1" });
      await waitForDomChange();
      runTimer();
      const newHoaxCount = await waitForElement(() =>
        queryByText("There is 1 new hoax")
      );
      fireEvent.click(newHoaxCount);
      await waitForElement(() => queryByText("This is the newest hoax"));
      expect(queryByText("Loading...")).not.toBeInTheDocument();
      expect(queryByText("There is 1 new hoax")).not.toBeInTheDocument();
      useRealIntervals();
    });
    fit("replaces Spinner with There is 1 new hoax after active api call for loadNewHoaxes fails", async () => {
      useFakeIntervals();
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewHoaxes = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            reject({ response: { data: {} } });
          }, 300);
        });
      });
      const { queryByText } = setup();
      await waitForDomChange();
      runTimer();
      const newHoaxCount = await waitForElement(() =>
        queryByText("There is 1 new hoax")
      );
      fireEvent.click(newHoaxCount);
      await waitForElement(() => queryByText("Loading..."));
      await waitForDomChange();
      expect(queryByText("Loading...")).not.toBeInTheDocument();
      expect(queryByText("There is 1 new hoax")).toBeInTheDocument();
      useRealIntervals();
    });
    fit("displays modal when clicking delete on hoax", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByTestId, container } = setup();
      await waitForDomChange();
      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);

      const modalRootDiv = queryByTestId("modal-root");
      expect(modalRootDiv).toHaveClass("modal fade d-block show");
    });
    fit("hides modal when clicking cancel", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByTestId, container, queryByText } = setup();
      await waitForDomChange();
      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);

      fireEvent.click(queryByText("Cancel"));

      const modalRootDiv = queryByTestId("modal-root");
      expect(modalRootDiv).not.toHaveClass("d-block show");
    });
    fit("displays modal with information about the action", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { container, queryByText } = setup();
      await waitForDomChange();
      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);

      const message = queryByText(
        `Are you sure to delete 'This is the newest hoax'?`
      );
      expect(message).toBeInTheDocument();
    });
    fit("calls deleteHoax api with hoax id when delete button is clicked on modal", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });

      apiCalls.deleteHoax = jest.fn().mockResolvedValue({});
      const { container, queryByText } = setup();
      await waitForDomChange();
      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);
      const deleteHoaxButton = queryByText("Delete Hoax");
      fireEvent.click(deleteHoaxButton);
      expect(apiCalls.deleteHoax).toHaveBeenCalledWith(10);
    });
    fit("hides modal after successful deleteHoax api call", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });

      apiCalls.deleteHoax = jest.fn().mockResolvedValue({});
      const { container, queryByText, queryByTestId } = setup();
      await waitForDomChange();
      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);
      const deleteHoaxButton = queryByText("Delete Hoax");
      fireEvent.click(deleteHoaxButton);
      await waitForDomChange();
      const modalRootDiv = queryByTestId("modal-root");
      expect(modalRootDiv).not.toHaveClass("d-block show");
    });
    fit("removes the deleted hoax from document after successful deleteHoax api call", async () => {
      apiCalls.loadHoaxes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });

      apiCalls.deleteHoax = jest.fn().mockResolvedValue({});
      const { container, queryByText } = setup();
      await waitForDomChange();
      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);
      const deleteHoaxButton = queryByText("Delete Hoax");
      fireEvent.click(deleteHoaxButton);
      await waitForDomChange();
      const deletedHoaxContent = queryByText("This is the latest hoax");
      expect(deletedHoaxContent).not.toBeInTheDocument();
    });
    fit('disables Modal Buttons when api call in progress', async () => {
      apiCalls.loadHoaxes = jest
      .fn()
      .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
      .fn()
      .mockResolvedValue({ data: { count: 1 } });

      apiCalls.deleteHoax = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });
      const { container, queryByText } = setup();
      await waitForDomChange();
      const deleteButton = container.querySelectorAll('button')[0];
      fireEvent.click(deleteButton);
      const deleteHoaxButton = queryByText('Delete Hoax');
      fireEvent.click(deleteHoaxButton);

      expect(deleteHoaxButton).toBeDisabled();
      expect(queryByText('Cancel')).toBeDisabled();
    });
    fit('displays spinner when api call in progress', async () => {
      apiCalls.loadHoaxes = jest
      .fn()
      .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
      .fn()
      .mockResolvedValue({ data: { count: 1 } });

      apiCalls.deleteHoax = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });
      const { container, queryByText } = setup();
      await waitForDomChange();
      const deleteButton = container.querySelectorAll('button')[0];
      fireEvent.click(deleteButton);
      const deleteHoaxButton = queryByText('Delete Hoax');
      fireEvent.click(deleteHoaxButton);
      const spinner = queryByText('Loading...');
      expect(spinner).toBeInTheDocument();
    });
    fit('hides spinner when api call finishes', async () => {
      apiCalls.loadHoaxes = jest
      .fn()
      .mockResolvedValue(mockSuccessGetHoaxesFirstOfMultiPage);
      apiCalls.loadNewHoaxCount = jest
      .fn()
      .mockResolvedValue({ data: { count: 1 } });

      apiCalls.deleteHoax = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });
      const { container, queryByText } = setup();
      await waitForDomChange();
      const deleteButton = container.querySelectorAll('button')[0];
      fireEvent.click(deleteButton);
      const deleteHoaxButton = queryByText('Delete Hoax');
      fireEvent.click(deleteHoaxButton);
      await waitForDomChange();
      const spinner = queryByText('Loading...');
      expect(spinner).not.toBeInTheDocument();
    });
  });
});

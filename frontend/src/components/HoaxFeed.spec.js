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

const setup = props => {
  return render(
    <MemoryRouter>
      <HoaxFeed {...props} />
    </MemoryRouter>
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
const mockSuccessGetHoaxesFirstOfMultiPage = {
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
  });
});

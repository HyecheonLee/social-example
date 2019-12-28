import React, { useEffect, useState } from "react";
import * as apiCalls from "../api/apiCalls";
import Spinner from "./Spinner";
import HoaxView from "./HoaxView";

function HoaxFeed({ username = "" }) {
  const [counter, setCounter] = useState(0);
  const [state, setState] = useState({
    page: {
      content: []
    },
    isLoading: false,
    newHoaxCount: 0,
    isLoadingOldHoaxes: false,
    isLoadingNewHoaxes: false
  });
  useEffect(() => {
    setState(prevState => ({ ...prevState, isLoading: true }));
    apiCalls.loadHoaxes(username).then(response => {
      setState(prevState => ({
        ...prevState,
        page: response.data,
        isLoading: false
      }));
      setCounter(setInterval(checkCount, 3000));
    });
    return () => {
      clearInterval(counter);
    };
  }, [username]);
  if (state.isLoading) {
    return <Spinner />;
  }
  const checkCount = () => {
    const hoaxes = state.page.content;
    let topHoaxId = 0;
    if (hoaxes.length > 0) {
      topHoaxId = hoaxes[0].id;
    }
    apiCalls.loadNewHoaxCount(topHoaxId, username).then(value => {
      if (value.data.count) {
        setState(prevState => ({
          ...prevState,
          newHoaxCount: value.data.count
        }));
      }
    });
  };
  const onClickLoadMore = e => {
    const hoaxes = state.page.content;
    if (hoaxes.length === 0) {
      return;
    }
    const hoaxAtBottom = hoaxes[hoaxes.length - 1];
    setState(prevState => ({ ...prevState, isLoadingOldHoaxes: true }));
    apiCalls
      .loadOldHoaxes(hoaxAtBottom.id, username)
      .then(response => {
        setState(preState => ({
          ...preState,
          page: {
            ...response.data,
            content: [...preState.page.content, ...response.data.content]
          },
          isLoadingOldHoaxes: false
        }));
      })
      .catch(error => {
        setState(preState => ({
          ...preState,
          isLoadingOldHoaxes: false
        }));
      });
  };
  const onClickLoadNew = e => {
    const hoaxes = state.page.content;
    let topHoaxId = 0;
    if (hoaxes.length > 0) {
      topHoaxId = hoaxes[0].id;
    }
    setState(prevState => ({ ...prevState, isLoadingNewHoaxes: true }));
    apiCalls
      .loadNewHoaxes(topHoaxId, username)
      .then(response => {
        setState(preState => ({
          ...preState,
          page: {
            ...preState.page,
            content: [...preState.page.content, ...response.data.content]
          },
          isLoadingNewHoaxes: false,
          newHoaxCount: 0
        }));
      })
      .catch(error => {
        setState(preState => ({
          ...preState,
          isLoadingNewHoaxes: false
        }));
      });
  };
  if (state.page.content.length === 0 && state.newHoaxCount === 0) {
    return (
      <div className="card card-header text-center">There are no hoaxes</div>
    );
  }
  return (
    <div>
      {state.newHoaxCount && state.newHoaxCount > 0 && (
        <div
          className="card card-header text-center"
          onClick={!state.isLoadingNewHoaxes && onClickLoadNew}
          style={{
            cursor: state.isLoadingNewHoaxes ? "not-allowed" : "pointer"
          }}
        >
          {state.isLoadingNewHoaxes ? (
            <Spinner />
          ) : state.newHoaxCount === 1 ? (
            "There is 1 new hoax"
          ) : (
            `There are ${state.newHoaxCount} new hoax`
          )}
        </div>
      )}
      {state.page.content.map(hoax => {
        return <HoaxView key={hoax.id} hoax={hoax} />;
      })}
      {state.page.last === false && (
        <div
          className="card card-header text-center"
          style={{
            cursor: state.isLoadingOldHoaxes ? "not-allowed" : "pointer"
          }}
          onClick={!state.isLoadingOldHoaxes && onClickLoadMore}
        >
          {state.isLoadingOldHoaxes ? <Spinner /> : "Load More"}
        </div>
      )}
    </div>
  );
}

export default HoaxFeed;

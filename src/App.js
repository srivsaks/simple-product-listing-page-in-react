import "./styles.css";
import { useCallback, useEffect, useRef, useState } from "react";
import InfiniteScroller from "./InfiniteScroller";

export default function App() {
  const Access_Key = "p952Fj8fbc-te3WTYzztLebW6GLI3P4F5TUllqVa1aM";
  const inputRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);

  const fetchImages = useCallback(async (val, page = 1) => {
    if (!val) {
      setData([]);
      setHasNext(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    console.log(page);
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?page=${page}&query=${val}&client_id=${Access_Key}`
      );
      const res2 = await res.json();
      console.log(res2);
      setData((prev) => {
        const oldItems = [...prev];
        const newItems = res2.results;
        //console.log([...prev]);
        return oldItems.concat(newItems);
      });
      if (res2.totalpages === page) {
        setHasNext(false);
      }
    } catch (e) {
      setHasNext(false);
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onChange = useCallback((val) => {
    // setData([]);
    fetchImages(inputRef.current.value);
  }, []);

  const debounce = useCallback((fn, delay = 1000) => {
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }, []);

  const func = debounce(onChange);

  return (
    <div className="App">
      <input onChange={(e) => func(e.target.value)} ref={inputRef} />
      <div>
        <InfiniteScroller
          data={data}
          fetchData={(page) => {
            fetchImages(inputRef.current.value, page === 1 ? page + 1 : page);
          }}
          hasNext={hasNext}
          loading={loading}
          render={(item) => {
            return (
              <img
                className="img"
                src={item.urls.regular}
                height="200px"
                width="200px"
                alt="none"
              />
            );
          }}
        />
      </div>
    </div>
  );
}

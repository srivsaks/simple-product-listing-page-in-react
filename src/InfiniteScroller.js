import { React, useCallback, useEffect, useState, useRef } from "react";
import LoadingSkeleton from "./LoadingSkeleton";

interface Data {
  data: Array<any>;
  id: string;
}

const InfiniteScroller = ({ data, render, fetchData, loading, hasNext }) => {
  const [result, setResult] = useState([]);
  const lastItemRef = useRef(null);
  const [page, setPage] = useState(1);
  const [load, setLoad] = useState(loading);

  useEffect(() => {
    setLoad(loading);
  }, [loading]);

  const lastItemRefWrapper = useCallback(
    (node) => {
      if (load || !hasNext) return;
      if (lastItemRef.current) {
        lastItemRef.current.disconnect();
      }

      lastItemRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchData(page);
            setPage((page) => page + 1);
          }
        },
        { root: null, rootMargin: "0px", threshold: 1 }
      );
      if (node) {
        lastItemRef.current.observe(node);
      }
    },
    [load, hasNext]
  );

  useEffect(() => {
    setResult(data);
  }, [data]);

  return (
    <div className="infinite-scroller">
      {result.length > 0 &&
        result.map((item, index) => {
          return (
            <div
              ref={index === result.length - 1 ? lastItemRefWrapper : null}
              className="background skeleton"
            >
              {render(item)}
            </div>
          );
        })}
      {loading ? <>loading.... </> : null}
      {!hasNext && <>End of the result</>}
    </div>
  );
};

export default InfiniteScroller;

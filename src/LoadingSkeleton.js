import { React } from "react";
const LoadingSkeleton = ({ ref, children }) => {
  return (
    <div className="background skeleton" ref={ref}>
      {children}
    </div>
  );
};
export default LoadingSkeleton;

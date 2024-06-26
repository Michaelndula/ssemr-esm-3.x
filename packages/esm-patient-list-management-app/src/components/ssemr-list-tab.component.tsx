import React from "react";
import styles from "./index.scss";

const SsemrListTabComponent = ({
  name,
  handler,
  isActive,
  activeClassName,
  inertClassName,
}) => {
  return (
    <button
      className={isActive ? styles[activeClassName] : styles[inertClassName]}
      onClick={handler}
    >
      {name}
    </button>
  );
};

export default SsemrListTabComponent;

import React, { useState } from "react";

const InputComponent = ({
  type,
  id,
  placeHolder,
  value = "",
  name,
  icon,
  onChange,
}) => {
  const [showVisibility, setShowVisibility] = useState(true);
  return (
    <div className="relative w-full mb-4">
      <input
        name={name}
        type={
          type === "password" ? (showVisibility ? "text" : "password") : type
        }
        id={id}
        placeholder={placeHolder}
        // defaultValue={value}
        value={value}
        className="input-box"
        onChange={onChange}
      />

      <i className={`fi fi-rr-${icon} input-icon`}></i>

      {type === "password" ? (
        <i
          className={`fi fi-rr-eye${
            showVisibility ? "" : "-crossed"
          } input-icon right-5 left-auto cursor-pointer`}
          onClick={() => setShowVisibility((state) => !state)}
        ></i>
      ) : null}
    </div>
  );
};

export default InputComponent;

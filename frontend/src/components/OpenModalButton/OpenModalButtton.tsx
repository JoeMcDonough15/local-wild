import React from "react"; // ! get rid of this
import { useState } from "react";
import { createPortal } from "react-dom";
const selectedElement = document.getElementById("modal");
const OpenModalButton = ({
  modalComponent, // component to render inside the modal
  buttonText, // text of the button that opens the modal
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <>
      <button
        onClick={() => {
          setShowModal(true);
        }}
        type="button"
      >
        {buttonText}
      </button>
      {showModal &&
        selectedElement &&
        createPortal(
          <div className="modal-container">{modalComponent}</div>,
          selectedElement
        )}
    </>
  );
};

export default OpenModalButton;

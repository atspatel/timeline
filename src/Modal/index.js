import React from "react";
import ReactDOM from "react-dom";
import "./modal.css";
import { AiFillCloseCircle } from "react-icons/ai";

const Modal = (props) => {
  const { show, title, onClose, renderFooter, children } = props;
  return ReactDOM.createPortal(
    <>
      {show && (
        <div className="modal">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{title}</h3>
              <AiFillCloseCircle
                style={{ height: 35, width: 35 }}
                onClick={onClose}
              />
            </div>
            <div className="modal-body">{children}</div>
            <div className="modal-footer">{renderFooter && renderFooter()}</div>
          </div>
        </div>
      )}
    </>,
    document.getElementById("root")
  );
};

export default Modal;

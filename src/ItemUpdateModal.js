import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

import moment from "moment";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function unixToDateTime(unixTime) {
  console.log(unixTime);
  console.log(moment.unix(unixTime));
  return moment(unixTime).format("lll");
}

function DeleteAlertButton(props) {
  const { onConfirmDelete } = props;
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function onClickDelete() {
    onConfirmDelete && onConfirmDelete();
    handleClose();
  }

  return (
    <div>
      <Button onClick={handleClickOpen} color="error">
        Delete
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure, you want to delete?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={onClickDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default function ItemUpdateModal(props) {
  const {
    show,
    onClose,
    initItem,
    onCreateNewItem,
    onUpdateItem,
    onConfirmDelete,
  } = props;
  const [item, setItem] = useState(null);
  const [error, setError] = useState({});

  const isUpdate = initItem && initItem.id !== null;

  function handleSubmit() {
    if (item && item.title.length > 0) {
      if (isUpdate) {
        onUpdateItem(item);
        return onClose();
      } else {
        onCreateNewItem(item);
        return onClose();
      }
    } else {
      setError({ ...error, title: true });
    }
  }

  function handleDelete() {
    onConfirmDelete(item.id);
    return onClose();
  }
  function handleClose(event, reason) {
    if (reason && reason === "backdropClick") return;
    onClose();
  }

  useEffect(() => {
    setItem(initItem);
  }, [initItem]);

  return (
    <Modal
      open={show}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {item && (
          <>
            <TextField
              error={error.title}
              id="outlined-multiline-static"
              label="Item Text"
              multiline
              rows={4}
              style={{ width: "100%" }}
              placeholder="Add item text here..."
              value={item.title}
              onChange={(event) => {
                setItem({ ...item, title: event.target.value });
                setError({ ...error, title: false });
              }}
            />
            <div>Start Time: {unixToDateTime(item.start)}</div>
            <div>End Time: {unixToDateTime(item.end)}</div>
          </>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <div>
            {isUpdate && <DeleteAlertButton onConfirmDelete={handleDelete} />}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
            }}
          >
            <Button onClick={onClose}>Close</Button>
            <Button
              variant="contained"
              style={{ width: 200 }}
              onClick={handleSubmit}
            >
              {isUpdate ? "Update Item" : "Create Item"}
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}

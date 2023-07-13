import React, { useState, useEffect } from "react";
import moment from "moment";

import Timeline from "react-calendar-timeline";
import ItemUpdateModal from "./ItemUpdateModal";

import generateFakeData from "./generate-fake-data";
import ItemRenderer from "./ItemRenderer";

const emptyItem = {
  id: null,
  group: "",
  title: "",
  start: null,
  end: null,
  className: "",
  itemProps: "",
};

var keys = {
  groupIdKey: "id",
  groupTitleKey: "title",
  groupRightTitleKey: "rightTitle",
  itemIdKey: "id",
  itemTitleKey: "title",
  itemDivTitleKey: "title",
  itemGroupKey: "group",
  itemTimeStartKey: "start",
  itemTimeEndKey: "end",
  groupLabelKey: "title",
};

export default function CustomTimeline() {
  const defaultTimeStart = moment().startOf("day").toDate();
  const defaultTimeEnd = moment().startOf("day").add(1, "day").toDate();

  const [groups, setGroups] = useState([]);
  const [items, setItems] = useState([]);

  const [maxID, setMaxID] = useState(-1);

  const [modalItemObject, setModalItemObject] = useState(null);

  useEffect(() => {
    const { groups, items } = generateFakeData();
    setGroups(groups);
    setItems(items);

    var maxID = items.reduce((arr, oId) => {
      return (arr = arr > parseInt(oId.id) ? arr : parseInt(oId.id));
    });
    setMaxID(maxID ?? -1);
  }, []);

  function handleItemMove(itemId, dragTime, newGroupOrder) {
    const group = groups[newGroupOrder];

    const updatedItems = items.map((item) =>
      item.id === itemId
        ? Object.assign({}, item, {
            start: dragTime,
            end: dragTime + (item.end - item.start),
            group: group.id,
          })
        : item
    );
    setItems(updatedItems);
  }

  function handleItemResize(itemId, time, edge) {
    const updatedItems = items.map((item) =>
      item.id === itemId
        ? Object.assign({}, item, {
            start: edge === "left" ? time : item.start,
            end: edge === "left" ? item.end : time,
          })
        : item
    );
    setItems(updatedItems);
  }

  function handleCanvasClick(groupId, time, e) {
    let newItemObject = {
      ...emptyItem,
      group: groupId,
      start: time,
      end: time + 10800000,
    };
    setModalItemObject(newItemObject);
  }

  function handleUpdateItem(itemId, e, time) {
    const itemToUpdate = items.find((item) => item.id === itemId);
    setModalItemObject(itemToUpdate);
  }

  function onUpdateItem(itemObj) {
    const start = itemObj.start;
    const newItemObj = {
      ...itemObj,
      className:
        moment(start).day() === 6 || moment(start).day() === 0
          ? "item-weekend"
          : "",
      itemProps: {
        "data-tip": itemObj.title,
      },
    };
    const itemId = itemObj.id;
    const updatedItems = items.map((item) =>
      item.id === itemId ? newItemObj : item
    );
    setItems(updatedItems);
  }

  function onCreateNewItem(itemObj) {
    const start = itemObj.start;
    const newItemObj = {
      ...itemObj,
      id: maxID + 1 + "",
      className:
        moment(start).day() === 6 || moment(start).day() === 0
          ? "item-weekend"
          : "",
      itemProps: {
        "data-tip": itemObj.title,
      },
    };
    const updatedItems = [...items, newItemObj];
    setItems(updatedItems);
    setMaxID(maxID + 1);
  }

  function onConfirmDelete(itemId) {
    const updatedItems = items.filter((item) => item.id !== itemId);
    setItems(updatedItems);
  }

  const show = modalItemObject !== null;
  return (
    <>
      {show && (
        <ItemUpdateModal
          show={show}
          onClose={() => setModalItemObject(null)}
          initItem={modalItemObject}
          onCreateNewItem={onCreateNewItem}
          onUpdateItem={onUpdateItem}
          onConfirmDelete={onConfirmDelete}
        />
      )}
      <Timeline
        groups={groups}
        items={items}
        keys={keys}
        fullUpdate
        itemTouchSendsClick={false}
        stackItems
        itemHeightRatio={0.75}
        canMove={true}
        canResize={"both"}
        defaultTimeStart={defaultTimeStart}
        defaultTimeEnd={defaultTimeEnd}
        onItemMove={handleItemMove}
        onItemResize={handleItemResize}
        onCanvasDoubleClick={handleCanvasClick}
        onItemSelect={handleUpdateItem}
        itemRenderer={(props) => <ItemRenderer {...props} />}
      />
    </>
  );
}

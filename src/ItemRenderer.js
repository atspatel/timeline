import React from "react";

export default function ItemRenderer(props) {
  const { item, itemContext, getItemProps, getResizeProps } = props;
  const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
  return (
    <div {...getItemProps(item.itemProps)}>
      {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : ""}

      <div
        className="rct-item-content"
        style={{ maxHeight: `${itemContext.dimensions.height}` }}
      >
        {item.title}
      </div>

      {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : ""}
    </div>
  );
}

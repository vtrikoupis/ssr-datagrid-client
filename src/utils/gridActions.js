export const rowUpdated = (e) => {
  // cell is in focus
  // we can get the values for that row before updating anything
  console.log("row updated")
  /*  Should the api be updated after each event or should a button "Save changes" write updates in batch?
      in the first option, should there be a debounce maybe so that we can poll multiple writes, for example every 10 seconds?
      if()
  */
}

export const customizeColumns = (columns, settings) => {
  columns.forEach((column, index) => {
    if (settings[0].columns[index].visible) {
      column.visibleIndex = settings[0].columns[index].visibleIndex;
    } else {
      column.visible = false
    }
    if (settings[0].columns[index].groupIndex) {
      // console.log("Column at index " + index + " (field = " + column.dataField + ") should have a groupIndex of " + settings[0].order[index].groupIndex)
      // column.groupIndex = settings[0].order[index].groupIndex
    }
  })
}
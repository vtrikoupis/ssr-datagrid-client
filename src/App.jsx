import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import DataGrid, { Column, ColumnChooser, Editing, GroupPanel, Grouping } from 'devextreme-react/data-grid';
import Button from 'devextreme-react/button';

import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import './styles/icons.css'
import './styles/filter.css'
import _ from "lodash"
import { StoreProvider, useStoreActions, useStoreState } from "easy-peasy";
import store from './utils/store'
import { ModalProvider } from "styled-react-modal";
import FilterBuilder from 'devextreme-react/filter-builder';
import Async from 'react-async'


const App = () => {
  const gridParams = {
    showBorders: true
  }
  const gridRef = useRef(null)

  const [error, setError] = useState(null);
  const [event, setEvent] = useState(null)
  const [initVal, setInitVal] = useState(null)
  const [intendedCellToEdit, setIntendedCellToEdit] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [lastColumnHidden, setLastColumnHidden] = useState(null)
  const [groupPanelVisible, setGroupPanelVisible] = useState(true)
  const [gridFilterValue, setGridFilterValue] = useState(null)

  const setColumns = useStoreActions(actions => actions.columns.setInitialColumns)
  const columns = useStoreState(state => state.columns.columns)
  const receiveColumns = useStoreActions(actions => actions.columns.receiveColumns)


  const setData = useStoreActions(actions => actions.data.setData)
  const data = useStoreState(state => state.data.data)

  const setSettings = useStoreActions(actions => actions.settings.setSettings)
  const settings = useStoreState(state => state.settings.settings)

  // 1st state update: cell focused
  useEffect(() => {
    if (event) {
      setIntendedCellToEdit(event.column.dataField)
    }
  }, [event])

  // 2nd state update: capture the value of that cell
  useEffect(() => {
    if (event) {
      console.log("intendedCell captured of column: " + intendedCellToEdit + " and content " + event.data[intendedCellToEdit])
      setInitVal(event.data[intendedCellToEdit])
    }
  }, [intendedCellToEdit])


  const customizeColumns = (columns) => {
    columns.forEach((column, index) => {
      console.log(settings[0])
      if (settings[0].columns[index].visible) {
        column.visibleIndex = settings[0].columns[index].visibleIndex
      } else {
        column.visible = false
      }

      if (settings[0].columns[index].groupIndex) {
        // console.log("Column at index " + index + " (field = " + column.dataField + ") should have a groupIndex of " + settings[0].order[index].groupIndex)
        // column.groupIndex = settings[0].order[index].groupIndex
      }


    })
    console.log("logging instance")
    console.log(gridRef.current.instance)
  }

  const applyFilter = (e) => {
    setGridFilterValue(e)
  }

  const onFilterValueChanged = (e) => {
    console.log(e.value)
    setGridFilterValue(e.value)
  }


  const prepareContextMenu = (ctx) => {
    if (ctx.target == "header") {
      ctx.items.push(
        {
          "text": "Hide Column",
          "disabled": false,
          "icon": "hide",
          "onItemClick": (e) => hideColumn(e, ctx)
        },
        {
          "text": groupPanelVisible ? "Hide GroupPanel" : "Show GroupPanel",
          "icon": "groupPanel",
          "disabled": false,
          "onItemClick": (e) => toggleGroupPanelVisibility(e, ctx)
        },
        {
          "text": "Unhide last Column",
          "disabled": false,
          "icon": "unhide",
          "onItemClick": (e) => unhideColumn(e, ctx)
        },
        // {
        //   "text": "Best Fit Column",
        //   "disabled": false,
        //   "icon": "resize",
        //   "onItemClick": (e) => bestFitColumn(e, ctx)
        // },
      )
    }
  }

  // pass the event and the context
  function hideColumn(e, ctx) {
    // could use the itemIndex but as we add more items this might change whereas the icon id will be set to hide
    if (ctx.column && e.itemData.icon === "hide") {
      gridRef.current.instance.columnOption(ctx.column.visibleIndex, 'visible', false)
      setLastColumnHidden(ctx.column.visibleIndex)
    }
  }

  function unhideColumn(e, ctx) {
    // could use the itemIndex but as we add more items this might change whereas the icon id will be set to hide
    if (ctx.column && e.itemData.icon === "unhide") {
      if (lastColumnHidden) {
        gridRef.current.instance.columnOption(lastColumnHidden, 'visible', true)
      }
    }
  }

  // auto not an option on devextreme? Have to repaint the grid?
  function bestFitColumn(e, ctx) {
    if (ctx.column && e.itemData.icon === "resize") {
      console.log('click through')
      console.log(gridRef.current.instance)
      console.log(ctx.column.dataField)
      gridRef.current.instance.columnOption(ctx.column.dataField, 'width', 'auto')
    }
  }

  // same as comment above
  function bestFitAllColumns(e, ctx) {
    // if(ctx.column && e.itemData.ixon === "fit-all")
  }

  function toggleGroupPanelVisibility(e, ctx) {
    if (e.itemData.icon === "groupPanel") {
      if (groupPanelVisible) {
        setGroupPanelVisible(false)
      } else {
        setGroupPanelVisible(true)
      }
    }
  }




  // final useEffect to hide Modal if something can't be done synchronously..
  // useEffect(() => {
  //   if (!isLoading) {
  //     setModalOpen(false)
  //   }
  // }, [isLoading])



  const startingToEdit = (e) => {
    // cell is in focus
    // we can get the values for that row before updating anything
    const { _id, uid, name, role, email, modules, details } = e.data
    /*  devextreme events are synchronous but our state is updating asynchronously. Let everything that needs to happen, 
        happen in the useEffect hooks, with the corresponding dependency array
    */
    setEvent(e);
  }

  function onInitialized(e) {
    e.component.option('onColumnsChanging', onColumnsChanging)

  }

  function cellClicked(e) {
    console.log(e)
  }

  const onColumnsChanging = _.debounce((args) => {
    console.log(gridRef.current.instance)
    // if (initialColumns === null) {
    // setInitialColumns(args.component._controllers.stateStoring._state.columns)
    // console.log(args.component._controllers.stateStoring._state.columns)
    // } else {
    // console.log(initialColumns)
    // }
    // console.log(args.component._controllers.stateStoring._state)
  }, 1000)
  const rowUpdated = (e) => {
    // cell is in focus
    // we can get the values for that row before updating anything
    console.log("row updated")
    /*  Should the api be updated after each event or should a button "Save changes" write updates in batch?
        in the first option, should there be a debounce maybe so that we can poll multiple writes, for example every 10 seconds?
        if()
    */
  }

  const fetchColumns = async () => {
    const res = await fetch(process.env.API_URL + `users/no-role/settings`)
    if (!res.ok) throw new Error(res.statusText)
    return res.json();
  }

  useEffect(() => {
    fetch(process.env.API_URL + `users/no-role`)
      .then(res => res.json())
      .then(
        (result) => {
          // setColumnNames(Object.keys(result[0]))
          setData(result)
        }, (error) => {
          setError(error)
        })
    fetch(process.env.API_URL + `users/no-role/settings`)
      .then(res => res.json())
      .then(
        (result) => {
          setSettings(result)
          setGridFilterValue(JSON.parse(result[0].filters))
          // console.log(result[0].columns)
          // setColumns(result[0].columns)
        }, (error) => {
          setError(error)
        })
  }, [])


  return (
    <div>
      {/* <StyledModal isOpen={modalOpen}>
        Loading...
      </StyledModal> */}
      <Async promiseFn={fetchColumns}>
        <Async.Loading>Loading..</Async.Loading>
        <Async.Fulfilled>
          {columns => (
            <div>
              <div className="filter-container">
                <FilterBuilder
                  fields={columns[0].columns}
                  value={gridFilterValue}
                  onValueChanged={onFilterValueChanged} />
                <Button
                  text="Apply Filter"
                  type="default"
                  onClick={applyFilter} />
              </div>

              <div className="dx-clearfix"></div>
              <div>
                <DataGrid

                  {...gridParams}
                  dataSource={data}
                  customizeColumns={e => customizeColumns(e)}
                  onEditingStart={(e) => startingToEdit(e)}
                  onRowUpdated={(e) => rowUpdated(e)}
                  allowColumnReordering={true}
                  allowColumnResizing={true}
                  columnHidingEnabled={true}
                  onInitialized={onInitialized}
                  onCellClick={cellClicked}
                  onContextMenuPreparing={prepareContextMenu}
                  ref={gridRef}
                  filterValue={gridFilterValue}
                  columns={columns[0].columns}

                >
                  <Grouping contextMenuEnabled={true} />
                  <GroupPanel visible={groupPanelVisible} /> {/* or "auto" */}
                  <ColumnChooser enabled={true} />

                  <Editing
                    mode="cell"
                    allowUpdating={true} />
                </DataGrid>
              </div>
            </div>

          )}

        </Async.Fulfilled>
      </Async>


    </div>

  )
}

ReactDOM.render(
  <StoreProvider store={store}>
    <ModalProvider>
      <App />
    </ModalProvider>
  </StoreProvider>
  ,
  document.getElementById("app"));

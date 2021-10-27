import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

import _ from "lodash"
import Async from 'react-async'
import { StoreProvider, useStoreActions, useStoreState } from "easy-peasy";

import FilterBuilder from 'devextreme-react/filter-builder';
import DataGrid, { Column, ColumnChooser, Editing, GroupPanel, Grouping } from 'devextreme-react/data-grid';
import Button from 'devextreme-react/button';

import store from './utils/store'
import { fetchColumns, updateRow, updateFilters } from './utils/api'
import { rowUpdated, customizeColumns } from './utils/gridActions'
import './styles/base.css'


const App = () => {
  const gridParams = {
    showBorders: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnHidingEnabled: true
  }

  const [cellVal, setCellVal] = useState(null)
  const [keyDownEvent, setKeyDownEvent] = useState(null)
  const [columnIndex, setColumnIndex] = useState(null)
  const [rowIndex, setRowIndex] = useState(null)
  const [settingsId, setSettingsId] = useState(null)
  const [columns, setColumns] = useState(null)

  const gridRef = useRef(null)
  const [error, setError] = useState(null);
  const [event, setEvent] = useState(null)
  const [initVal, setInitVal] = useState(null)
  const [intendedCellToEdit, setIntendedCellToEdit] = useState(null)
  const [lastColumnHidden, setLastColumnHidden] = useState(null)
  const [groupPanelVisible, setGroupPanelVisible] = useState(true)
  const [gridFilterValue, setGridFilterValue] = useState(null)
  const [pendingChanges, setPendingChanges] = useState(false)


  const setData = useStoreActions(actions => actions.data.setData)
  const data = useStoreState(state => state.data.data)

  const setSettings = useStoreActions(actions => actions.settings.setSettings)
  const settings = useStoreState(state => state.settings.settings)

  const setParameters = useStoreActions(actions => actions.parameters.setParameters)
  const parameters = useStoreState(state => state.parameters.parameters)

  // 1st state update: cell focused
  useEffect(() => {
    if (event) {
      setIntendedCellToEdit(event.column.dataField)
    }
  }, [event])

  // 2nd state update: capture the value of that cell
  useEffect(() => {
    if (intendedCellToEdit) {
      // console.log((event.data))
      // console.log("intendedCell captured of column: " + intendedCellToEdit + " and content " + event.data[intendedCellToEdit])
      // console.log(event.data[intendedCellToEdit])
    }
  }, [intendedCellToEdit])

  useEffect(()=> {
    // console.log(columns)
    if(gridRef.current?.instance){
      updateColumns(gridRef.current?.props.columns)

    }
    
  }, [lastColumnHidden, groupPanelVisible])

  const onFilterValueChanged = (e) => {
    console.log(e)
    console.log(e.value)
    console.log(settingsId)
    setGridFilterValue(e.value)
    updateFilters(e.value, settingsId)
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

  function toggleGroupPanelVisibility(e, ctx) {
    if (e.itemData.icon === "groupPanel") {
      if (groupPanelVisible) {
        setGroupPanelVisible(false)
      } else {
        setGroupPanelVisible(true)
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


  const startingToEdit = (e) => {
    // cell is in focus
    // we can get the values for that row before updating anything
    const { _id, uid, name, role, email, modules, details } = e.data
    /*  devextreme events are synchronous but our state is updating asynchronously. Let everything that needs to happen, 
        happen in the useEffect hooks, with the corresponding dependency array
    */
    // setEvent(e);
  }

  function onInitialized(e) {
    e.component.option('onColumnsChanging', onColumnsChanging)
  }

  function cellClicked(e) {
    // we can set the value of the cell that is about be edited
    setCellVal(gridRef.current.instance.cellValue(e.rowIndex, e.columnIndex))
    setColumnIndex(e.columnIndex)
    setRowIndex(e.rowIndex)

  }

  function onKeyDown(e) {
    setKeyDownEvent(e)
    if (e.event.target.className === "dx-texteditor-input") {

      // console.log("some input is being updated..")
      setPendingChanges(true)
    }

  }

  useEffect(() => {
    if (keyDownEvent) {
      console.log(gridRef.current.instance.cellValue(rowIndex, columnIndex))
    }

  }, [keyDownEvent])

  const onColumnsChanging = _.debounce((args) => {
    // console.log("columns changing")
    // console.log(gridRef.current.instance)
    // if (initialColumns === null) {
    // setInitialColumns(args.component._controllers.stateStoring._state.columns)
    // console.log(args.component._controllers.stateStoring._state.columns)
    // } else {
    // console.log(initialColumns)
    // }
    // console.log(args.component._controllers.stateStoring._state)
  }, 1000)



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
          const { _id, filters, columns } = result[0]
          console.log(result)
          setSettings(result)
          setGridFilterValue(JSON.parse(filters))
          setSettingsId(_id)
          setColumns(columns)
          // console.log(result[0].columns)
          // setColumns(result[0].columns)
        }, (error) => {
          setError(error)
        })
  }, [])

  const customizeColumnsWithSettings = useCallback((e) => {
    return customizeColumns(e, settings)
  }, [settings]);



  const changesRegistered = (e) => {
    const rowObj = e.changes[0].data;
    updateRow(rowObj)
    // Perhaps there's more changes to be saved.
    setPendingChanges(false)
  }

  const saveChanges = () => {

  }

  useEffect(() => {
    if (pendingChanges) {
      window.addEventListener("beforeunload", (ev) => {
        ev.preventDefault();
        return ev.returnValue = 'You have unsaved changes! Are you sure you want to exit?';
      });
    }

  }, [pendingChanges])




  return (
    <div>
      <Async promiseFn={fetchColumns}>
        <Async.Loading>Loading..</Async.Loading>
        <Async.Fulfilled>
          {columns => (
            <div>

              <Button
                text={pendingChanges ? "Pending Changes" : "Synchronised"}
                disabled={!pendingChanges}
                type="default"
                onClick={saveChanges} />
              <div className="filter-container">
                <FilterBuilder
                  fields={columns[0].columns}
                  value={gridFilterValue}
                  onValueChanged={onFilterValueChanged} />
                {/* <Button
                  text="Apply Filter"
                  type="default"
                  onClick={applyFilter} /> */}
              </div>

              <div className="dx-clearfix"></div>
              <div>
                <DataGrid
                  {...gridParams}
                  dataSource={data}
                  customizeColumns={customizeColumnsWithSettings}
                  onEditingStart={startingToEdit}
                  onRowUpdated={rowUpdated}
                  onInitialized={onInitialized}
                  onCellClick={cellClicked}
                  onKeyDown={onKeyDown}
                  onContextMenuPreparing={prepareContextMenu}
                  ref={gridRef}
                  filterValue={gridFilterValue}
                  columns={columns[0].columns}
                  onSaved={changesRegistered}
                >
                  <Grouping contextMenuEnabled={true} />
                  <GroupPanel visible={groupPanelVisible} /> {/* or "auto" */}
                  <ColumnChooser enabled={true} />
                  <Editing
                    mode="cell"
                    allowUpdating={true}
                  />
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
    <App />
  </StoreProvider>
  ,
  document.getElementById("app"));

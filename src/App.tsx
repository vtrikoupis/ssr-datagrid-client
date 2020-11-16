import * as React from "react";
import { useEffect, useRef, useState } from "react"
import * as ReactDOM from "react-dom";

import * as _ from "lodash"
import Async from 'react-async'
import { StoreProvider, useStoreActions, useStoreState, createTypedHooks } from "easy-peasy";

import FilterBuilder from 'devextreme-react/filter-builder';
import DataGrid, { Column, ColumnChooser, Editing, GroupPanel, Grouping } from 'devextreme-react/data-grid';
import Button from 'devextreme-react/button';

import { fetchColumns } from './utils/api'
import { rowUpdated, customizeColumns } from './utils/gridActions'
import { difference } from './utils/difference'
import './styles/base.css'
import { StoreModel } from "./utils/model";
import { dxEvent } from "devextreme/events";
import { DxDataGridEditingStartEvent } from "./utils/dx-types/dx-data-grid-editing-start.event"
import { DxContextMenuItemClickEvent } from "./utils/dx-types/dx-context-menu-item-click.event";

import DevExpress from "devextreme";
import dxDataGrid from "devextreme/ui/data_grid";
import dxFilterBuilder from "devextreme/ui/filter_builder";
import { dxFilterBuilderField } from "devextreme/ui/filter_builder";
import { dxDataGridColumn } from "devextreme/ui/data_grid";

// declare const initDxDataGridEvent: DxDataGridEditingStartEvent;
declare const initCtxMenuEvent: DxContextMenuItemClickEvent;

const App = () => {
  const gridParams = {
    showBorders: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    columnHidingEnabled: true
  }


  const gridRef = useRef(null)
  const [error, setError] = useState(null);
  const [event, setEvent] = useState(null)
  const [initVal, setInitVal] = useState(null)
  const [intendedCellToEdit, setIntendedCellToEdit] = useState(null || "")
  const [lastColumnHidden, setLastColumnHidden] = useState(null || 0)
  const [groupPanelVisible, setGroupPanelVisible] = useState(true)
  const [gridFilterValue, setGridFilterValue] = useState(null)
  const [pendingChanges, setPendingChanges] = useState(false)

  const { useStoreActions, useStoreState, useStoreDispatch, useStore } = createTypedHooks<StoreModel>();

  const setGridData = useStoreActions(actions => actions.dataModel.setGridData)
  const gridData = useStoreState(state => state.dataModel.gridData)

  const setValueToTrack = useStoreActions(actions => actions.dataModel.setValueToTrack)
  const valueToTrack = useStoreState(state => state.dataModel.valueToTrack)

  const setSettings = useStoreActions(actions => actions.settingsModel.setSettings)
  const settings = useStoreState(state => state.settingsModel.settings)

  const setParameters = useStoreActions(actions => actions.parametersModel.setParameters)
  const parameters = useStoreState(state => state.parametersModel.parameters)



  // 1st state update: cell focused
  useEffect(() => {
    if (event) { // it's not null ↴
      setIntendedCellToEdit(event.column.dataField!) // exclamation mark tells typescript, that you guarantee it's not null.
    }
  }, [event])

  // 2nd state update: capture the value of that cell
  useEffect(() => {
    if (intendedCellToEdit) {
      console.log("intendedCell captured of column: " + intendedCellToEdit + " and content " + event.data[intendedCellToEdit])

      // on the first iteration
      if (!valueToTrack) {
        setValueToTrack(event.data)
      }
    }
  }, [intendedCellToEdit])

  /**
   * Things that can change should be synchronized:
   * filters, column order/visibility, grouping, data
   * 
   */

  useEffect(() => {


  })


  const saveChanges = () => {

  }

  const onFilterValueChanged = (e: any) => {
    console.log(e.value)
    setGridFilterValue(e.value)
  }


  const prepareContextMenu = (ctx: any) => {
    if (ctx.target == "header") {
      ctx.items.push(
        {
          "text": "Hide Column",
          "disabled": false,
          "icon": "hide",
          "onItemClick": (e: DxContextMenuItemClickEvent) => hideColumn(e, ctx)
        },
        {
          "text": groupPanelVisible ? "Hide GroupPanel" : "Show GroupPanel",
          "icon": "groupPanel",
          "disabled": false,
          "onItemClick": (e: DxContextMenuItemClickEvent) => toggleGroupPanelVisibility(e, ctx)
        },
        {
          "text": "Unhide last Column",
          "disabled": false,
          "icon": "unhide",
          "onItemClick": (e: DxContextMenuItemClickEvent) => unhideColumn(e, ctx)
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
  function hideColumn(e: DxContextMenuItemClickEvent, ctx: any) {
    // could use the itemIndex but as we add more items this might change whereas the icon id will be set to hide
    if (ctx.column && e.itemData.icon === "hide") {
      gridRef.current.instance.columnOption(ctx.column.visibleIndex, 'visible', false)
      setLastColumnHidden(ctx.column.visibleIndex)
    }
  }

  function unhideColumn(e: DxContextMenuItemClickEvent, ctx: any) {
    // React.useLayoutEffect(() => {
    // could use the itemIndex but as we add more items this might change whereas the icon id will be set to hide
    if (ctx.column && e.itemData.icon === "unhide") {
      if (lastColumnHidden && gridRef) {
        gridRef.current.instance.columnOption(lastColumnHidden, 'visible', true)
      }
    }
    // })

  }

  function toggleGroupPanelVisibility(e: DxContextMenuItemClickEvent, ctx: any) {
    if (e.itemData.icon === "groupPanel") {
      if (groupPanelVisible) {
        setGroupPanelVisible(false)
      } else {
        setGroupPanelVisible(true)
      }
    }
  }

  // auto not an option on devextreme? Have to repaint the grid?
  function bestFitColumn(e: DxContextMenuItemClickEvent, ctx: any) {
    if (ctx.column && e.itemData.icon === "resize") {
      console.log('click through')
      // console.log(gridRef.current.instance!)
      console.log(ctx.column.dataField)
      gridRef.current.instance.columnOption(ctx.column.dataField, 'width', 'auto')
    }
  }

  // same as comment above
  function bestFitAllColumns(e: DxContextMenuItemClickEvent, ctx: any) {
    // if(ctx.column && e.itemData.ixon === "fit-all")
  }




  const startingToEdit = (e: DxDataGridEditingStartEvent) => {
    // cell is in focus
    console.log('in here')
    // we can get the values for that row before updating anything
    const { _id, uid, name, role, email, modules, details } = event.data
    /*  devextreme events are synchronous but our state is updating asynchronously. Let everything that needs to happen, 
        happen in the useEffect hooks, with the corresponding dependency array
    */
    console.log(e)
    // setEvent(event);
  }

  function onInitialized(e: any) {
    e.component.option('onColumnsChanging', onColumnsChanging)

  }

  function cellClicked(e: any) {
    console.log(e)
  }

  const onColumnsChanging = _.debounce((args) => {
    console.log("columns changing")
    // console.log(gridRef.current.instance)
    // if (initialColumns === null) {
    // setInitialColumns(args.component._controllers.stateStoring._state.columns)
    // console.log(args.component._controllers.stateStoring._state.columns)
    // } else {
    // console.log(initialColumns)
    // }
    // console.log(args.component._controllers.stateStoring._state)
  }, 1000)

  const onValueChanged = () => {
    console.log("value changed")
  }


  useEffect(() => {
    fetch(process.env.API_URL + `users/no-role`)
      .then(res => res.json())
      .then(
        (result) => {
          // setColumnNames(Object.keys(result[0]))
          setGridData(result)
        }, (error) => {
          console.log(error)
          setError(error)
        })
    fetch(process.env.API_URL + `users/no-role/settings`)
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result)
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
      <Async promiseFn={fetchColumns}>
        {({ data, error, isLoading }) => {
          if (isLoading) return "Loading..."
          if (error) return `Something went wrong: ${error.message}`
          if (data) return (
            <div>
              {
                data.map((col) => {
                  <div>
                    {console.log(col.columns)}

                    <Button
                      text={pendingChanges ? "Pending Changes" : "Synchronised"}
                      disabled={!pendingChanges}
                      type="default"
                      onClick={saveChanges} />
                    <div className="filter-container">

                      <FilterBuilder
                        fields={col.columns as Array<dxFilterBuilderField>}
                        value={gridFilterValue || []}
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
                        dataSource={gridData}
                        customizeColumns={e => customizeColumns(e, settings)}
                        onEditingStart={e => startingToEdit(e as DxDataGridEditingStartEvent)}
                        onRowUpdated={(e) => rowUpdated(e)}
                        onInitialized={onInitialized}
                        onCellClick={cellClicked}
                        onContextMenuPreparing={prepareContextMenu}
                        ref={gridRef}
                        filterValue={gridFilterValue || []}
                        columns={col.columns as Array<dxDataGridColumn>}
                      // onValueChanged={onValueChanged}
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
                })
              }
            </div>


          )
        }
        }


      </Async>
    </div>

  )
}

export default App
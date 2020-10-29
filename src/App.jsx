import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import DataGrid, { Button, Column, ColumnChooser, Editing, GroupPanel, Grouping } from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import './styles/icons.css'
import _ from "lodash"
import { StoreProvider, useStoreActions, useStoreState } from "easy-peasy";
import store from './utils/store'
import { ModalProvider } from "styled-react-modal";
import { StyledModal } from "./components/Modal"
import { Hide } from "devextreme-react/tree-list";

const App = () => {
  const gridParams = {
    showBorders: true
  }
  const gridRef = useRef(null)

  const [columnNames, setColumnNames] = useState(null)
  const [error, setError] = useState(null);
  const [event, setEvent] = useState(null)
  const [modalOpen, setModalOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true)
  const [initVal, setInitVal] = useState(null)
  const [intendedCellToEdit, setIntendedCellToEdit] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [lastColumnHidden, setLastColumnHidden] = useState(null)

  const setInitialColumns = useStoreActions(actions => actions.columns.setInitialColumns)
  const initialColumns = useStoreState(state => state.columns.initialColumns)

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
      if (settings[0].order[index].visible) {
        column.visibleIndex = settings[0].order[index].visibleIndex
      } else {
        column.visible = false
      }
      console.log(gridRef.current.instance)
    })
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
          "text": "Unhide last Column",
          "disabled": false,
          "icon": "unhide",
          "onItemClick": (e) => unhideColumn(e, ctx)
        },
        {
          "text": "Best Fit Column",
          "disabled": false,
          "icon": "resize",
          "onItemClick": (e) => bestFitColumn(e, ctx)
        },
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
        if(lastColumnHidden){
          gridRef.current.instance.columnOption(lastColumnHidden, 'visible', true)
        }
      }
    }

    // auto not an option on devextreme? Have to repaint the grid?
    function bestFitColumn(e, ctx) {
      if(ctx.column && e.itemData.icon === "resize"){
        console.log('click through')
        console.log(gridRef.current.instance)
        gridRef.current.instance.columnOption(ctx.column.dataField, 'width', 'auto')
      }
    }


    // same as comment above
    function bestFitAllColumns(e, ctx) {
      // if(ctx.column && e.itemData.ixon === "fit-all")
    }

  // final useEffect to hide Modal if something can't be done synchronously..
  useEffect(() => {
    if (!isLoading) {
      setModalOpen(false)
    }
  }, [isLoading])



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
    if (initialColumns === null) {
      // setInitialColumns(args.component._controllers.stateStoring._state.columns)
      // console.log(args.component._controllers.stateStoring._state.columns)
    } else {
      // console.log(initialColumns)
    }
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

  useEffect(() => {
    fetch(process.env.API_URL + `users/no-role`)
      .then(res => res.json())
      .then(
        (result) => {
          setColumnNames(Object.keys(result[0]))
          setData(result)
        }, (error) => {
          setError(error)
        })
    fetch(process.env.API_URL + `users/no-role/settings`)
      .then(res => res.json())
      .then(
        (result) => {
          setSettings(result)
        }, (error) => {
          setError(error)
        })
  }, [])


  return (
    <div>
      {/* <StyledModal isOpen={modalOpen}>
        Loading...
      </StyledModal> */}
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
      >
        <Grouping contextMenuEnabled={true} />
        <GroupPanel visible={true} /> {/* or "auto" */}
        <ColumnChooser enabled={true} />

        <Editing
          mode="cell"
          allowUpdating={true} />
      </DataGrid>
    </div>
  )
}

  ;

ReactDOM.render(
  <StoreProvider store={store}>
    <ModalProvider>
      <App />
    </ModalProvider>
  </StoreProvider>
  ,
  document.getElementById("app"));

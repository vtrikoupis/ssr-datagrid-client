import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import DataGrid, { Button, Column, ColumnChooser, Editing } from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import _ from "lodash"
import { StoreProvider, useStoreActions, useStoreState } from "easy-peasy";
import store from './utils/store'
import { ModalProvider } from "styled-react-modal";
import { StyledModal } from "./components/Modal"

const App = () => {
  const gridParams = {
    showBorders: true
  }
  const gridRef = useRef(null)
  // const [initialColumnState, setInitialColumnState] = useState(null)
  // const [data, setData] = useState([])
  const [columnNames, setColumnNames] = useState(null)
  const [error, setError] = useState(null);
  const [event, setEvent] = useState(null)
  const [modalOpen, setModalOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true)
  const [initVal, setInitVal] = useState(null)
  const [intendedCellToEdit, setIntendedCellToEdit] = useState(null)
  const [completed, setCompleted] = useState(false)

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
    })
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
        ref={gridRef}


      // this next line only works with static data? why not with dynamic?
      // defaultColumns={columns}
      >
        {/* <ColumnChooser enabled={true} /> */}

        {/* <Columns columns={columnNames} /> */}

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

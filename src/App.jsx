import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import DataGrid, { Editing } from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css'; 3



const App = () => {
  const gridParams = {
    showBorders: true
  }
  const [data, setData] = useState([])
  const [error, setError] = useState(null);
  const [event, setEvent] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false);
  const [initVal, setInitVal] = useState(null)
  const [intendedCellToEdit, setIntendedCellToEdit] = useState(null)
  const columns = ['Uid', 'Name', 'Email', 'Modules', 'Details'];


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

  const startingToEdit = (e) => {
    // cell is in focus
    // we can get the values for that row before updating anything
    const { _id, uid, name, role, email, modules, details } = e.data
    /*  devextreme events are synchronous but our state is updating asynchronously. Let everything that needs to happen, 
        happen in the useEffect hooks, with the corresponding dependency array
    */
    setEvent(e);
  }

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
    fetch("http://localhost:5000/api/v1/users/no-role")
      .then(res => res.json())
      .then(
        (result) => {
          setData(result)
          setIsLoaded(true);
        }, (error) => {
          setError(error)
          setIsLoaded(true)
        })
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <DataGrid
          {...gridParams}
          dataSource={data}
          onEditingStart={(e) => startingToEdit(e)}
          onRowUpdated={(e) => rowUpdated(e)}
          allowColumnReordering={true}
          allowColumnResizing={true}
        // this next line only works with static data? why not with dynamic?
        // defaultColumns={columns}
        >
          <Editing
            mode="cell"
            allowUpdating={true} />
        </DataGrid>
      </div>
    )
  }

};

ReactDOM.render(<App />, document.getElementById("app"));

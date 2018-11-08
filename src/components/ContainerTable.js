import React from 'react';
import MUIDataTable from "mui-datatables";

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true

// return an array that contains the labels for each column
const getColumns = containers => {
  let columns = []

  for (let name in containers[0])
    columns.push(name)

  return columns
}

// return a 2D array that contains the data for each row
const getData = containers => {
  const data = []

  containers.forEach(container => {
    const containterData = []

    for (let name in container)
      containterData.push(container[name])

    data.push(containterData)
  })

  return data
}

// delete the selected containers
const deleteContainer = (data, props) => rowsSelected => {
  rowsSelected.data.forEach(row => {
    const rowData = data[row.index]; // selected row from data source
    const rowID = rowData[0]        // the id in the selected row
    props.del(rowID)
  })
}

const containerTable = (props) => {
  const containers = props.containers
  const columns = getColumns(containers)
  const data = getData(containers)

  const options = {
    filterType: 'checkbox',
    onRowsDelete: deleteContainer(data, props),
  };

  return (
    <MUIDataTable
      title={"Containers"}
      data={data}
      columns={columns}
      options={options}
    />
  )
}

export default containerTable
import {Parser} from 'json2csv'
const downloadFile = ({ data, fileName, fileType }) => {
    // Create a blob with the data we want to download as a file
    const blob = new Blob([data], { type: fileType })
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement('a')
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
  }
  
export default function exportCSV (e, data, feilds, filename) {
    e.preventDefault()
    const parser = new Parser({ fields: feilds })
    const csv = parser.parse(data)
    downloadFile({
        data: csv,
        fileName: filename,
        fileType: 'text/csv'
    })
}
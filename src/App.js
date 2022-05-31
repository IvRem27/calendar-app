import './App.css'
import MonthPicker from './MonthPicker'
import ReactModal from 'react-modal'

ReactModal.setAppElement('#root')

function App() {
  return (
    <div id="container">
      <MonthPicker></MonthPicker>
    </div>
  )
}

export default App

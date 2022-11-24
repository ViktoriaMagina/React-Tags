import React from 'react'
import Select from './Select/Select'
import { SelectOptions } from './Select/Select'
import './App.css'
import options from './data/options.json'
function App() {
const [value, setValue] = React.useState<SelectOptions | undefined>(options[0])
const [value1, setValue1] = React.useState<SelectOptions[]>([options[0]])
  return (
    <div className="App">
      <div className="AppInner">
      <Select value={value} options={options} onChange={(o) => setValue(o)}/>
      <Select multiple={true} value={value1} options={options} onChange={(o) => setValue1(o)}/>
      </div>
    </div>
  )
}

export default App

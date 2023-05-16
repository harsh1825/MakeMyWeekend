import Main from ".";
import React,{useState} from 'react';
import ReactDOM from 'react-dom/client';
import { NoteContext } from "./context/notecontext";
import NoteState from "./context/notecontext";
import { BrowserRouter, Router} from "react-router-dom";
import { StyledEngineProvider } from '@mui/material/styles';



function App() {
  const [ uName, setuName] = useState('');


  return (
    <div>
      
      <NoteContext.Provider value={{uName, setuName}}>
        <Main />
      </NoteContext.Provider>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div>
    <App />

  </div>
);

export default App;


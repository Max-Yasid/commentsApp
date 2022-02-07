import './App.css';
import ContextProvider from './contextAPI/context';
import Main from './pages/main';

function App() {
  return <ContextProvider>
    <div className="App">
      <Main />
    </div>
  </ContextProvider>;
}

export default App;

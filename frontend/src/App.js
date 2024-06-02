import "./App.css";
import Header from "./components/Header/Header";
import UserParameters from "./components/UserParameters/UserParameters";
import DishesList from "./components/DishesList/DishesList";

function App() {
  return (
    <div className="app">
      <Header />
      <div className="gridBox">
        <UserParameters />
        <DishesList />
      </div>
    </div>
  );
}

export default App;

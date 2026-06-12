import { useState } from "react";

function App(): React.JSX.Element {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <h1>World Cup</h1>
      <div className="card">
        <button
          onClick={() => {
            setCount((prev) => prev + 1);
          }}
        >
          count is {count}
        </button>
      </div>
    </div>
  );
}

export default App;

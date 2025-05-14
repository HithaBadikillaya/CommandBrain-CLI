import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState('');
  const [executionTime, setExecutionTime] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/execute', { command });

      setOutput(response.data.output);
      setExecutionTime(response.data.executionTime);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setExecutionTime('');
    }
  };

  return (
    <div className="App">
      <h1>Command Brain</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={command} 
          onChange={(e) => setCommand(e.target.value)} 
          placeholder="Enter command" 
        />
        <button type="submit">Run Command</button>
      </form>

      <div>
        <h2>Command Output:</h2>
        <pre>{output}</pre>
        <h3>Execution Time: {executionTime}</h3>
      </div>
    </div>
  );
}

export default App;

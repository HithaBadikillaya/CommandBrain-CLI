const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Basic route to check if backend is running
app.get('/', (req, res) => {
  res.send('Command Brain backend is running.');
});

// New route to handle command execution
app.post('/execute', (req, res) => {
  const { command } = req.body;

  // Ensure command exists
  if (!command) {
    return res.status(400).json({ error: 'Command is required' });
  }

  // Start time tracking
  const startTime = Date.now();

  // Execute the command using exec
  exec(command, (error, stdout, stderr) => {
    // End time tracking
    const endTime = Date.now();
    const executionTime = endTime - startTime;  // Time in milliseconds

    if (error) {
      return res.status(500).json({ error: error.message, executionTime });
    }
    if (stderr) {
      return res.status(500).json({ error: stderr, executionTime });
    }

    // Send response with command output and execution time
    res.json({
      output: stdout,
      executionTime: `${executionTime} ms`
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

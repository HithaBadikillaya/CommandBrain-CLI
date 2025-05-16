import React, { useState } from "react";

const CommandBrain = () => {
  const [directory, setDirectory] = useState("D:\\SCEM\\projects\\");
  const [command, setCommand] = useState("dir");
  const [output, setOutput] = useState("");
  const [time, setTime] = useState(0);

  const handleRunCommand = async () => {
    try {
      const start = performance.now();

      const response = await fetch("http://localhost:5000/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ directory, command }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      const end = performance.now();

      setOutput(data.output || "No output");
      setTime(Math.round(end - start));
    } catch (error) {
      setOutput("Error: " + error.message);
      setTime(0);
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron&display=swap"
        rel="stylesheet"
      />
      <div
        style={{
          height: "100vh",
          width: "100vw",
          backgroundColor: "#000",
          color: "#eee",
          fontFamily: "'Orbitron', sans-serif",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
          boxSizing: "border-box",
          textAlign: "center",
          overflow: "auto",
        }}
      >
        <h1 style={{ fontWeight: "bold", fontSize: "3rem", marginBottom: "1rem" }}>
          Command Brain
        </h1>

        <div style={{ marginBottom: "1rem", width: "100%", maxWidth: 700 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: "600" }}>
            Working Directory:
          </label>
          <input
            type="text"
            value={directory}
            onChange={(e) => setDirectory(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: 4,
              border: "1px solid #444",
              backgroundColor: "#111",
              color: "#eee",
              fontSize: "1rem",
            }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem", width: "100%", maxWidth: 700 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: "600" }}>
            Command:
          </label>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: 4,
              border: "1px solid #444",
              backgroundColor: "#111",
              color: "#eee",
              fontSize: "1rem",
              marginBottom: "0.75rem",
            }}
          />
          <button
            onClick={handleRunCommand}
            style={{
              padding: "0.6rem 1.5rem",
              fontSize: "1rem",
              borderRadius: 4,
              border: "none",
              backgroundColor: "#222",
              color: "#eee",
              cursor: "pointer",
              fontWeight: "600",
              width: "100%",
              maxWidth: 150,
            }}
          >
            Run Command
          </button>
        </div>

        {output && (
          <div
            style={{
              textAlign: "left",
              width: "100%",
              maxWidth: 700,
              backgroundColor: "#111",
              padding: "1rem",
              borderRadius: 6,
              boxShadow: "0 0 15px #222",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              color: "#a0ffa0",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            <p>
              <strong>Directory:</strong> {directory}
            </p>
            <p>
              <strong>Command:</strong> {command}
            </p>
            <p>
              <strong>Output:</strong>
              <br />
              {output}
            </p>
            <p>
              <small>Time: {time} ms</small>
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CommandBrain;

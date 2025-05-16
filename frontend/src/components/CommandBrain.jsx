import React, { useState } from "react";
import CommandBrainDiagram from "./CommandBrainDiagram";

const CommandBrain = () => {
  const [directory, setDirectory] = useState("D:\\SCEM\\projects\\");
  const [command, setCommand] = useState("dir");
  const [output, setOutput] = useState("");
  const [time, setTime] = useState(0);
  const [category, setCategory] = useState(null);

  const handleRunCommand = async () => {
    try {
      const response = await fetch("http://localhost:5000/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ directory, command }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Server error");
      }

      const data = await response.json();

      setOutput(data.output || "No output");
      setTime(parseInt(data.executionTime) || 0);
      setCategory(data.category || null);
    } catch (error) {
      setOutput("Error: " + error.message);
      setTime(0);
      setCategory(null);
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
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: "4rem",
          boxSizing: "border-box",
          overflow: "auto",
          gap: "4rem",
          textAlign: "left",
        }}
      >
        <div style={{ flex: 1, maxWidth: 700 }}>
          <h1
            style={{
              fontWeight: "bold",
              fontSize: "3rem",
              marginBottom: "1rem",
              marginTop: "9rem",
            }}
          >
            Command Brain
          </h1>

          <div style={{ marginBottom: "1rem", width: "100%" }}>
            <label
              style={{ display: "block", marginBottom: 6, fontWeight: "600" }}
            >
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

          <div style={{ marginBottom: "1.5rem", width: "100%" }}>
            <label
              style={{ display: "block", marginBottom: 6, fontWeight: "600" }}
            >
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
                backgroundColor: "#111",
                padding: "1rem",
                borderRadius: 6,
                boxShadow: "0 0 15px #222",
                fontFamily: "monospace",
                color: "#a0ffa0",
                wordWrap: "break-word",
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
              </p>
              <div
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                  backgroundColor: "#000",
                  padding: "0.5rem",
                  border: "1px solid #333",
                  borderRadius: 4,
                  whiteSpace: "pre-wrap",
                }}
              >
                {output}
              </div>
              <p>
                <small>Time: {time} ms</small>
              </p>
            </div>
          )}
        </div>

        <CommandBrainDiagram lastCategory={category} />
      </div>
    </>
  );
};

export default CommandBrain;

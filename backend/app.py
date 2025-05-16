import os
import time
import subprocess
from flask import Flask, request, jsonify
from flask_cors import CORS

class CommandBrainAPI:
    def __init__(self):
        self.app = Flask(__name__)
        CORS(self.app)

        self.app.route('/', methods=['GET'])(self.health_check)
        self.app.route('/execute', methods=['POST'])(self.execute_command)

    def health_check(self):
        return "Command Brain backend is running."

    def execute_command(self):
        data = request.get_json()
        command = data.get("command")
        directory = data.get("directory")

        if not command:
            return jsonify({"error": "Command is required"}), 400

        cwd = directory if directory and os.path.isdir(directory) else None

        start_time = time.time()

        try:
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                cwd=cwd
            )
            output = result.stdout
            error = result.stderr
        except Exception as e:
            return jsonify({"error": str(e)}), 500

        end_time = time.time()
        exec_time_ms = round((end_time - start_time) * 1000)

        if error:
            return jsonify({"error": error, "executionTime": f"{exec_time_ms} ms"}), 500

        if not output.strip():
            output = "✅ Command executed successfully."

        return jsonify({
            "output": output,
            "executionTime": f"{exec_time_ms} ms"
        })

    def run(self):
        self.app.run(host='0.0.0.0', port=5000, debug=True)


if __name__ == "__main__":
    api = CommandBrainAPI()
    api.run()

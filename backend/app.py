import platform
import os
import time
import subprocess
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Commands grouped by category and OS
command_categories = {
    "Windows": {
        "filesystem": ["dir", "cd", "mkdir", "rmdir", "del", "copy", "move", "type", "attrib", "chkdsk"],
        "network": ["ping", "ipconfig", "netstat", "tracert"],
        "system": ["systeminfo", "tasklist", "taskkill", "hostname", "whoami", "shutdown", "wmic", "powershell"],
      "memory": [
    "systeminfo",
    "tasklist",
    "wmic OS get FreePhysicalMemory",
    "wmic OS get TotalVisibleMemorySize",
    "wmic OS get FreePhysicalMemory,TotalVisibleMemorySize",
    "wmic process get name,workingsetsize"
],

        "registry": ["reg", "regedit", "reg query", "reg add", "reg delete"],
        "other": ["echo", "pause", "cls", "set", "title"]
    },
    "Linux": {
        "filesystem": ["ls", "cd", "mkdir", "rmdir", "rm", "cp", "mv", "cat", "chmod", "chown", "df"],
        "network": ["ping", "ifconfig", "netstat", "traceroute", "ip"],
        "system": ["uname", "top", "ps", "whoami", "shutdown", "systemctl", "journalctl"],
        "memory": ["free", "vmstat", "top", "htop"],
        "registry": ["gsettings", "dconf", "gconftool-2"],
        "other": ["echo", "clear", "alias", "export", "set"]
    },
    "Darwin": {
        "filesystem": ["ls", "cd", "mkdir", "rmdir", "rm", "cp", "mv", "cat", "chmod", "chown", "df"],
        "network": ["ping", "ifconfig", "netstat", "traceroute", "ipconfig"],
        "system": ["uname", "top", "ps", "whoami", "shutdown", "systemsetup"],
        "memory": ["vm_stat", "top", "ps"],
        "registry": ["defaults", "plistbuddy"],
        "other": ["echo", "clear", "say", "alias"]
    }
}


def classify_command(os_name, command):
    cmd_word = command.strip().split(" ")[0].lower()
    categories = command_categories.get(os_name, {})
    for category, cmds in categories.items():
        if cmd_word in cmds:
            return category
    return "unknown"

@app.route("/execute", methods=["POST"])
def execute_command():
    data = request.get_json()
    command = data.get("command", "")
    directory = data.get("directory", "")

    if not command:
        return jsonify({"error": "Command is required"}), 400

    current_os = platform.system()  

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
        output = result.stdout.strip()
        error = result.stderr.strip()
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    end_time = time.time()
    exec_time_ms = round((end_time - start_time) * 1000)

    if error:
        return jsonify({"error": error, "executionTime": f"{exec_time_ms} ms"}), 500

    if not output:
        output = "✅ Command executed successfully."

    category = classify_command(current_os, command)

    return jsonify({
        "output": output,
        "executionTime": f"{exec_time_ms} ms",
        "category": category
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)

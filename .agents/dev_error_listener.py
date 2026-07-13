import os
import sys
import json
import asyncio
from http.server import BaseHTTPRequestHandler, HTTPServer
from datetime import datetime

PORT = 8099
LEDGER_PATH = ".agents/ledger.json"

class ErrorHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        if self.path == '/error':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            
            try:
                data = json.loads(body)
            except Exception:
                data = {"raw": body}

            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "received"}).encode('utf-8'))

            # Process failure event asynchronously
            asyncio.run(log_and_reflect_failure(data))
        else:
            self.send_response(404)
            self.end_headers()

async def log_and_reflect_failure(error_data):
    print(f"\n[Dev Error Listener] Intercepted runtime exception: {error_data.get('message', 'Unknown Error')}")
    
    # 1. Read existing ledger
    ledger = []
    if os.path.exists(LEDGER_PATH):
        try:
            with open(LEDGER_PATH, "r") as f:
                ledger = json.load(f)
        except Exception:
            pass

    # 2. Map route/source to direct document if possible
    route = error_data.get("route", "")
    direct_doc = "database_client.md" # default fallback
    
    # Simple route-to-module mapping heuristic
    if "notify" in route:
        direct_doc = "push_notifications.md"
    elif "places" in route:
        direct_doc = "places_location.md"
    elif "settings" in route:
        direct_doc = "admin_controls.md"

    timestamp = datetime.now().isoformat()
    entry = {
        "timestamp": timestamp,
        "prompt": f"Auto-captured client crash on route: {route}",
        "impacts": {
            "direct": [direct_doc],
            "secondary": []
        },
        "pipeline_results": {
            "18_bug_rectifier": {
                "status": "ACTIVE",
                "output": f"Runtime Crash: {error_data.get('message', 'Crash')}\nStack: {error_data.get('stack', '')}"
            }
        }
    }
    
    ledger.append(entry)
    with open(LEDGER_PATH, "w") as f:
        json.dump(ledger, f, indent=2)
    print(" -> Crash successfully logged to ledger.json!")

    # 3. Launch the reflection script to auto-heal/generate rules
    print(" -> Triggering reflection self-healing loop...")
    os.system("python3.11 .agents/reflection.py")

def run():
    server = HTTPServer(('localhost', PORT), ErrorHandler)
    print(f"==================================================")
    print(f"DEV ERROR LISTENER AGENT ACTIVE ON PORT {PORT}")
    print(f"Listening for app/bridge unhandled exceptions...")
    print(f"==================================================")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    print("\nStopping error listener...")

if __name__ == '__main__':
    run()

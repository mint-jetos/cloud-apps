import os
import subprocess
import logging
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)  # Adjust level as needed

def modify_xvfb_sh(new_values):
    """Modifies the xvfb.sh file with new Xvfb settings."""

    with open("/usr/local/bin/xvfb.sh", "r") as f:
        lines = f.readlines()

    with open("/usr/local/bin/xvfb.sh", "w") as f:
        for line in lines:
            if "exec /usr/bin/Xvfb" in line:
                f.write(f"exec /usr/bin/Xvfb :1 -screen 0 {new_values}\n")
            else:
                f.write(line)

    logger.info("xvfb.sh modified with new values: %s", new_values)

def restart_xvfb():
    """Restarts Xvfb using Supervisor."""

    logger.debug("Restarting xvfb")
    print("Restarting xvfb")
    try:
        ### subprocess.run(['supervisorctl', 'restart', 'x:xvfb'], check=True)
        subprocess.run(['supervisorctl', 'restart', 'all'], check=True)
        logger.info("Xvfb restarted successfully")
        print("Xvfb restarted successfully")
    except subprocess.CalledProcessError as e:
        logger.error("Error restarting xvfb: %s", e)
        print("Error restarting xvfb: %s", e)
    except Exception as e:
        logger.exception("Unexpected error during restart: %s", e)
        print("Unexpected error during restart: %s", e)

@app.route('/screen', methods=['GET'])
def set_SCREEN():
    """Sets the SCREEN environment variable and modifies Xvfb settings."""

    print("app.py is executing logic in set_SCREEN()")
    width = request.args.get('width')
    height = request.args.get('height')
    new_SCREEN = f'{width}x{height}x24'

    try:
        modify_xvfb_sh(new_SCREEN)
        restart_xvfb()
        return '', 204
    except Exception as e:
        print(f"Error modifying xvfb.sh or restarting Xvfb: {e}")
        return 'Error updating Xvfb settings', 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6079, debug=True)

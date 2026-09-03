from flask import Flask, jsonify, render_template

from bazaar import api, flips

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/bazaar")
def bazaar():
    try:
        return jsonify({"products": api.get_products()})
    except Exception as e:
        return jsonify({"error": str(e)}), 502


@app.route("/api/flips")
def top_flips():
    try:
        return jsonify({"flips": flips.calculate(api.get_products())})
    except Exception as e:
        return jsonify({"error": str(e)}), 502


@app.route("/api/history/<item_id>")
def history(item_id):
    return jsonify({"error": "noch nicht gebaut"}), 501


if __name__ == "__main__":
    app.run(debug=True, port=5000)

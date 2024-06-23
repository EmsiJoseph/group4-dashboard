import os

from flask import Flask, jsonify, request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# Directory where images will be saved

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "images")
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Allowed extensions
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

@app.route("/upload", methods=["POST"])
def upload_file():
    """
    Handle file upload and save files to the upload directory.

    Returns:
        response: JSON response with the status of the upload.
    """
    if "files" not in request.files:
        return jsonify({"error": "No file part"}), 400

    files = request.files.getlist("files")
    saved_files = []

    for file in files:
        if file and allowed_file(file.filename):
            filename = file.filename
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)
            saved_files.append(filename)

    if not saved_files:
        return jsonify({"error": "No valid files uploaded"}), 400

    return (
        jsonify({"message": "Files uploaded", "files": saved_files}),
        200,
    )


def allowed_file(filename):
    """
    Check if the file has an allowed extension.

    Args:
        filename (str): The name of the file.

    Returns:
        bool: True if the file has an allowed extension, False otherwise.
    """
    file_extension = filename.rsplit(".", 1)[1].lower()
    return "." in filename and file_extension in ALLOWED_EXTENSIONS

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
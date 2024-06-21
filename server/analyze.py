# Module docstring
"""Module for analyzing images and extracting information."""

# Standard library imports
import os
import json
import time
from threading import Thread

# Third-party library imports
from flask import Flask, jsonify
from flask_cors import CORS
from PIL import Image
import google.api_core.exceptions
import google.generativeai as genai
import mysql.connector
from dotenv import load_dotenv
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

app = Flask(__name__)
CORS(app)
load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

db_config = {
    "user": os.getenv("MYSQL_USER"),
    "password": os.getenv("MYSQL_PASSWORD"),
    "host": os.getenv("MYSQL_HOST"),
    "port": os.getenv("MYSQL_PORT"),
    "database": os.getenv("MYSQL_DATABASE"),
}

IMAGE_FOLDER = "./images/"
BATCH_INTERVAL = 5

image_paths = []
current_status = {"stage": "idle", "message": "Waiting for images..."}


def get_db_connection():
    """
    Get a connection to the MySQL database.
    """
    return mysql.connector.connect(**db_config)


def analyze_image(image_path, max_retries=5, backoff_factor=2):
    """
    Analyze an image and extract relevant information.

    Args:
        image_path (str): The path to the image file.

    Returns:
        dict: Extracted information from the image.
    """
    image = Image.open(image_path)
    for attempt in range(1, max_retries + 1):
        try:
            response = model.generate_content(
                [
                    (
                        "You are an assistant that helps to analyze text and"
                        " extract specific information. Analyze the following"
                        " image using a layout-aware approach. Extract the"
                        " personal information and answers to the questions,"
                        " considering the following rules:"
                    ),
                    """
            1. Label Mapping: Match the data to the label on its left. If a
            label is bold, the data  be to its immediate right. Otherwise,
            the data is likely above the label.
            2. Missing Data: If a label has no data or is blank, assign the
            value 'none' to that field. For example, if the 'Street' label is
            blank, the 'street' field should be 'none' in the output JSON.
            3. Address Formatting:
                - Verify address components for spelling
            4. Here are the type of each labels:
                name: string
                gender: string (can be M or F, Male or Female)
                but make the
                format to Male or Female
                civil_status: string (can be M for Married; Married, Separated)
                but make the format to Married, Widow, Separated or Single
                date_of_birth: date (this should be a valid date) but make the
                format to YYYY-MM-DD
                religion: string (If the religion is in abbreviation, make
                sure to spell it out for example RC is for Roman Catholic)
                occupation: string
                address: Whatever it is that you can see in the image
                and a valid place in the Philippines.
                The province should be accurate
                in the Philippines because we will
                create a dropdown list for the provinces.
                mobile_number: valid mobile number from the Philippines in
                this format 09XXXXXXXXX and dont include special characters.

            5. AnswerExtraction: Extract answers to questions (Yes or No) based
            on the image content.
            Make sure that the format of all the columns except for the answers
            are in sentence case (except for the data that are numbers)
            Make sure also that the name has a format of "Last Name, First
            Name Middle Name". Make sure to map each data to the correct label
            especially the name.


            """,
                    "**Example Structure:**",
                    """
            {
                "name": "Name of the person",
                "gender": "Gender",
                "civil_status": "Civil Status",
                "date_of_birth": "Date of Birth",
                "religion": "Religion",
                "occupation": "Occupation",
                "address": {
                "number": "Number",
                "street": "Street",
                "subdivision_barangay": "Subdivision/Barangay",
                "municipality": "Municipality",
                "province": "Province",
                "zip_code": "ZIP Code"
                },
                "mobile_number": "Mobile Number",
                "answers": {
                "q1": "Yes or No",
                "q2": "Yes or No",
                "q3": "Yes or No",
                "q4": "Yes or No",
                "q5": "Yes or No",
                "q6": "Yes or No",
                "q7": "Yes or No",
                "q8": "Yes or No",
                "q9": "Yes or No",
                "q10": "Yes or No"
                }
            }
            """,
                    "**Image:**\n\n",
                    image,
                ],
                stream=True,
            )
            response.resolve()
            print(f"Generated content: {response.text}")
            return response.text
        except google.api_core.exceptions.ServiceUnavailable as e:
            delay = backoff_factor**attempt
            print(
                "Attempt {}/{}: Model overloaded. "
                "Retrying in {} seconds...".format(attempt, max_retries, delay)
            )
            time.sleep(delay)
            raise e


def store_data_in_db(data):
    """
    Store data in the database.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
    INSERT INTO user_info (
    name, gender, civil_status, date_of_birth, religion, occupation,
    address_number, address_street, address_subdivision_barangay,
    address_municipality, address_province, address_zip_code,
    mobile_number, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10
    ) VALUES (
        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
    )
    """
    for item in data:
        required_keys = [
            "name",
            "gender",
            "civil_status",
            "date_of_birth",
            "religion",
            "occupation",
            "address",
            "mobile_number",
            "answers",
        ]
        for key in required_keys:
            if key not in item:
                item[key] = "none"

        values = (
            item["name"],
            item["gender"],
            item["civil_status"],
            item["date_of_birth"],
            item["religion"],
            item["occupation"],
            item["address"]["number"],
            item["address"]["street"],
            item["address"]["subdivision_barangay"],
            item["address"]["municipality"],
            item["address"]["province"],
            item["address"]["zip_code"],
            item["mobile_number"],
            item["answers"]["q1"],
            item["answers"]["q2"],
            item["answers"]["q3"],
            item["answers"]["q4"],
            item["answers"]["q5"],
            item["answers"]["q6"],
            item["answers"]["q7"],
            item["answers"]["q8"],
            item["answers"]["q9"],
            item["answers"]["q10"],
        )
        print(f"Executing query with values: {values}")
        cursor.execute(query, values)
    conn.commit()
    cursor.close()
    conn.close()


def process_image(image_path):
    """
    Process an image and extract information from it.

    Args:
        image_path (str): The path to the image file.
    """
    global current_status

    current_status = {"stage": "analyzing", "message": "Analyzing images..."}
    analyze_data = analyze_image(image_path)
    time.sleep(5)  # Simulate extracting data
    current_status = {
        "stage": "extracting",
        "message": "Extracting data from images...",
    }
    cleaned_data = analyze_data.replace("```json", "").replace("```", "")
    cleaned_data = cleaned_data.strip()
    parsed_data = json.loads(cleaned_data)
    current_status = {
        "stage": "storing",
        "message": "Storing extracted data to database...",
    }
    store_data_in_db([parsed_data])

    print(f"Processed and removed image: {image_path}")
    current_status = {"stage": "idle", "message": "Waiting for images..."}


class ImageHandler(FileSystemEventHandler):
    """
    Handler for image events.
    """

    def on_created(self, event):
        if not event.is_directory and (
            event.src_path.endswith(".jpg") or event.src_path.endswith(".png")
        ):
            image_paths.append(event.src_path)


def process_images_batch():
    """
    Process a batch of images.
    """
    global image_paths
    if not image_paths:
        return

    print(f"Processing batch of {len(image_paths)} images")
    for image_path in image_paths:
        process_image(image_path)
    image_paths = []


@app.route("/status", methods=["GET"])
def status():
    """
    Endpoint to get the current status of image processing.
    """
    return jsonify(current_status)


def start_observer():
    """
    Start the observer to monitor the image folder for new images.
    """
    observer = Observer()
    event_handler = ImageHandler()
    observer.schedule(event_handler, path=IMAGE_FOLDER, recursive=False)
    observer.start()
    try:
        while True:
            time.sleep(BATCH_INTERVAL)
            process_images_batch()
    except KeyboardInterrupt:
        observer.stop()
    observer.join()


if __name__ == "__main__":
    observer_thread = Thread(target=start_observer)
    observer_thread.start()
    app.run(debug=True, host="0.0.0.0", port=5000)

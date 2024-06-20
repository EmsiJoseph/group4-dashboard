# Module docstring
"""Module for analyzing images and extracting information."""

# Standard libary imports
import os
import glob
import json
import time
from datetime import datetime

# Third-party library imports
from PIL import Image
import google.api_core.exceptions
import google.generativeai as genai
from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

app = Flask(__name__)
CORS(app)

db_config = {
    "user": os.getenv("MYSQL_USER"),
    "password": os.getenv("MYSQL_PASSWORD"),
    "host": os.getenv("MYSQL_HOST"),
    "port": os.getenv("MYSQL_PORT"),
    "database": os.getenv("MYSQL_DATABASE"),
}


def get_db_connection():
    """
    Get a connection to the MySQL database.
    """
    return mysql.connector.connect(**db_config)


@app.route("/api/test-db", methods=["GET"])
def test_db():
    """
    Test the database connection.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT 1")
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    return jsonify(result)


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
                - Verify address components for spelling and consistency within
                the Philippines.
            4. Here are the type of each labels:
                name: string
                gender: string (can be M or F, Male or Female)
                civil_status: string (can be M for Married; Married, Separated)
                date_of_birth: date (this should be a valid date)
                religion: string
                occupation: string
                address: valid address from the Philippines
                mobile_number: valid mobile number from the Philippines

            5. AnswerExtraction: Extract answers to questions (Yes or No) based
            on the image content.
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

        try:
            date_of_birth = None
            if "date_of_birth" in item:
                dob_str = item["date_of_birth"]
                for fmt in ("%m-%d-%Y", "%m/%d/%Y", "%b. %d, %Y", "%m/%d/%Y"):
                    try:
                        date_of_birth = datetime.strptime(dob_str, fmt)
                        date_of_birth.strftime("%Y-%m-%d")
                        break
                    except ValueError:
                        pass
                if not date_of_birth:
                    raise ValueError("Invalid date format")
            else:
                raise ValueError("No date_of_birth found")
        except ValueError:
            date_of_birth = "0000-00-00"

        values = (
            item["name"],
            item["gender"],
            item["civil_status"],
            date_of_birth,
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


image_paths = glob.glob("./images/*.jpg")
analyze_data = [analyze_image(image_path) for image_path in image_paths]
parsed_data = []
for d in analyze_data:
    cleaned_data = d.replace("```json", "").replace("```", "").strip()
    if cleaned_data:
        parsed_data.append(json.loads(cleaned_data))


@app.route("/api/post-data", methods=["POST"])
def post_data():
    """
    Post data to the database.
    """
    store_data_in_db(parsed_data)
    return jsonify({"message": "Data stored successfully"}), 200


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)

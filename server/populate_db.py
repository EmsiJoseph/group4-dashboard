import os
import random
from faker import Faker
import mysql.connector
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure database connection
db_config = {
    "user": os.getenv("MYSQL_USER"),
    "password": os.getenv("MYSQL_ROOT_PASSWORD"),
    "host": os.getenv("MYSQL_HOST"),
    "port": os.getenv("MYSQL_PORT"),
    "database": os.getenv("MYSQL_DATABASE"),
}

# Initialize Faker
fake = Faker("fil_PH")


def generate_philippine_mobile_number():
    """
    Generate a random Philippine mobile number in the format 09XXXXXXXXX.
    """
    prefix = "09"
    number = "".join(random.choices("0123456789", k=9))
    return prefix + number


def get_db_connection():
    """
    Get a connection to the MySQL database.
    """
    return mysql.connector.connect(**db_config)


def generate_random_data():
    """
    Generate a dictionary with random data for the user_info table.
    """
    gender = random.choice(["Male", "Female"])
    civil_status = random.choice(["Single", "Married", "Widow", "Separated"])
    answers = ["Yes", "No"]

    return {
        "name": fake.name(),
        "gender": gender,
        "civil_status": civil_status,
        "date_of_birth": fake.date_of_birth(minimum_age=18, maximum_age=90).strftime(
            "%Y-%m-%d"
        ),
        "religion": random.choice(
            ["Roman Catholic", "Protestant", "Muslim", "Buddhist"]
        ),
        "occupation": fake.job(),
        "address_number": fake.building_number(),
        "address_street": fake.street_name(),
        "address_subdivision_barangay": fake.address(),
        "address_municipality": fake.city(),
        "address_province": fake.province(),
        "address_zip_code": fake.postcode(),
        "mobile_number": generate_philippine_mobile_number(),
        "q1": random.choice(answers),
        "q2": random.choice(answers),
        "q3": random.choice(answers),
        "q4": random.choice(answers),
        "q5": random.choice(answers),
        "q6": random.choice(answers),
        "q7": random.choice(answers),
        "q8": random.choice(answers),
        "q9": random.choice(answers),
        "q10": random.choice(answers),
    }


def insert_data_into_db(data):
    """
    Insert the generated data into the database.
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
        %(name)s, %(gender)s, %(civil_status)s, %(date_of_birth)s, %(religion)s, %(occupation)s,
        %(address_number)s, %(address_street)s, %(address_subdivision_barangay)s,
        %(address_municipality)s, %(address_province)s, %(address_zip_code)s,
        %(mobile_number)s, %(q1)s, %(q2)s, %(q3)s, %(q4)s, %(q5)s, %(q6)s, %(q7)s, %(q8)s, %(q9)s, %(q10)s
    )
    """
    cursor.execute(query, data)
    conn.commit()
    cursor.close()
    conn.close()


if __name__ == "__main__":
    for _ in range(1000):
        data = generate_random_data()
        insert_data_into_db(data)
    print("Inserted 1000 rows of random data into the database.")

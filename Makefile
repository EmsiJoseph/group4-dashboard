# Makefile for managing Python virtual environment

# Variables
VENV_DIR = venv
PYTHON = python3

# Targets
.PHONY: help create_venv activate_venv install_requirements run clean

help:
	@echo "Makefile commands:"
	@echo "  make create_venv          Create the virtual environment"
	@echo "  make activate_venv        Activate the virtual environment"
	@echo "  make install_requirements Install required packages"
	@echo "  make run                  Run the Python application"
	@echo "  make clean                Remove the virtual environment"

create_venv:
	$(PYTHON) -m venv $(VENV_DIR)

activate_venv:
	@echo "Run the following command to activate the virtual environment:"
	@echo "source $(VENV_DIR)/bin/activate # For macOS/Linux"
	@echo "$(VENV_DIR)\Scripts\activate    # For Windows"

install_requirements: create_venv
	$(VENV_DIR)/bin/pip install -r requirements.txt

run: create_venv install_requirements
	$(VENV_DIR)/bin/python init.py

clean:
	rm -rf $(VENV_DIR)

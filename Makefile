.PHONY: help clean dev docs package test

help:
	@echo "This project assumes that an active Python virtualenv is present."
	@echo "The following make targets are available:"
	@echo "  dev        install all deps for dev environment"
	@echo "  clean      remove all old packages"
	@echo "  test       run tests"
	@echo "  deploy     Configure the PyPi config file in CI"
	@echo "  packagejs  Build the React Project"
	@echo "  packagepy  Build the PyPi package"

clean:
	rm -rf dist/*
	rm -rf frontend/corp/build/*
	rm -rf frontend/char/build/*

dev:
	pip install --upgrade pip
	pip install wheel
	pip install tox
	pip install -e .

test:
	tox

deploy:
	pip install twine
	echo "[pypi]" > ~/.pypirc
	echo "username=__token__" >> ~/.pypirc
	echo "password=${pypi-api-token}" >> ~/.pypirc
	cut -c-20 ~/.pypirc

buildjs:
	cd frontend/corp;yarn install;yarn build
	cd frontend/char;yarn install;yarn build

package:
	cd frontend/corp;yarn install;yarn build
	cd frontend/char;yarn install;yarn build
	python setup.py sdist

devcorp:
	cd frontend/corp;yarn install;yarn start

devchar:
	cd frontend/char;yarn install;yarn start

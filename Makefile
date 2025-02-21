.PHONY: help clean dev docs package test

help:
	@echo "This project assumes that an active Python virtualenv is present."
	@echo "The following make targets are available:"
	@echo "  dev        install all deps for dev environment"
	@echo "  clean      remove all old packages"
	@echo "  test       run tests"
	@echo "  buildjs    Build all JS projects"
	@echo "  deploy     Configure the PyPi config file in CI"
	@echo "  package    Build the Project"
	@echo "  transkate  Build/update the translation files"

clean:
	rm -rf dist/*
	rm -rf frontend/build/*

dev:
	pip install --upgrade pip
	pip install wheel -U
	pip install tox -U
	pip install -e .

test:
	tox

deploy:
	pip install twine
	twine upload dist/*

buildjs:
	cd frontend/corp;yarn install;yarn build
	cd frontend/frontend/;yarn install;yarn build

package:
	pip install -U hatch
	cd frontend/corp;yarn install;yarn build
	cd frontend/frontend/;yarn install;yarn build
	rm -rf corptools/static/i18n
	cp -r frontend/frontend/i18n corptools/static/i18n
	hatch build

translate:
	django-admin makemessages -l en
	cd frontend/frontend/;yarn buildTranslations

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
	@echo "  devchar    Run the React Character Dev server"
	@echo "  devcorp    Run the React Corporation Dev server"

clean:
	rm -rf dist/*
	rm -rf frontend/corp/build/*
	rm -rf frontend/char/build/*

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
	cd frontend/corp;find 'build/' -name '*.js' -exec sed -i -e 's/\/\/# sourceMappingURL=/\/\/# sourceMappingURL=\/static\/corptools\/corp\/static\/js\//g' {} \;
	cd frontend/char;yarn install;yarn build
	cd frontend/char;find 'build/' -name '*.js' -exec sed -i -e 's/\/\/# sourceMappingURL=/\/\/# sourceMappingURL=\/static\/corptools\/char\/static\/js\//g' {} \;

package:
	cd frontend/corp;yarn install;yarn build
	cd frontend/corp;find 'build/' -name '*.js' -exec sed -i -e 's/\/\/# sourceMappingURL=/\/\/# sourceMappingURL=\/static\/corptools\/corp\/static\/js\//g' {} \;
	cd frontend/char;yarn install;yarn build
	cd frontend/char;find 'build/' -name '*.js' -exec sed -i -e 's/\/\/# sourceMappingURL=/\/\/# sourceMappingURL=\/static\/corptools\/char\/static\/js\//g' {} \;
	python setup.py sdist

devcorp:
	cd frontend/corp;yarn install;yarn start

devchar:
	cd frontend/char;yarn install;yarn start

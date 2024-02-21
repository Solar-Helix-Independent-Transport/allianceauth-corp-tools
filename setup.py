import os

from setuptools import find_packages, setup

from corptools import __version__

install_requires = [
    'allianceauth>=2.9.0',
    'django-esi>=2.0.0',
    'django-model-utils',
    'networkx',
    'django-ninja>=1.0.1,<2.0.0',
]
with open(os.path.join(os.path.dirname(__file__), 'README.md')) as readme:
    README = readme.read()
os.chdir(os.path.normpath(os.path.join(os.path.abspath(__file__), os.pardir)))

setup(
    name='allianceauth-corptools',
    version=__version__,
    packages=find_packages(),
    include_package_data=True,
    install_requires=install_requires,
    license='MIT License (MIT)',
    description='Alliance Auth Plugin',
    long_description=README,
    long_description_content_type="text/markdown",
    url='https://github.com/pvyParts/allianceauth-corp-tools',
    author='AaronKable',
    author_email='aaronkable@gmail.com',
    classifiers=[
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License (MIT)',
        'Operating System :: OS Independent',
        'Programming Language :: Python :: 3.9',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
    ],
)

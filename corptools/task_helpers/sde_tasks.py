import glob
import logging
import os
import shutil
import zipfile

import httpx

from ..models.eve_models import (
    EveItemCategory, EveItemDogmaAttribute, EveItemGroup, EveItemType,
    InvTypeMaterials, MapConstellation, MapRegion, MapSystem, MapSystemGate,
    MapSystemMoon, MapSystemPlanet,
)

logger = logging.getLogger(__name__)

# What models and the order to load them
SDE_PARTS_TO_UPDATE = [
    # Map
    MapRegion,
    MapConstellation,
    MapSystem,
    # System stuffs
    MapSystemPlanet,
    MapSystemMoon,
    MapSystemGate,
    # Types
    EveItemCategory,
    EveItemGroup,
    EveItemType,
    EveItemDogmaAttribute,
    # Type Materials
    InvTypeMaterials,
]

SDU_URL = "https://developers.eveonline.com/static-data/eve-online-static-data-latest-jsonl.zip"
SDE_FILE_NAME = "eve-online-static-data-latest-jsonl.zip"
SDE_FOLDER = "eve-sde"


def download_file(url, local_filename):
    """
    Downloads a file from a given URL using httpx and saves it locally.

    Args:
        url (str): The URL of the file to download.
        local_filename (str): The path and name to save the downloaded file.
    """
    try:
        with httpx.stream("GET", url, follow_redirects=True) as response:
            response.raise_for_status()  # Raise an exception for HTTP errors (4xx or 5xx)
            with open(local_filename, "wb") as f:
                for chunk in response.iter_bytes():
                    f.write(chunk)
        print(f"File downloaded successfully to: {local_filename}")
    except httpx.HTTPStatusError as e:
        print(f"HTTP error during download: {e}")
    except httpx.RequestError as e:
        print(f"Network error during download: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


def delete_sde_zip():
    os.remove(SDE_FILE_NAME)


def delete_sde_folder():
    shutil.rmtree(SDE_FOLDER)


def download_extract_sde():
    download_file(
        SDU_URL,
        SDE_FILE_NAME
    )
    with zipfile.ZipFile(SDE_FILE_NAME, mode="r") as zf:
        zf.extractall(path=SDE_FOLDER)
    # delete the zip
    delete_sde_zip()


def process_section_of_sde(id: int = 0):
    """
        Update a SDE model.
    """
    SDE_PARTS_TO_UPDATE[id].load_from_sde(SDE_FOLDER)


def process_from_sde(start_from: int = 0):
    """
        Update the SDE models in order.
    """
    download_extract_sde()

    count = 0
    for mdl in SDE_PARTS_TO_UPDATE:
        if count >= start_from:
            logger.info(f"Starting {mdl}")
            process_section_of_sde(count)
        else:
            logger.info(f"Skipping {mdl}")
        count += 1

    delete_sde_folder()

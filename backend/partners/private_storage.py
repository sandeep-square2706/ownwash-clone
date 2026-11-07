from pathlib import Path
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.utils.deconstruct import deconstructible

PRIVATE_ROOT = Path(getattr(settings, "PRIVATE_MEDIA_ROOT", settings.BASE_DIR / "private_media"))


@deconstructible
class PrivateFileSystemStorage(FileSystemStorage):
    def __init__(self):
        super().__init__(location=str(PRIVATE_ROOT), base_url=None)


private_storage = PrivateFileSystemStorage()

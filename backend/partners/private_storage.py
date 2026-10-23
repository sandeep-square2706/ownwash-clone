from pathlib import Path
from django.conf import settings
from django.core.files.storage import FileSystemStorage

PRIVATE_ROOT = Path(getattr(settings, "PRIVATE_MEDIA_ROOT", settings.BASE_DIR / "private_media"))
private_storage = FileSystemStorage(location=str(PRIVATE_ROOT), base_url=None)

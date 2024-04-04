"""Init and utils."""
from zope.i18nmessageid import MessageFactory

import logging


PACKAGE_NAME = "projektarbeit"

_ = MessageFactory("projektarbeit")

logger = logging.getLogger("projektarbeit")

from zope.interface import Interface


class IProjektarbeit(Interface):
    """A utility that allows to manage keywords"""

    def change(old_keywords, new_keyword):
        """Updates all objects using the old_keywords.

        Objects using the old_keywords will be using the new_keywords
        afterwards.
        """

    def delete(keywords):
        """Removes the keywords from all objects using it."""


class IProjektarbeitLayer(Interface):
    """A layer specific for PloneKeywordManager"""

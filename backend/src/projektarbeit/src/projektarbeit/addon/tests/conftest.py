from projektarbeit.testing import INTEGRATION_TESTING
from plone import api
from pytest_plone import fixtures_factory

import pytest
import requests


pytest_plugins = ["pytest_plone"]


globals().update(fixtures_factory(((INTEGRATION_TESTING, "integration"),)))


@pytest.fixture()
def create_example_content():
    def func(language="en"):
        portal = api.portal.get()
        with api.env.adopt_roles(["Admin"]):
            document_one = api.content.create(
                container=portal,
                id="a-folderish",
                type="Document",
                title="A Page in the site",
                description="A simple page in the site",
                language=language,
                subject="Keyword1",
            )

            document_two = api.content.create(
                container=portal,
                id="a-page",
                type="Document",
                title="Another Page in the site",
                description="A simple page in the site",
                language=language,
                subject="Keyword2",
            )

            document_three = api.content.create(
                container=portal,
                id="another-page",
                type="Document",
                title="Yet another Page in the Site",
                description="A simple page in the site",
                language=language,
                subject="Keyword3",
            )

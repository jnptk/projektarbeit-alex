# -*- coding: utf-8 -*-
"""Setup tests for this package."""
from plone import api
from plone.app.testing import setRoles
from plone.app.testing import TEST_USER_ID
from projektarbeit.addon.testing import (  # noqa: E501
    PROJEKTARBEIT_ADDON_INTEGRATION_TESTING,
)

import unittest


try:
    from Products.CMFPlone.utils import get_installer
except ImportError:
    get_installer = None


class TestSetup(unittest.TestCase):
    """Test that projektarbeit.addon is properly installed."""

    layer = PROJEKTARBEIT_ADDON_INTEGRATION_TESTING

    def setUp(self):
        """Custom shared utility setup for tests."""
        self.portal = self.layer['portal']
        if get_installer:
            self.installer = get_installer(self.portal, self.layer['request'])
        else:
            self.installer = api.portal.get_tool('portal_quickinstaller')

    def test_product_installed(self):
        """Test if projektarbeit.addon is installed."""
        self.assertTrue(self.installer.is_product_installed(
            'projektarbeit.addon'))

    def test_browserlayer(self):
        """Test that IProjektarbeitAddonLayer is registered."""
        from plone.browserlayer import utils
        from projektarbeit.addon.interfaces import IProjektarbeitAddonLayer
        self.assertIn(
            IProjektarbeitAddonLayer,
            utils.registered_layers())


class TestUninstall(unittest.TestCase):

    layer = PROJEKTARBEIT_ADDON_INTEGRATION_TESTING

    def setUp(self):
        self.portal = self.layer['portal']
        if get_installer:
            self.installer = get_installer(self.portal, self.layer['request'])
        else:
            self.installer = api.portal.get_tool('portal_quickinstaller')
        roles_before = api.user.get_roles(TEST_USER_ID)
        setRoles(self.portal, TEST_USER_ID, ['Manager'])
        self.installer.uninstall_product('projektarbeit.addon')
        setRoles(self.portal, TEST_USER_ID, roles_before)

    def test_product_uninstalled(self):
        """Test if projektarbeit.addon is cleanly uninstalled."""
        self.assertFalse(self.installer.is_product_installed(
            'projektarbeit.addon'))

    def test_browserlayer_removed(self):
        """Test that IProjektarbeitAddonLayer is removed."""
        from plone.browserlayer import utils
        from projektarbeit.addon.interfaces import IProjektarbeitAddonLayer
        self.assertNotIn(IProjektarbeitAddonLayer, utils.registered_layers())

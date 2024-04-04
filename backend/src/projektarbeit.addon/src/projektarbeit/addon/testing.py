# -*- coding: utf-8 -*-
from plone.app.robotframework.testing import REMOTE_LIBRARY_BUNDLE_FIXTURE
from plone.app.testing import applyProfile
from plone.app.testing import FunctionalTesting
from plone.app.testing import IntegrationTesting
from plone.app.testing import PLONE_FIXTURE
from plone.app.testing import PloneSandboxLayer
from plone.testing import z2

import projektarbeit.addon


class ProjektarbeitAddonLayer(PloneSandboxLayer):

    defaultBases = (PLONE_FIXTURE,)

    def setUpZope(self, app, configurationContext):
        # Load any other ZCML that is required for your tests.
        # The z3c.autoinclude feature is disabled in the Plone fixture base
        # layer.
        import plone.app.dexterity
        self.loadZCML(package=plone.app.dexterity)
        import plone.restapi
        self.loadZCML(package=plone.restapi)
        self.loadZCML(package=projektarbeit.addon)

    def setUpPloneSite(self, portal):
        applyProfile(portal, 'projektarbeit.addon:default')


PROJEKTARBEIT_ADDON_FIXTURE = ProjektarbeitAddonLayer()


PROJEKTARBEIT_ADDON_INTEGRATION_TESTING = IntegrationTesting(
    bases=(PROJEKTARBEIT_ADDON_FIXTURE,),
    name='ProjektarbeitAddonLayer:IntegrationTesting',
)


PROJEKTARBEIT_ADDON_FUNCTIONAL_TESTING = FunctionalTesting(
    bases=(PROJEKTARBEIT_ADDON_FIXTURE,),
    name='ProjektarbeitAddonLayer:FunctionalTesting',
)


PROJEKTARBEIT_ADDON_ACCEPTANCE_TESTING = FunctionalTesting(
    bases=(
        PROJEKTARBEIT_ADDON_FIXTURE,
        REMOTE_LIBRARY_BUNDLE_FIXTURE,
        z2.ZSERVER_FIXTURE,
    ),
    name='ProjektarbeitAddonLayer:AcceptanceTesting',
)

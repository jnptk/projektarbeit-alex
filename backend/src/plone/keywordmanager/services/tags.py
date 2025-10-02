from Acquisition import aq_base
from plone import api
from plone.app.discussion.interfaces import IComment
from plone.dexterity.interfaces import IDexterityContent
from plone.restapi.services import Service
from plone.keywordmanager import utils
from plone.keywordmanager.content.keyword_manager import IKeywordManager
from zope.interface import implementer
from zope.component import getUtility
from ZTUtils import make_query

import json


@implementer(IKeywordManager)
class Tags(Service):
    def _getFullIndexList(self, indexName):
        idxs = {indexName}.union(utils.ALWAYS_REINDEX)
        return list(idxs)

    def reply(self):
        request = self.request
        if request.method == "GET":
            return self.get_keywords()
        elif request.method == "PATCH":
            return self.patch_keywords()
        elif request.method == "DELETE":
            return self.delete_keywords()

    def get_keywords(self):
        request_body = self.request.form
        if request_body.get("keyword") != "":
            keyword = request_body.get("keyword")
            keywords = self.getAllKeywords()

            for keyworddict in keywords:
                keyworddict["Levenshtein"] = self.levenshtein(
                    keyworddict["Keywordname"], keyword
                )
            return {"items": keywords}

        return {"items": self.getAllKeywords()}

    def getAllKeywords(self):
        catalog = api.portal.get_tool("portal_catalog")
        keywords = [
            {"Keywordname": x}
            for x in catalog.uniqueValuesFor("Subject")
            if x is not None
        ]

        return keywords

    def patch_keywords(self):
        indexName = "Subject"
        context = None

        request_body = json.loads(self.request.get("BODY"))

        old_keywords = request_body.get("keywords")

        new_keyword = request_body.get("changeto")
        changedItems = 0

        for old_keyword in old_keywords:
            query = {indexName: old_keyword}
            if context is not None:
                query["path"] = "/".join(context.getPhysicalPath())

            try:
                querySet = api.content.find(**query)
            except UnicodeDecodeError:
                old_keyword = [
                    k.decode("utf8") if isinstance(k, str) else k for k in old_keyword
                ]
                query["Subject"] = old_keyword
                querySet = api.content.find(**query)

            for item in querySet:
                obj = item.getObject()
                # #MOD Dynamic field getting

                value = self.getFieldValue(obj, indexName)

                if isinstance(value, (list, tuple)):
                    # MULTIVALUED FIELD
                    value = set(value)
                    value.remove(old_keyword)
                    value.add(new_keyword)
                    value = list(value)
                elif isinstance(value, set):
                    value.remove(old_keyword)
                    value.add(new_keyword)
                else:
                    # MONOVALUED FIELD
                    value = new_keyword
                self.updateObject(obj, indexName, value, old_keyword)

                changedItems += len(querySet)
        items = self.getAllKeywords()

        resp_obj = {
            "items": items,
            "changedItems": changedItems,
        }

        return resp_obj

    def delete_keywords(self):
        """Removes the keywords from all objects using it.

        Returns the number of objects that have been updated and a Error message if there were no corresponding Tags.
        """
        request_body = json.loads(self.request.get("BODY"))

        keywords = request_body.get("keywords")

        context = None
        indexName = "Subject"
        changedItems = 0

        for keyword in keywords:
            query = {indexName: keyword}
            if context is not None:
                query["path"] = "/".join(context.getPhysicalPath())

            try:
                querySet = api.content.find(**query)
            except UnicodeDecodeError:
                old_keyword = [
                    k.decode("utf8") if isinstance(k, str) else k for k in old_keyword
                ]
                query["Subject"] = old_keyword
                querySet = api.content.find(**query)

            for item in querySet:
                obj = item.getObject()
                value = self.getFieldValue(obj, indexName)
                if isinstance(value, (list, tuple)):
                    # MULTIVALUED
                    value = set(value)
                    value.remove(keyword)
                    value = list(value)
                elif type(value) is set:
                    value.remove(keyword)
                else:
                    # MONOVALUED
                    value = None

                self.updateObject(obj, indexName, value, keyword)
                changedItems += len(querySet)
        items = self.getAllKeywords()
        resp_obj = {
            "items": items,
            "changedItems": changedItems,
        }

        return resp_obj

    def levenshtein(self, s1, s2):
        m, n = len(s1), len(s2)

        # Create a matrix to store the distances
        dp = [[0] * (n + 1) for _ in range(m + 1)]

        # Initialize the first row and column
        for i in range(m + 1):
            dp[i][0] = i
        for j in range(n + 1):
            dp[0][j] = j

        # Compute the distances
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                cost = 0 if s1[i - 1] == s2[j - 1] else 1
                dp[i][j] = min(
                    dp[i - 1][j] + 1,  # deletion
                    dp[i][j - 1] + 1,  # insertion
                    dp[i - 1][j - 1] + cost,
                )  # substitution

        return dp[m][n]

    def get_keyword_indexes(self):
        pkm = getUtility(IProjektarbeitAddon)
        return pkm.getKeywordIndexes()

    def return_message(self, message, msg_type):
        api.portal.show_message(message, request=self.request, type=msg_type)
        navroot_url = api.portal.get_navigation_root(self.context).absolute_url()
        url = f"{navroot_url}/tags"

        query = {
            "field": self.request.get("field", ""),
            "s": self.request.get("s", ""),
            "b_start": self.request.get("b_start", ""),
        }

        return self.request.RESPONSE.redirect(f"{url}?{make_query(**query)}")

    def fieldNameForIndex(self, indexName):
        """The name of the index may not be the same as the field on the object, and we need
        the actual field name in order to find its mutator.
        """
        catalog = api.portal.get_tool("portal_catalog")
        indexObjs = [idx for idx in catalog.index_objects() if idx.getId() == indexName]
        try:
            fieldName = indexObjs[0].indexed_attrs[0]
        except IndexError:
            raise ValueError(f"Found no index named {indexName}")

        return fieldName

    def getFieldValue(self, obj, indexName):
        fieldName = self.fieldNameForIndex(indexName)
        fieldVal = getattr(obj, fieldName, ())
        if not fieldVal and fieldName.startswith("get"):
            fieldName = fieldName.lstrip("get_")
            fieldName = fieldName[0].lower() + fieldName[1:]
            fieldVal = getattr(obj, fieldName, ())

        if callable(fieldVal):
            return fieldVal()
        else:
            return fieldVal

    def updateObject(self, obj, indexName, value, newKeyword):
        updateField = self.getSetter(obj, indexName)
        if updateField is not None:
            updateField(value)
            idxs = self._getFullIndexList(indexName)
            obj.reindexObject(idxs=idxs)
            if newKeyword:
                catalog = api.portal.get_tool("portal_catalog")
                catalog(Subject=newKeyword)

    def getSetter(self, obj, indexName):
        """Gets the setter function for the field based on the index name.

        Returns None if it can't get the function
        """

        # DefaultDublinCoreImpl:
        setterName = "set" + indexName
        if getattr(aq_base(obj), setterName, None) is not None:
            return getattr(obj, setterName)

        # other
        fieldName = self.fieldNameForIndex(indexName)
        field = None

        # Dexterity
        if IDexterityContent.providedBy(obj):
            if fieldName.startswith("get"):
                fieldName = fieldName.lstrip("get_")
            # heuristics
            fieldName = fieldName[0].lower() + fieldName[1:]
            return lambda value: setattr(aq_base(obj), fieldName, value)

        # Always reindex discussion objects, since their values
        # # will have been acquired
        if IComment.providedBy(obj):
            return lambda value: None

        # Anything left is maybe AT content
        field = getattr(aq_base(obj), "getField", None)
        # Archetypes:
        if field:
            fieldObj = field(fieldName) or field(fieldName.lower())
            if not fieldObj and fieldName.startswith("get"):
                fieldName = fieldName.lstrip("get_")
                fieldName = fieldName[0].lower() + fieldName[1:]
                fieldObj = obj.getField(fieldName)
            if fieldObj is not None:
                return fieldObj.getMutator(obj)
            return None

        return None

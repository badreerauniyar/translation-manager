/****

Copyright (c) Robert Bosch Engineering And Business Solutions Pvt Ltd
All Rights Reserved. *
This file may not be distributed without the file ’license.txt’.
This file is subject to the terms and conditions defined in file
’license.txt’, which is part of this source code package.
***/

import axios from "axios";

import config from "../configs/config.project";
import interceptors from "./interceptors";

// Axios instance with base url
export const TmsAPI = axios.create({
  baseURL: `${config.tmsServer.getServerURL()}/`,
});

export const TmsExtractAPI = axios.create({
  baseURL: `${config.tmsServer.getServerURL()}/`,
  responseType: "blob",
});

export const TmsExtractAPI_Direct = axios.create({
  baseURL: `${config.tmsServer.getDirectServerURL()}/`,
  responseType: "blob",
});

export const TMS_API_DIRECT = axios.create({
  baseURL: `${config.tmsServer.getDirectServerURL()}/`,
});

// Common Interceptors for different API instances
interceptors(TmsAPI, "tms");
interceptors(TmsExtractAPI, "tms");
interceptors(TMS_API_DIRECT, "tms");
interceptors(TmsExtractAPI_Direct, "tms");

// ----------------------------------------Report Screen----------------------------------------
export const getOverallTranslationStatus = (page, size, versionId, payload) =>
  TmsAPI.post(
    `api/tms/reports/getOverallTranslationStatus/${page}/${size}/${versionId}`,
    payload
  );

export const getPendingStatus = (versionId) =>
  TmsAPI.get(`api/tms/reports/getPendingStatus/${versionId}`);

export const getCostEstimate = (payload) =>
  TmsAPI.post("api/tms/reports/getCostEstimate", payload);

export const getVersionBasedTranslationCount = (payload) =>
  TmsAPI.post("api/tms/reports/getVersionBasedTranslationCount", payload);

// ----------------------------------------Project Screens----------------------------------------

export const addMasterScreenToProject = (payload) =>
  TmsAPI.post("api/tms/screens/addMasterScreenToProjectVariant", payload);

export const getScreensByVersionId = (versionId) =>
  TmsAPI.get("api/tms/screens/getScreenListByVersionId/" + versionId);

export const downloadTextClipReport = (payload) =>
  TmsAPI.post("api/tms/excel/downloadTextClipReport/", payload);


export const getReferenceScreensByVersionId = (versionId) =>
  TmsAPI.get("api/tms/screens/getReferenceScreensByVersionId/" + versionId);

export const getScreensByVersionIdPagination = (page, size, versionId) =>
  TmsAPI.get(
    `api/tms/screens/getScreensByVersionId/${page}/${size}/${versionId}`
  );

export const getScreensByVersionIdSearch = (page, size, versionId, query) =>
  TmsAPI.get(
    `api/tms/screens/searchScreensByVersionId/${page}/${size}/${versionId}/${query}`
  );

export const addScreenToProject = (payload) =>
  TmsAPI.post("api/tms/screens/addScreenToProjectVersion", payload);

export const getUserInfoByProjectUserIds = (payload) =>
  TmsAPI.post("api/tms/screens/getUserInfoByProjectUserIds", payload);

export const assignUsersToScreen = (payload) =>
  TmsAPI.put("api/tms/screens/assignUsersToScreen", payload);

export const modifyUsersOfScreen = (payload) =>
  TmsAPI.put("api/tms/screens/modifyUsersOfScreen", payload);

export const getScreenById = (screenId) =>
  TmsAPI.get("api/tms/screens/getScreenById/" + screenId);

export const deleteScreenById = (screenId, versionId) =>
  TmsAPI.delete(`api/tms/screens/deleteScreenById/${screenId}/${versionId}`);

export const deleteScreensByProjectId = (projectId) =>
  TmsAPI.delete("api/tms/screens/deleteScreensByProjectId/" + projectId);

export const getDashboardDataByScreenId = (versionId, screenId, payload) =>
  TMS_API_DIRECT.post(
    `api/tms/screens/getDashboardDataByScreenId/${versionId}/${screenId}`,
    payload
  );
// ----------------------------------------Master Text----------------------------------------

export const getMasterTextsByScreenId = (
  page,
  size,
  versionId,
  screenId,
  sorter,
  payload
) => {
  const tmpURL =
    sorter?.field && sorter?.order
      ? `api/tms/master/getMasterTextsByScreenId/${page}/${size}/${versionId}/${screenId}?sorterField=${sorter.field}&sorterOrder=${sorter.order}`
      : `api/tms/master/getMasterTextsByScreenId/${page}/${size}/${versionId}/${screenId}`;
  return TMS_API_DIRECT.post(tmpURL, payload);
};

export const getAllMasterTextsByScreenId = (versionId, screenId) =>
  TmsAPI.get(
    `api/tms/master/getAllMasterTextsByScreenId/${versionId}/${screenId}`
  );

export const validateAllStrings = (payload) =>
  TMS_API_DIRECT.post("api/tms/master/validateAllStrings", payload);

export const getTMSActivityLogApi = (masterStringId) =>
  TmsAPI.get(`api/tms/master/getTMSActivityLog/${masterStringId}`);

export const updateNeedsTranslation = (payload) =>
  TmsAPI.post("api/tms/master/updateNeedsTranslation", payload);

export const updateIsReference = (payload) =>
  TmsAPI.post("api/tms/screens/updateIsReference", payload);

export const searchMasterTextsByScreenId = (
  page,
  size,
  versionId,
  screenId,
  query
) =>
  TmsAPI.post(
    `api/tms/master/searchMasterTextsByScreenId/${page}/${size}/${versionId}/${screenId}`,
    query
  );

export const getMasterStringAndLayoutByMasterStringId = (
  screenId,
  masterStringId,
  payload
) =>
  TmsAPI.post(
    "api/tms/master/getMasterStringAndLayoutByMasterStringId/" +
    screenId +
    "/" +
    masterStringId,
    payload
  );

export const addMasterTextAndLayout = (payload) =>
  TmsAPI.post("api/tms/master/addMasterTextAndLayout/", payload);

export const validateMasterTextsByStringId = (payload) =>
  TmsAPI.put("api/tms/master/validateMasterTextsByStringId", payload);

export const updateMasterString = (payload) =>
  TmsAPI.put("api/tms/master/updateMasterString", payload);

export const updateConfigStringId = (payload) =>
  TmsAPI.put("api/tms/master/updateConfigStringId", payload);

export const getMasterTextsByProjectId = (projectId) =>
  TmsAPI.get("api/tms/master/getMasterTextsByProjectId/" + projectId);

// Master text Comments
export const addCommentsMaster = (payload) =>
  TmsAPI.post("api/tms/master/comments/addCommentsForMaster", payload);

export const getCommentsByStringIdMaster = (stringId, versionId, screenId) =>
  TmsAPI.get(
    `api/tms/master/comments/getCommentsByMasterStringId/${versionId}/${screenId}/${stringId}`
  );

// Approval Status
export const updateApprovalStatusMaster = (payload) =>
  TmsAPI.put("api/tms/master/updateApprovalStatusByMasterStringId", payload);

export const submitStringForClarificationMaster = (payload) =>
  TmsAPI.put("api/tms/master/submitMasterStringForClarification", payload);

export const submitStringForReviewMaster = (payload) =>
  TmsAPI.put("api/tms/master/submitMasterStringForReview", payload);

// ----------------------------------------Context-------------------------------------------------

export const getAllContextsByMasterTextId = (stringId) =>
  TmsAPI.get(`api/tms/contexts/getAllContextsByMasterTextId/${stringId}`);

export const getAllContextsForTranslation = (
  masterStringId,
  layoutId,
  versionId
) =>
  TmsAPI.get(
    `api/tms/contexts/getAllContextsForTranslation/${masterStringId}/${layoutId}/${versionId}`
  );

export const addContextValue = (payload) =>
  TmsAPI.post("api/tms/contexts/addContextValue", payload);

// ----------------------------------------Translation Text----------------------------------------

export const getTranslationTextsByScreenId = (
  page,
  size,
  screenId,
  referenceScreenId,
  versionId,
  languageId,
  referenceLanguageId,
  approvalStatus,
  lengthCheck,
  sorter,
  payload
) => {
  const tmpURL =
    sorter?.field && sorter?.order
      ? `api/tms/translation/getTranslationTextsByScreenId/${page}/${size}/${versionId}/${languageId}/${referenceLanguageId}/${screenId}/${referenceScreenId}/${approvalStatus}/${lengthCheck}?sorterField=${sorter.field}&sorterOrder=${sorter.order}`
      : `api/tms/translation/getTranslationTextsByScreenId/${page}/${size}/${versionId}/${languageId}/${referenceLanguageId}/${screenId}/${referenceScreenId}/${approvalStatus}/${lengthCheck}`;
  return TmsAPI.post(tmpURL, payload);
};

export const getAllTranslationTextsByScreenId = (
  screenId,
  versionId,
  languageId
) =>
  TmsAPI.get(
    `api/tms/translation/getAllTranslationTextsByScreenId/${versionId}/${languageId}/${screenId}`
  );

export const searchTranslationTextsByScreenId = (
  page,
  size,
  screenId,
  versionId,
  languageId,
  referenceLanguageId,
  query,
  referenceScreenId
) =>
  TmsAPI.get(
    `api/tms/translation/searchTranslationTextsByScreenId/${page}/${size}/${versionId}/${languageId}/${referenceLanguageId}/${screenId}/${referenceScreenId}/${query}`
  );

export const getTranslationTextsActivityLog = (
  masterStringId,
  translationStringId
) =>
  TmsAPI.get(
    `api/tms/translation/getTranslationTextsActivityLog/${masterStringId}`
  );

export const updateTranslationOption = (payload) =>
  TMS_API_DIRECT.put("api/tms/translation/updateTranslationOption/", payload);

export const translateTextFromAWS = (payload) =>
  TmsAPI.put("api/tms/translation/translateTextFromAWS", payload);

export const addTranslationOption = (payload) =>
  TmsAPI.post("api/tms/translation/addTranslationOption/", payload);

export const deleteTranslationByOptionsId = (
  versionId,
  masterStringId,
  translationStringId,
  optionsId,
  userId
) =>
  TmsAPI.delete(
    `api/tms/translation/deleteTranslationByOptionsId/${versionId}/${masterStringId}/${translationStringId}/${optionsId}/${userId}`
  );

export const getTranslationTextByTranslationId = (
  translationStringId,
  masterStringId,
  payload
) =>
  TmsAPI.post(
    "api/tms/translation/getTranslationTextByTranslationId/" +
    translationStringId +
    "/" +
    masterStringId,
    payload
  );

export const validateTranslationOptionByStringId = (payload) =>
  TmsAPI.put(
    "api/tms/translation/validateTranslationOptionByStringId",
    payload
  );

export const loadTranslationsFromTranslationMemory = (payload) =>
  TMS_API_DIRECT.post(
    "api/tms/translation/loadTranslationsFromTranslationMemory",
    payload
  );

// Comments
export const addCommentsTranslation = (payload) =>
  TmsAPI.post(
    "api/tms/translation/comments/addCommentsForTranslation",
    payload
  );

export const getCommentsByStringIdTranslation = (
  stringId,
  versionId,
  languageId
) =>
  TmsAPI.get(
    `api/tms/translation/comments/getCommentsByTranslationStringId/${versionId}/${languageId}/${stringId}`
  );

// Approval Status
export const updateApprovalStatusTranslation = (payload) =>
  TmsAPI.put(
    "api/tms/translation/updateApprovalStatusByTranslationStringId",
    payload
  );

export const submitStringForClarificationTranslation = (payload) =>
  TmsAPI.put(
    "api/tms/translation/submitTranslationStringForClarification",
    payload
  );

export const submitStringForReviewTranslation = (payload) =>
  TmsAPI.put("api/tms/translation/submitTranslationStringForReview", payload);

export const updateApprovedTranslationOption = (payload) =>
  TmsAPI.put("api/tms/translation/updateApprovedTranslationOption", payload);

// Lock and Unlock
export const lockOrUnlockUser = (payload) =>
  TmsAPI.put("api/tms/translation/lockOrUnlockUser", payload);

export const lockOrUnlockUserByUserId = (payload) =>
  TmsAPI.put("api/tms/translation/lockOrUnlockUserByUserId", payload);

export const uploadFile = (userId, id, versionID, payload) =>
  TmsAPI.post("api/tms/excel/uploadFile/" + userId + "/" + id + "/" + versionID, payload);

export const uploadXML = (payload) =>
  TmsAPI.post("api/tms/excel/uploadXML", payload);
// Versions
export const getVersionByIdApi = (versionId) =>
  TmsAPI.get("api/tms/version/getVersionById/" + versionId);

export const getAllVersionsApi = (variantId, branchId) =>
  TmsAPI.get(
    `api/tms/version/getAllVersionsByVariantId/${variantId}/${branchId}`
  );

export const addNewVersion = (payload) =>
  TmsAPI.post("api/tms/version/addNewVersion/", payload);

export const addNewVersionFromConfig = (payload) =>
  TmsAPI.post("api/tms/version/addNewVersionFromConfig/", payload);

export const updateVersionName = (payload) =>
  TmsAPI.put("api/tms/version/updateVersionName/", payload);

/*---------------------Version Difference--------------------------------*/
export const getVersionDiff = (targetScreenId, page, size) =>
  TMS_API_DIRECT.get(
    `api/tms/versionDiff/getAllDifferencesByTargetScreenId/${targetScreenId}/${page}/${size}`
  );

export const getVersionDiffNewlyAdded = (targetScreenId, page, size) =>
  TmsAPI.get(
    `api/tms/versionDiff/getAddedStringsInTargetScreen/${targetScreenId}/${page}/${size}`
  );

export const getScreenListForDiff = (versionId) =>
  TmsAPI.get("api/tms/versionDiff/getScreenListForDiff/" + versionId);

// Variants
export const getVariantByIdApi = (variantId) =>
  TmsAPI.get("api/tms/variant/getVariantById/" + variantId);

export const getVariantTextSettingsApi = (id) =>
  TmsAPI.get("api/tms/variant/getVariantTextSettings/" + id);

export const getExcel = (screenId, referenceScreenId, payload) =>
  TmsAPI.post(
    "/api/tms/excel/getMasterText/" + screenId + "/" + referenceScreenId,
    payload
  );
export const getXliff = (screenId, languageId, referenceScreenId) =>
  TmsAPI.get(
    "/api/tms/excel/getMasterTextXliff/" +
    screenId +
    "/" +
    languageId +
    "/" +
    referenceScreenId
  );
export const getXml = (screenId, referenceScreenId, payload) =>
  TmsAPI.post(
    "/api/tms/excel/getMasterTextXML/" + screenId + "/" + referenceScreenId,
    payload
  );

export const validateAllTranslations = (payload) =>
  TMS_API_DIRECT.post("api/tms/translation/validateAllTranslations", payload);

export const downloadStringXml = (payload) =>
  TmsExtractAPI.post("api/tms/excel/downloadOverallXml", payload);

export const downloadLocaliseStrings = (payload) =>
  TmsExtractAPI.post("api/tms/excel/downloadLocaliseStrings", payload);

export const downloadLayouts = (payload) =>
  TmsExtractAPI_Direct.post("api/tms/excel/downloadLayoutsXml", payload);

export const downloadLayoutsAsExcel = (payload) =>
  TMS_API_DIRECT.post("api/tms/excel/downloadLayoutsExcel", payload);


export const downloadMetaDataApi = (payload) =>
  TMS_API_DIRECT.post("api/tms/excel/downloadMetaData", payload);


/*------------------------- Emulators -------------------------------------------------*/

export const getAllEmulators = () =>
  TmsAPI.get("api/tms/android/getAllEmulators");

export const runEmulator = (payload) =>
  TmsAPI.post("api/tms/android/runAndroidEmulator", payload);

export const stopEmulator = (payload) =>
  TmsAPI.post("api/tms/android/stopAndroidEmulator", payload);

export const deleteEmulator = (emulatorId) =>
  TmsAPI.delete("api/tms/android/deleteAndroidEmulator/" + emulatorId);

export const createEmulator = (payload) =>
  TmsAPI.post("api/tms/android/createAndroidEmulator", payload);

export const spellCheck = (payload) =>
  TmsAPI.post("api/tms/screens/spellCheck", payload);

// ----------------------wildcard------------ 
export const getStringByWCPattern = (payload) =>
  TmsAPI.post("api/tms/layouts/getStrings", payload);

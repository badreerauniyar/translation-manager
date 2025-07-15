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
import { API_CONST } from "../modules/common/constants"; 

// Axios instance with base url
export const API = axios.create({
  baseURL: `${config.appServer.getServerURL()}/`,
});

export const CONFIG_API = axios.create({
  baseURL: `${config.configServer.getServerURL()}/`,
  headers: {
    Authorization: API_CONST.BEARER + sessionStorage.getItem(API_CONST.TOKEN),
  },
});

export const CONFIG_API_MULTI = axios.create({
  baseURL: `${config.configServer.getServerURL()}/`,
  headers: {
    Authorization: API_CONST.BEARER + sessionStorage.getItem(API_CONST.TOKEN),
    "Content-type": API_CONST.MULTI_PART_FORM_DATA,
  },
});

// Common Interceptors for different API instances
interceptors(API);

interceptors(CONFIG_API_MULTI, API_CONST.CONFIG_MULTI_INTERCEPT);

interceptors(CONFIG_API, API_CONST.CONFIG_INTERCEPT);

// ----------------------------------------Authentications---------------------------------------------

export const login = (payload) => API.post("auth/login", payload);

export const logoutUser = (payload) => API.post("auth/logout", payload);

export const checkIfNewUser = (payload) =>
  API.post("auth/checkIfNewUser", payload);

export const setPasswordForNewUser = (payload) =>
  API.post("auth/setPasswordForNewUser", payload);

export const validateOldPassword = (payload) =>
  API.post("auth/validateOldPassword", payload);

export const register = (payload) => API.post("auth/register", payload);

export const updatePassword = (payload) =>
  API.put("auth/updatePassword", payload);

export const forgotPassword = (payload) =>
  API.put("auth/forgotPassword", payload);

export const confirmPassword = (payload) =>
  API.put("auth/confirmPassword", payload);

export const refreshToken = (payload) =>
  API.get("auth/refreshtoken", {
    params: payload,
  });

// ----------------------------------------Dropdowns----------------------------------------

export const readAllLanguages = () => API.get("api/languages/readAllLanguages");

export const addLanguageList = (payload) =>
  API.post("api/languages/addLanguageList", payload);

export const projectStatus = () =>
  API.get("api/menuItem/getMenuByName/ProjectStatus");

export const contextType = () =>
  API.get("api/menuItem/getMenuByName/ContextType");

export const addMenuItems = (payload) =>
  API.post("api/menuItem/addMenuItems", payload);

// ----------------------------------------Projects----------------------------------------

export const getAllProjectsAndItsUsers = () =>
  API.get("api/projects/getAllProjectsAndItsUsers");

export const getProjectByIdAndItsUsers = (projectId) =>
  API.get("api/projects/getProjectByIdAndItsUsersWithRole/" + projectId, {
    params: { projectId: projectId },
  });

export const getProjectEventsById = (projectId) =>
  CONFIG_API.get("projectEvents/getProjectEvents/" + projectId, {
    params: { projectId: projectId },
  });

export const addProject = (payload) =>
  API.post("api/projects/addProject", payload);

export const updateProjectById = (payload, projectId) =>
  API.put("api/projects/updateProjectById", payload, {
    params: { projectId: projectId },
  });

export const updateProjectEventsById = (payload, projectId) =>
  CONFIG_API.put("projectEvents/updateProjectEvents/" + projectId, payload, {
    params: { projectId: projectId },
  });

export const uploadProjectEventImage = (formData, projectId) =>
  CONFIG_API_MULTI.post(
    "projectEvents/uploadEventImages/" + projectId,
    formData,
    {
      params: { projectId: projectId },
    }
  );

export const downloadDocumentByProjectId = (documentId, projectId) =>
  API.get(`api/projects/downloadProjectDocument/${projectId}/${documentId}`, {
    responseType: "blob",
  });

export const downloadDocumentsProjectById = (documentId, projectId) =>
  API.get(`api/projects/downloadProjectDocuments/${projectId}/${documentId}`, {
    responseType: "blob",
  });

export const getFilesInFolder = (data) =>
  API.post(`api/projects/get-all-files-folder`, data)

export const getAllProjectDocumentById = (projectId) => {
  return API.get(`api/projects/getAllDocumentByProjectId/${projectId}`);
};

export const uploadProjectDocumentSingle = (formData) =>
  API.post("api/projects/uploadSingleDocument", formData, {
    responseType: "blob",
  });

export const addProjectDocument = (payload) =>
  API.post("api/projects/addProjectFolderToS3", payload);

export const deleteProjectDocumentSingle = (body) =>
  API.post("api/projects/deleteProjectDocument", body);

export const deleteProjectById = (projectId) =>
  API.delete("api/projects/deleteProjectById/" + projectId, {
    params: { projectId: projectId },
  });

export const deleteProjectEventsById = (projectId) =>
  CONFIG_API.delete("projectEvents/deleteProjectEvents/" + projectId, {
    params: { projectId: projectId },
  });

export const deleteProjectEventImages = (projectId) =>
  CONFIG_API_MULTI.delete("projectEvents/deleteEventImages/" + projectId, {
    params: { projectId: projectId },
  });

export const updateProjectStatusById = (payload, projectId) =>
  API.put("api/projects/updateProjectStatusById/", payload, {
    params: { projectId: projectId },
  });

export const addUsersAndRolesToProject = (payload) =>
  API.post("api/projects/addUsersAndRolesToProject", payload);

export const modifyUsersAndRoleInProjects = (payload, projectId) =>
  API.put("api/projects/modifyUsersAndRoleInProjects", payload, {
    params: { projectId: projectId },
  });

// Project Comments
export const getCommentsByProjectId = (projectId) =>
  API.get("api/projects/comments/getCommentsByProjectId/" + projectId, {
    params: { projectId: projectId },
  });

export const addCommentsProjects = (payload, projectId) =>
  API.post("api/projects/comments/addCommentsForProject", payload, {
    params: { projectId: projectId },
  });

// ----------------------------------------Roles----------------------------------------

export const getAllRoles = () => API.get("api/roles/getAllRoles");

export const deleteRoleById = (roleId) =>
  API.delete("api/roles/deleteRoleById/" + roleId);

export const updateFuxaAccess = (payload) =>
  API.put("api/roles/updateFuxaAccess", payload);

export const getRoleById = (roleId) =>
  API.get("api/roles/getRoleById/" + roleId);

export const addRole = (payload) => API.post("api/roles/addRole", payload);

// ----------------------------------------Users----------------------------------------

export const getAllUsers = (isActive) =>
  API.get("api/users/getAllUsers", {
    params: { isActive: isActive },
  });

export const getAllActiveAndArchivedUsers = () =>
  API.get("api/users/getAllActiveAndArchivedUsers");

export const activateUser = (payload) =>
  API.put("api/users/activateUser", payload);

export const resendActivationMail = (payload) =>
  API.post("api/users/resendActivationMail", payload);

export const getUserById = (userId) =>
  API.get("api/users/getUserById/" + userId);

export const addUser = (payload) => API.post("api/users/addUser", payload);

export const updateUserById = (payload) =>
  API.put("api/users/updateUserById", payload);

export const updateUserEulaById = (payload) =>
  API.put(API_CONST.UPDATE_EULA_AGREEMENT, payload);

export const deleteUserById = (userId) =>
  API.delete("api/users/deactivateUserById/" + userId);

export const updateProfileById = (payload) =>
  API.put("api/user/profile/updateprofileById", payload);

export const getProfileById = (userId) => API.get("api/user/profile/" + userId);

export const getProfileByIdInUserProfilePage = (userId) =>
  API.get("api/user/profile/profilePage/" + userId);

export const uploadProfilePic = (userId, payload) =>
  API.post("api/user/profile/uploadimage/" + userId, payload);

// ----------------------------------------Role Matrix----------------------------------------
export const getAllSecurityAccessesByRoleId = (roleId) =>
  API.get("api/security/access/getAllSecurityAccessesByRoleId/" + roleId);

export const updateAccessByAccessIdList = (payload) =>
  API.put("api/security/access/updateAccessByAccessIdList", payload);

export const getUserRole = (userId) =>
  API.get("api/projects/getUserProjectAndRoles/" + userId);

export const getProjectUserRole = (userId) =>
  API.get("api/projects/getUserRoles/" + userId);

export const updateProjectStatus = (payload) =>
  API.put("api/projects/updateProjectStatus", payload);

export const getProjectById = (projectId) =>
  API.get("api/projects/getProjectById/" + projectId, {
    params: { projectId: projectId },
  });

export const generateNewFuxaId = (payload) =>
  API.post("api/fuxa/generateNewFuxaId", payload);

export const sendMailToAdmins = (payload) =>
  API.post("api/users/sendMailToAdmins", payload);
// ---------------------------------cus requiremnt fileds-------------------------

export const createCustomReqField = (payload) =>
  CONFIG_API.post(`custom/reqField`, payload);

export const getCustomReqFieldList = (page) =>
  CONFIG_API.get(`custom/listReqFields/${page}`);

export const deleteCustomReqField = (fieldId) =>
  CONFIG_API.delete(`custom/reqField/${fieldId}`);

export const getCustomReqFieldById = (fieldId) =>
  CONFIG_API.get(`custom/reqField/${fieldId}`);

export const updateCustomReqField = (fieldId, payload) =>
  CONFIG_API.put(`custom/update/reqField/${fieldId}`, payload);

export const previewSharing = (payload, projectId) =>
  API.post("api/preview/share", payload, {
    params: { projectId: projectId },
  });

export const validateExternalUser = (payload, projectId) =>
  API.post("api/preview/validateExternalUser", payload, {
    params: { projectId: projectId },
  });

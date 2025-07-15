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
export const API = axios.create({
  baseURL: `${config.tenantServer.getServerURL()}/`,
});

// Common Interceptors for different API instances
interceptors(API);
// ----------------------------------------Super Admin---------------------------------------------

export const login = (payload) => API.post("tenants/login", payload);

export const getSuperAdmin = (payload) => API.post("tenants/getSuperAdmin", payload);

export const getTenantByName = (companyId) =>
  API.get("tenants/getTenantByName/" + companyId);

export const updateTenant = (id, payload) =>
  API.put("tenants/updateTenant?id=" + id, payload);

export const getAllTenants = () => API.get("tenants/getAllTenants");

export const getTenant = (tenantId) =>
  API.get("tenants/getTenant?id=" + tenantId);

export const createTenant = (payload) =>
  API.post("tenants/createTenant", payload);

export const deleteTenant = (tenantId) =>
  API.delete("tenants/deleteTenant?id=" + tenantId);

export const uploadTenantLogo = (companyId, payload) =>
  API.post("tenants/uploadTenantLogo/" + companyId, payload);


// ----------------------------------------Tenants----------------------------------------

export const registerTenant = (payload) =>
  API.post("api/tenant/registerTenant", payload);

export const syncTenantDB = (payload) =>
  API.post("api/tenant/syncTenantDB", payload);

export const removeTenant = (payload) =>
  API.post("api/tenant/removeTenant", payload);

export const modifyTenant = (payload) =>
  API.post("api/tenant/modifyTenant", payload);

// ----------------------------------------Eula----------------------------------------

export const getLatestEulaApi = () => API.get("tenants/eula/getLatestEula");

export const getAllEulaApi = () => API.get("tenants/eula/getAllEula");

export const addNewEulaApi = (data) => API.post("tenants/eula/newEula", data);

export const getAllLanguages = () => API.get("tenants/getAllLanguages");

export const getEulaFiles = (eulaId) =>
  API.get(`tenants/eula/getEulaFiles/${eulaId}`);

export const getUploadedEulaFile = (fileName) =>
  `${config.tenantServer.getServerURL()}/eulas/` + fileName;

// ----------------------------------------Privacy_Policy----------------------------------------
export const getAllPrivacyPoliciesApi = () =>
  API.get("tenants/privacyPolicy/getAllPrivacyPolicies");

export const getPrivacyPolicyFilesApi = (privacyPolicyId) =>
  API.get(`tenants/privacyPolicy/getPrivacyPolicyFiles/${privacyPolicyId}`);

export const addNewPrivacyPolicyApi = (data) =>
  API.post(`tenants/privacyPolicy/newPrivacyPolicy`, data);

export const getUploadedPrivacyPolicyFile = (fileName) =>
  `${config.tenantServer.getServerURL()}/privacyPolicies/` + fileName;

  export const getLeapXFlyerAPI = (fileName) =>
  `${config.tenantServer.getServerURL()}/leapxFlyer/` + fileName;

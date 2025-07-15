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
  baseURL: `${config.wfmServer.getServerURL()}/`,
});

// Common Interceptors for different API instances

interceptors(API, API_CONST.WORKFLOW.WFM);

export const getRoleById = (userId) =>
  API.get(API_CONST.WORKFLOW.GET_ROLE + userId);

export const getWorkflowForUserAndFlow = (userId, flowId, operationType) =>
  API.get(API_CONST.WORKFLOW.GET_FLOW_AND_USER + userId + "/" + flowId + "/"+ operationType);

export const getModules = () => API.get(API_CONST.WORKFLOW.GET_MODULES);

export const addWorkflow = (payload) =>
  API.post(API_CONST.WORKFLOW.ADD_WORKFLOW, payload);

export const addConfiguration = (payload) =>
  API.post(API_CONST.WORKFLOW.ADD_CONFIG, payload);

export const approveStep = (payload) =>
  API.put(API_CONST.WORKFLOW.APPROVE, payload);

export const revirewCountMailNotify = (payload) =>
  API.post(API_CONST.WORKFLOW.MAIL_NOTIFICATION_REVIEW_COUNT, payload);  

export const getWorkflowList = () =>
  API.get(API_CONST.WORKFLOW.GET_WORKFLOW_LIST);

export const getConfigWorkFlows = (workflowId) =>
  API.get(API_CONST.WORKFLOW.GET_CONFIG_WORKFLOW + workflowId);

export const getProjectWorkflowDetails = (projectId, moduleId) =>
  API.get(API_CONST.WORKFLOW.GET_PRJ_WORKFLOW + projectId + "/" + moduleId);

export const getConfigRoles = (moduleId, operation) =>
  API.get(API_CONST.WORKFLOW.GET_CONFIG_ROLES + moduleId + "/" + operation);

export const getNotifications = (userId) =>
  API.get(API_CONST.WORKFLOW.GET_NOTIFICATIONS + userId);

export const getFeatureData = (featureId, moduleId) =>
  API.get(API_CONST.WORKFLOW.GET_FEATURE_DATA + featureId + "/" + moduleId);

export const updateVariantStatus = (payload) =>
  API.put(API_CONST.WORKFLOW.UPDATE_VARIANT_STATUS, payload);

export const updateBaseLineStatus = (payload) =>
  API.put(API_CONST.WORKFLOW.UPDATE_BASELINE_STATUS, payload);

export const updateFlowStatus = (payload) =>
  API.put(API_CONST.WORKFLOW.UPDATE_FLOW_STATUS, payload);

export const updateReadStatus = (payload) =>
  API.put(API_CONST.WORKFLOW.UPDATE_READ_STATUS, payload);

export const getFlowStatus = () => API.get(API_CONST.WORKFLOW.GET_FLOW_STATUS);

export const getBaseLineStatus = () =>
  API.get(API_CONST.WORKFLOW.GET_BASELINE_STATUS);

export const getApprovalDetails = (approvalId) =>
  API.get(API_CONST.WORKFLOW.GET_APPROVAL_DETAILS + approvalId);

export const getDeleteWorkflow = (workflowId) =>
  API.delete(API_CONST.WORKFLOW.DELETE_WORKFLOW + workflowId);

export const getOperations = (moduleId) =>
  API.get(API_CONST.WORKFLOW.GET_OPERATIONS + moduleId);

export const getActions = (moduleId, operationId) =>
  API.get(API_CONST.WORKFLOW.GET_ACTIONS + moduleId + "/" + operationId);

export const checkIfWorkflowExists = (moduleId, operationId) =>
  API.get(API_CONST.WORKFLOW.CHECK_IF_EXISTS + moduleId + "/" + operationId);

export const checkForActiveWorkflows = (projectId, otherId) =>
  API.get(API_CONST.WORKFLOW.CHECK_FOR_ACTIVE + projectId + "/" + otherId);

export const checkActiveWorkFlowsForUser = (userId) =>
  API.get(API_CONST.WORKFLOW.CHECK_ACTIVE_FOR_USER + userId);

export const checkActiveWorkFlowsForWorkflow = (moduleId, operationId) =>
  API.get(
    API_CONST.WORKFLOW.CHECK_ACTIVE_FOR_WORKFLOWS + moduleId + "/" + operationId
  );

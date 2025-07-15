/****

Copyright (c) Robert Bosch Engineering And Business Solutions Pvt Ltd
All Rights Reserved. *
This file may not be distributed without the file ’license.txt’.
This file is subject to the terms and conditions defined in file
’license.txt’, which is part of this source code package.
***/
import { message } from "antd";

const interceptors = (instance, type) => {
  // Axios request interceptor
  instance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;

    config.headers.companyId = `${sessionStorage.getItem("companyId")}`;

    // ProjectId is required for all API's in the tms instance type
    const projectId = sessionStorage.getItem("projectId");
    if (projectId !== undefined) {
      if (config.params === undefined) {
        config.params = {
          projectId,
        };
      } else if (config.params.projectId === undefined) {
        config.params.projectId = projectId;
      }
    }
    return config;
  });

  // Axios response interceptor
  instance.interceptors.response.use(
    (response) => {
      // Return data alone from the response object
      return response;
    },
    function (error) {
      // Display error message and return Promise reject
      if (error.response) {
        if (error.response.status === 401) {
          message.error(error.response.data);
        } else if (error.response.status === 404) {
          message.error(`API Not Found (${error.response.config.url})`);
        } else if (
          error.response.status === 400 &&
          error.request.responseURL.includes("login")
        ) {
          message.error(error.response.data.message);
        } else {
          if (error.response.data && typeof error.response.data === "string") {
            message.error(error.response.data);
          } else if (
            error.response.data &&
            error.response.data instanceof Blob
          ) {
            const fileReader = new FileReader();
            fileReader.readAsText(error.response.data);
            fileReader.addEventListener("loadend", () => {
              message.error(fileReader.result);
            });
          } else if (error.response.data.message) {
            message.error(error.response.data.message);
          } else {
            message.error("Error");
          }
        }

        return Promise.reject(error.response.data);
      } else {
        message.error("No response, Please check server connection");
        return Promise.reject(error);
      }
    }
  );
};

export default interceptors;

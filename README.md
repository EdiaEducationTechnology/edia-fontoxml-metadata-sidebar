# EDA FontoXML sidebar
This EDIA sidebar connects the Fonto Editor with the EDIA metadata API.

# Installation
3. Copy the edia-analysis-sidebar directory to the packages directory of the fontoxml editor
2. Replace the API_KEY and DEMO_KEY in the edia-analysis-sidebar/src/EdiaAnalysisSidebar.jsx file 
    ```javascript
      jwtApi = "eyJhbGciOiJIUzI1....";
      jwtDemo = "eyJhbGciOiJIUzI...";
    ```
1. In the config/fonto-manifest.json file of the fontoxml editor, add the sidebar to the dependecies:
    ```javascript
    {
        "dependencies": {
            ...,
            "edia-analysis-sidebar": "packages/edia-analysis-sidebar"
        }
    }
    ```
0. Build and deploy the Fonto Editor as you are used to.

# Getting a licence key.
For a license key, please contact us at info at edia.nl.

In the mean time, you can play around with the APIs at: https://papyrus.edia.nl/ 

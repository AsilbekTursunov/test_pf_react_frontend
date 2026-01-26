/**
 * Global API Configuration
 * Centralized configuration for all API endpoints
 */

export const apiConfig = {
  // U-code API Configuration
  ucode: {
    baseURL: 'https://api.admin.u-code.io',
    authBaseURL: 'https://api.auth.u-code.io',
    projectId: '3ed54a59-5eda-4cfe-b4ae-8a201c1ea4ed',
    'environment-id': 'fc258dff-47c0-4ab1-9beb-91a045b4847c',
    clientTypeId: '2d3beced-ea36-41ab-9e24-e7ad372300fe',
    roleId: '653c399c-ed2b-4f16-bfe8-612d2e29e87d',
    authToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfcGxhdGZvcm1faWQiOiIiLCJjbGllbnRfdHlwZV9pZCI6IjFjYTFlMzU1LWJhMjktNDY1NS05MzIwLWVmY2UxZWYxNjJkNyIsImRhdGEiOiJNb3ppbGxhLzUuMCAoTWFjaW50b3NoOyBJbnRlbCBNYWMgT1MgWCAxMF8xNV83KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTQzLjAuMC4wIFNhZmFyaS81MzcuMzYiLCJleHAiOjE3Njk0ODc3OTgsImlhdCI6MTc2OTQwMTM5OCwiaWQiOiI1NGViZDA1YS05YWMwLTQxMDUtOTM4OS1jODY4ZDg1OTgyZjciLCJpcCI6IjEwLjIzMy42Ni4xMDYvMzIiLCJsb2dpbl90YWJsZV9zbHVnIjoidXNlciIsInByb2plY3RfaWQiOiIzZWQ1NGE1OS01ZWRhLTRjZmUtYjRhZS04YTIwMWMxZWE0ZWQiLCJyb2xlX2lkIjoiZTk5ZTVkMDQtYjFiZS00NDVkLWE0YmQtYzUwZTE4MjRkNTkyIiwidGFibGVzIjpudWxsLCJ1c2VyX2lkIjoiYjNmOGVkYjAtY2I1MS00MGE4LTg5ZGUtZWQ2M2ViZTRiYjUyIiwidXNlcl9pZF9hdXRoIjoiYjNmOGVkYjAtY2I1MS00MGE4LTg5ZGUtZWQ2M2ViZTRiYjUyIn0.hNcuz1MjjWQRjSeisRyKGrGu7ZR5yuAE1xNOpwUICmE',
    
    // Default menu and view IDs for chart of accounts
    chartOfAccounts: {
      menuId: 'bf6ca200-c8ba-4cd4-8075-64812dc6f734',
      viewId: 'f9a81b00-0d00-4800-8a94-57d232accf4a',
    },
    
    // Default menu and view IDs for bank accounts
    bankAccounts: {
      menuId: '69473d23-62fd-4450-bfbd-8915ebba9878',
      viewId: '72e2730b-c0e6-480d-92af-e13b6a6dea73',
      tableSlug: 'bank_accounts',
    },
    
    // Default menu and view IDs for counterparties
    counterparties: {
      menuId: '13791961-1778-4dfa-aeb4-3cf55f1767a8',
      viewId: '1625ed84-caeb-4064-b68a-d07e542a1349',
      tableSlug: 'counterparties',
    },
    
    // Default menu and view IDs for operations
    operations: {
      menuId: 'd9cf223e-73cd-41e3-be68-91836696d51b',
      viewId: '72ead1b5-4233-4572-9755-c667622ce5a6',
      tableSlug: 'operations',
    },
  },
  
  // API Keys (if needed for other services)
  apiKeys: {
    // Add other API keys here if needed
  },
}

/**
 * Get project ID
 */
export const getProjectId = () => apiConfig.ucode.projectId

/**
 * Get U-code base URL
 */
export const getUcodeBaseURL = () => apiConfig.ucode.baseURL

/**
 * Get auth token
 */
export const getAuthToken = () => apiConfig.ucode.authToken

/**
 * Get environment ID
 */
export const getEnvironmentId = () => apiConfig.ucode['environment-id']

/**
 * Get auth base URL
 */
export const getAuthBaseURL = () => apiConfig.ucode.authBaseURL

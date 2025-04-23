export const config = {
  api: {
    // Food Recall Alert API endpoints and keys
    foodAlert: {
      baseUrl: process.env.FOOD_ALERT_API_URL || "https://foodalert.azurewebsites.net/api/recent_recalls",
      apiKey: process.env.FOOD_ALERT_API_KEY || "gwrjUnxa7uaDizcyAmFNsvw28qZDHGQUPt6uxA6BHMJkAzFuKaZMeQ==",
      detailUrl: process.env.FOOD_ALERT_DETAIL_API_URL || "https://foodalert.azurewebsites.net/api/recall",
      detailApiKey: process.env.FOOD_ALERT_DETAIL_API_KEY || "RgSvkX0J5jmwHktk6lRV5O4naLtLuCkF3j8CbSIFQTWWAzFuF6ICxg==",
    },
  },
  pagination: {
    itemsPerPage: 25,
  },
}

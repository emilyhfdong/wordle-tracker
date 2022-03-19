export const createResponse = ({
  statusCode,
  body,
}: {
  statusCode?: number
  body: any
}) => ({
  statusCode: statusCode || 200,
  body: JSON.stringify(body),
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  },
})

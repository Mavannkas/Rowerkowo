-- Bicycle profile

api_version = 4



function get_co2(start_latitude, start_longitude, end_latitude, end_longitude)
  -- get co2 penalty
  -- the less is worse
  local http = require("socket.http")
  local ltn12 = require("ltn12")

  -- local url = os.getenv("CO2_URL")
  url = 'http://localhost:3011/co2'

  local base_url = string.format(
    "%s?startLatitude=%f&startLongitude=%f&endLatitude=%f&endLongitude=%f",
    url, start_latitude, start_longitude, end_latitude, end_longitude
)

  -- print("url ", base_url)

  -- Make a GET request
  local response_body = {}
  local res, code, response_headers = http.request {
    url = base_url,
    method = "GET",
    sink = ltn12.sink.table(response_body)
  }

  -- startLatitude=50.100569&startLongitude=20.122561&endLatitude=50.100569&endLongitude=20.122561

  -- Check the response code and print the response
  if res then
    return table.concat(response_body)
  else
    return 1
  end
end

function get_accidents(start_latitude, start_longitude, end_latitude, end_longitude)
  -- get co2 penalty
  -- the less is worse
  local http = require("socket.http")
  local ltn12 = require("ltn12")

  -- local url = os.getenv("CO2_URL")
  url = 'http://localhost:3011/accidents'

  local base_url = string.format(
    "%s?startLatitude=%f&startLongitude=%f&endLatitude=%f&endLongitude=%f",
    url, start_latitude, start_longitude, end_latitude, end_longitude
)

  -- print("url ", base_url)

  -- Make a GET request
  local response_body = {}
  local res, code, response_headers = http.request {
    url = base_url,
    method = "GET",
    sink = ltn12.sink.table(response_body)
  }

  -- Check the response code and print the response
  if res then
    return table.concat(response_body)
  else
    return 1
  end
end

print(get_co2(50.100569, 20.122561, 50.100569, 20.122561))
print(get_accidents(50.100569, 20.122561, 50.100569, 20.122561))

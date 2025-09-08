Dream Factory Design
Eddie Izumoto

Assumptions:
-Only Engineers can create projects (though for security reasons it should probably be done through users with account roles for permissions)
-Only Engineers need to log in due to needing create functionality
-CAD model is stored in some external filesystem source and does not need to be kept track of execpt for location (so no table for every CAD model)
-No scope for customer that the project is being done for. Would require more information in project and CAD ownership for access rights if needing to pull up via some type of catalog
-Project Params x1 to x10 are stored as strings because ambiguous input
-Use a background process to ship cell status to database every minute (or second but data ramifications can be large depending upon retention)
when storing in this database. Using a time series database is better for this type of data/query
-Should also be General CRUD for cells, engineers, but not accessable via outward facing API for functionality described for Engineer/Shift Supervisor/Department Head.
API:

/login POST
request JSON: {"username:<username>, "password":<password>}
response JSON: Session cookie or signed token

/projects GET Get list of projects, can filter by status, and timeframe
request params: status:<created, running, finished, failure>
start_time: <start of timeframe to check against>
end_time: <end of timeframe to check against>
For Shift Supervisors to check all active projects they query with status=running
For Department heads to check all completed projects within a timeframe query would be
status=finished&start_time=2025-09-01&end_time=2025-09-05 to see all projects finished from 2025-09-01 to 2025-09-05
(Corner case criteria, should probably default time to 00:00:00 and it should be UTC so provided example will not show jobs from 09-05
response JSON: {"projects":[{"project_id":1,
"cad_model":"s3:examplebucket/platform/customer/cad/modelcad",
"config":"s3:examplebucket/platform/customer/config/config.yml
"cell_id": 42,
"created_at_utc": "2025-08-29:01:42:11",
"updated_at_utc": "2025-09-01:12:00:01",
"status":"finished",
"created_by":"eizumoto",
"x1":"1",
"x1":"2",
"x1":"3",
"x1":"4",
"x1":"5",
"x1":"6",
"x1":"7",
"x1":"8",
"x1":"9",
"x1":"10"}]}
/projects POST Create new project
request JSON: {"cad_model": "<location>",
"config":"<config_location">,
"x-params":{"x1": <x1_value> .. "x10": <x10_value>}} (can be missing/optional to not include all 10)
user is provided by session or token
response JSON: {"project_id": id,
"created_by": <username>,
"cell_id":<cell job is disbatched to>,
"x-params":{"x1": <x1_value> ...}}
/projects/<id> PATCH Update project information (should only allow specific fields to be updated)
request JSON: {"x-params":{"x1":<x1_value>...}}
/projects/<id>/status PATCH
This is debateble to do as you could have the functionality in the previous PATCH endpoint, however when marking a job to be complete I like to
have a different explicit call so that it cannot accidentally be updated in the same way. This could also be useful if needing to mark a specific project as a failure

/projects/<id> GET Get information about project
response JSON:
{"project_id":1,
"cad_model":"s3:examplebucket/platform/customer/cad/modelcad",
"config":"s3:examplebucket/platform/customer/config/config.yml
"cell_id": 42,
"created_at_utc": "2025-08-29:01:42:11",
"updated_at_utc": "2025-09-01:12:00:01",
"status":"finished",
"created_by":"eizumoto",
"x1":"1",
"x1":"2",
"x1":"3",
"x1":"4",
"x1":"5",
"x1":"6",
"x1":"7",
"x1":"8",
"x1":"9",
"x1":"10"}
/engineers GET
you could have it return all engineers but that could be a security issue. This should just return a list of engineers who join with projects that are in the running state
response JSON:
{engineers:[{"uername":<engineer username>, "first_name":<engineer first name>, "last_name":<engineer last name>}]}
/cells GET Get info on cells at a specific time frame
request params: start_time: <start of timeframe to check against>
end_time: <end of timeframe to check against>

    respone JSON:
    			{"cells":[{"cell_id":<cell_id>,
    					"utilization": <% utilization as floating point>}],
    			"start_time": <provided start time>,
    			"end_time": <provided end time>,
    			"duration": <time delta of query>
    			"total_utilization":<total utilization across all cells as floating point>}

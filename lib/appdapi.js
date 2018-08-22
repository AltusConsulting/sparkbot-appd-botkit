var request = require("request");

module.exports = function(config) {

    var appdAPI = {
        events: {
            get: function(appID, cb) {
                var eventTypes = 'APPLICATION_ERROR,APP_SERVER_RESTART';
                //var eventTypes = 'ACTIVITY_TRACE,ADJUDICATION_CANCELLED,AGENT_ADD_BLACKLIST_REG_LIMIT_REACHED,AGENT_ASYNC_ADD_REG_LIMIT_REACHED,AGENT_CONFIGURATION_ERROR,APPLICATION_CRASH,AGENT_DIAGNOSTICS,AGENT_ERROR_ADD_REG_LIMIT_REACHED,AGENT_EVENT,AGENT_METRIC_BLACKLIST_REG_LIMIT_REACHED,AGENT_METRIC_REG_LIMIT_REACHED,AGENT_STATUS,ALREADY_ADJUDICATED,APPDYNAMICS_DATA,APPDYNAMICS_INTERNAL_DIAGNOSTICS,APPLICATION_CONFIG_CHANGE,APPLICATION_DEPLOYMENT,APPLICATION_DISCOVERED,APPLICATION_ERROR,APP_SERVER_RESTART,AZURE_AUTO_SCALING,BACKEND_DISCOVERED,BT_DISCOVERED,BUSINESS_ERROR,CLR_CRASH,CONTROLLER_AGENT_VERSION_INCOMPATIBILITY,CONTROLLER_ASYNC_ADD_REG_LIMIT_REACHED,CONTROLLER_COLLECTIONS_ADD_REG_LIMIT_REACHED,CONTROLLER_ERROR_ADD_REG_LIMIT_REACHED,CONTROLLER_EVENT_UPLOAD_LIMIT_REACHED,CONTROLLER_MEMORY_ADD_REG_LIMIT_REACHED,CONTROLLER_METADATA_REGISTRATION_LIMIT_REACHED,CONTROLLER_METRIC_DATA_BUFFER_OVERFLOW,CONTROLLER_METRIC_REG_LIMIT_REACHED,CONTROLLER_PSD_UPLOAD_LIMIT_REACHED,CONTROLLER_RSD_UPLOAD_LIMIT_REACHED,CONTROLLER_SEP_ADD_REG_LIMIT_REACHED,CONTROLLER_STACKTRACE_ADD_REG_LIMIT_REACHED,CONTROLLER_TRACKED_OBJECT_ADD_REG_LIMIT_REACHED,CUSTOM,CUSTOM_ACTION_END,CUSTOM_ACTION_FAILED,CUSTOM_ACTION_STARTED,CUSTOM_EMAIL_ACTION_END,CUSTOM_EMAIL_ACTION_FAILED,CUSTOM_EMAIL_ACTION_STARTED,DEADLOCK,DEV_MODE_CONFIG_UPDATE,DIAGNOSTIC_SESSION,DISK_SPACE,EMAIL_ACTION_FAILED,EMAIL_SENT,EUM_CLOUD_BROWSER_EVENT,EUM_CLOUD_SYNTHETIC_BROWSER_EVENT,EUM_INTERNAL_ERROR,HTTP_REQUEST_ACTION_FAILED,INFO_INSTRUMENTATION_VISIBILITY,INTERNAL_UI_EVENT,JIRA_ACTION_END,JIRA_ACTION_FAILED,JIRA_ACTION_STARTED,LICENSE,MACHINE_AGENT_LOG,MACHINE_DISCOVERED,MEMORY,MEMORY_LEAK_DIAGNOSTICS,MOBILE_CRASH_IOS_EVENT,MOBILE_CRASH_ANDROID_EVENT,NETWORK,NODE_DISCOVERED,NORMAL,OBJECT_CONTENT_SUMMARY,POLICY_CANCELED_CRITICAL,POLICY_CANCELED_WARNING,POLICY_CLOSE_CRITICAL,POLICY_CLOSE_WARNING,POLICY_CONTINUES_CRITICAL,POLICY_CONTINUES_WARNING,POLICY_DOWNGRADED,POLICY_OPEN_CRITICAL,POLICY_OPEN_WARNING,POLICY_UPGRADED,RESOURCE_POOL_LIMIT,RUN_LOCAL_SCRIPT_ACTION_END,RUN_LOCAL_SCRIPT_ACTION_FAILED,RUN_LOCAL_SCRIPT_ACTION_STARTED,SERVICE_ENDPOINT_DISCOVERED,SLOW,SMS_SENT,STALL,SYSTEM_LOG,THREAD_DUMP_ACTION_END,THREAD_DUMP_ACTION_FAILED,THREAD_DUMP_ACTION_STARTED,TIER_DISCOVERED,VERY_SLOW,WARROOM_NOTE,WORKFLOW_ACTION_END,WORKFLOW_ACTION_FAILED,WORKFLOW_ACTION_STARTED';
                var resource = '/controller/rest/applications/'+ appID + '/events?output=JSON&time-range-type=BEFORE_NOW&duration-in-mins=10080&event-types=' + eventTypes + '&severities=INFO,WARN,ERROR';

                //request.get(config.baseURL + resource, cb).auth(config.username, config.password);
                var response = {statusCode: '200'};
                var body = [{"severity":"INFO","summary":"Proxy was re-started Node: process-0, Tier: Node","type":"APP_SERVER_RESTART","affectedEntities":[{"entityType":"APPLICATION_COMPONENT_NODE","name":"process-0","entityId":45157},{"entityType":"APPLICATION_COMPONENT","name":"Node","entityId":25568},{"entityType":"MACHINE_INSTANCE","name":"172.31.22.67","entityId":7520386},{"entityType":"APPLICATION","name":"MyNodeApp","entityId":19573}],"markedAsResolved":false,"deepLinkUrl":"https://turing201807191413585.saas.appdynamics.com/#location=APP_EVENT_VIEWER_MODAL&eventSummary=1002127916","archived":false,"markedAsRead":false,"eventTime":1533325618850,"subType":"","id":1002127916,"triggeredEntity":null},{"severity":"INFO","summary":"Proxy was re-started Node: process-0, Tier: Node","type":"APP_SERVER_RESTART","affectedEntities":[{"entityType":"APPLICATION_COMPONENT_NODE","name":"process-0","entityId":45157},{"entityType":"MACHINE_INSTANCE","name":"172.31.22.67","entityId":7520386},{"entityType":"APPLICATION_COMPONENT","name":"Node","entityId":25568},{"entityType":"APPLICATION","name":"MyNodeApp","entityId":19573},{"entityType":"APPLICATION_COMPONENT_NODE","name":"process-0","entityId":45157},{"entityType":"MACHINE_INSTANCE","name":"172.31.22.67","entityId":7520386},{"entityType":"APPLICATION_COMPONENT","name":"Node","entityId":25568},{"entityType":"APPLICATION","name":"MyNodeApp","entityId":19573}],"markedAsResolved":false,"deepLinkUrl":"https://turing201807191413585.saas.appdynamics.com/#location=APP_EVENT_VIEWER_MODAL&eventSummary=993815013","archived":true,"markedAsRead":false,"eventTime":1533075506460,"subType":"","id":993815013,"triggeredEntity":null},{"severity":"INFO","summary":"Proxy was re-started Node: process-0, Tier: Node","type":"APP_SERVER_RESTART","affectedEntities":[{"entityType":"MACHINE_INSTANCE","name":"172.31.22.67","entityId":7520386},{"entityType":"APPLICATION_COMPONENT_NODE","name":"process-0","entityId":45157},{"entityType":"APPLICATION_COMPONENT","name":"Node","entityId":25568},{"entityType":"APPLICATION","name":"MyNodeApp","entityId":19573}],"markedAsResolved":false,"deepLinkUrl":"https://turing201807191413585.saas.appdynamics.com/#location=APP_EVENT_VIEWER_MODAL&eventSummary=993801358","archived":false,"markedAsRead":false,"eventTime":1533075098710,"subType":"","id":993801358,"triggeredEntity":null},{"severity":"INFO","summary":"Proxy was re-started Node: process-0, Tier: Node","type":"APP_SERVER_RESTART","affectedEntities":[{"entityType":"MACHINE_INSTANCE","name":"172.31.22.67","entityId":7520386},{"entityType":"APPLICATION_COMPONENT_NODE","name":"process-0","entityId":45157},{"entityType":"APPLICATION_COMPONENT","name":"Node","entityId":25568},{"entityType":"APPLICATION","name":"MyNodeApp","entityId":19573}],"markedAsResolved":false,"deepLinkUrl":"https://turing201807191413585.saas.appdynamics.com/#location=APP_EVENT_VIEWER_MODAL&eventSummary=993774622","archived":false,"markedAsRead":false,"eventTime":1533074299813,"subType":"","id":993774622,"triggeredEntity":null},{"severity":"INFO","summary":"Proxy was re-started Node: process-0, Tier: Node","type":"APP_SERVER_RESTART","affectedEntities":[{"entityType":"APPLICATION_COMPONENT","name":"Node","entityId":25568},{"entityType":"APPLICATION","name":"MyNodeApp","entityId":19573},{"entityType":"MACHINE_INSTANCE","name":"172.31.22.67","entityId":7520386},{"entityType":"APPLICATION_COMPONENT_NODE","name":"process-0","entityId":45157}],"markedAsResolved":false,"deepLinkUrl":"https://turing201807191413585.saas.appdynamics.com/#location=APP_EVENT_VIEWER_MODAL&eventSummary=990462723","archived":false,"markedAsRead":false,"eventTime":1532981025374,"subType":"","id":990462723,"triggeredEntity":null}];
                cb(null, response, JSON.stringify(body));
            }
        },
        applications: {
            get: function(appID, cb) {
                var resource = '/controller/rest/applications/'+ appID + '?output=JSON'

                request.get(config.baseURL + resource, cb).auth(config.username, config.password);
            },
            getall: function(cb) {
                var resource = '/controller/rest/applications?output=JSON'

                //request.get(config.baseURL + resource, cb).auth(config.username, config.password);
                var response = {statusCode: '200'};
                var body =
                [
                    {
                        "name": "NodeApp",
                        "description": "Sample NodeJS application",
                        "id": 19573
                    },
                    {
                        "name": "MySQL",
                        "description": "Sample MySQL database",
                        "id": 19574
                    },
                    {
                        "name": "PythonApp",
                        "description": "Sample Python application",
                        "id": 19575
                    }
                ];
                cb(null, response, JSON.stringify(body));
            }
        },
        metrics: {
            get: function(appID, metricPath, minutes, cb) {
                var resource = '/controller/rest/applications/'+ appID + '/metric-data?metric-path=' + metricPath + '&time-range-type=BEFORE_NOW&duration-in-mins=' + minutes + '&output=JSON'

                //request.get(config.baseURL + resource, cb).auth(config.username, config.password);
                var response = {statusCode: '200'};
                var body = 
                [
                    {
                        "frequency": "ONE_MIN",
                        "metricId": 4691809,
                        "metricName": "BTM|Application Summary|Number of Very Slow Calls",
                        "metricPath": "Overall Application Performance|Number of Very Slow Calls",
                        "metricValues": [
                            {
                                "count": 0,
                                "current": 0,
                                "max": -2147483648,
                                "min": 2147483647,
                                "occurrences": 0,
                                "standardDeviation": Math.floor(Math.random() * Math.floor(25)),
                                "startTimeInMillis": 1533676260000,
                                "sum": 0,
                                "useRange": false,
                                "value": Math.floor(Math.random() * Math.floor(100))
                            }
                        ]
                    }
                ];
                cb(null, response, JSON.stringify(body));
            }
        }
    };

    return appdAPI;
};
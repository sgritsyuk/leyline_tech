## Overview

This is a project for LeyLine - Backend Technical Challenge.

Project includes 4 directories:
* **project** - contains general files for project: Makefile, Docker Compose, etc
* **frontend-service** - frontend React based simple service  (React, TypeScript)
* **gateway-service** - service provide HTTP API for tasks and video endpointd, using MongoDB as a storage and RabbitMQ for event based communication (FastAPI, Uvicorn, MongoDB, Celery, RabbitMQ)
* **worker-service** - worker service RabbitMQ to get notifications regarding new tasks and process new video generation tasks (MongoDB, Celery, RabbitMQ)


## Architecture

The system architecture is designed to be simple yet scalable, ensuring efficient communication and task management. 

The frontend interacts exclusively with the Gateway through a REST API. This design centralizes the handling of requests and responses, providing a consistent interface for client interactions.

The Gateway operates asynchronously, managing incoming requests and outgoing responses efficiently. It is responsible for creating new tasks, handling image uploads, and streaming video content. By leveraging asynchronous processing, the Gateway ensures high performance and responsiveness.

To facilitate future scalability, Celery and RabbitMQ are used as the task queue management system. This setup allows for distributed task processing, enabling the system to handle increased loads by distributing tasks across multiple worker nodes.

The Worker service is designed to be stateless, meaning it does not maintain any internal state between tasks. This stateless nature allows for seamless scaling, as worker instances can be added or removed based on the current load without affecting the system's stability or performance.


## How to start locally

Project includes a Docker Compose and Make script for easy local deployment.

To start it locally follow the next steps:
* navigate console to `./project` directory
* run `make up` command to start all services (`make up_build` if you want to rebuild it)
* open your browser and navigate to http://localhost:3000/
* upload image file using frontend UI and get video result
* run `make down` command after you will finish to stop all docker containers


## Gateway API description

<details>
 <summary><code>API entities description</code></summary>

<code><b>Task response</b></code>
```
        {
            "status": "PENDING",
            "progress": 0,
            "filename": "/uploads/049f502e-7e50-42d1-8924-2da70de4faf1.png",
            "message": null
        }
```

</details>

<details>
 <summary><code>GET</code> <code><b>/api/v1/task/{id}</b></code> <code>get task information by id</code></summary>

##### Parameters

> | name |  type     | data type | description          |
> |------|-----------|-----------|----------------------|
> | `id` |  required | string    | The specific task id |

##### Responses

> | http code | content-type               | response                                                       |
> |-----------|----------------------------|----------------------------------------------------------------|
> | `200`     | `application/json`         | `{<user response entity>}`                                     |
> | `404`     | `application/json`         | ``                                                             |

</details>

<details>
 <summary><code>POST</code> <code><b>/api/v1/task</b></code> <code>create a new task</code></summary>

##### Body

contains regular multipart/form-data as input

##### Responses

> | http code     | content-type               | response                                                |
> |---------------|----------------------------|---------------------------------------------------------|
> | `200`         | `application/json`         | `{"id":"<new task ID>"}`                                |

##### Notes

- Task ID generated as UUID, same image uploaded multiple times will produce different tasks

</details>

<details>
 <summary><code>GET</code> <code><b>/api/v1/video/{id}</b></code> <code>get video by id</code></summary>

##### Parameters

> | name |  type     | data type | description           |
> |------|-----------|-----------|-----------------------|
> | `id` |  required | string    | The specific video id |

##### Responses

if video exists it will return response with mp4 video stream, otherwise HTTP 404 error

</details>

<details>
 <summary><code>GET</code> <code><b>/api/v1/ping</b></code> <code>check the status of service</code></summary>

##### Responses

> | http code     | content-type         | response                    |
> |---------------|----------------------|-----------------------------|
> | `200`         | `application/json`   | `{"message":"pong"}`        |

</details>


## Possible enhancements

If consider to grow this project into real-life production application, next enhancements should be made:
* define common entities to reuse it between services
* better API error processing, always return correct JSON responce with error description in case of an error
* pay attention to tests coverage
* add more logs and create better documentation
* consider creation of common packages/libraries to reuse the logic between services (config, db clients, etc.)
* implement internal APi for services, it should provide `health` information (consider add `metrics` too)
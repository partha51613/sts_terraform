# SimpleTimeService

**SimpleTimeService** is a lightweight service that displays the current timestamp and the public IPv4 address of the host machine. The output is presented in the following format:

```json
{
    "timestamp": "15/04/2025 06:29:48 AM",  
    "ip": "49.37.100.55"  
}
```
## Prerequisites

The prerequisites to run SimpleTimeService are:

- Docker (version 19.03 or higher)
- Docker Compose (version 1.27.0 or higher) - Only if you want to run the service via Docker Compose (Method 2)


## Docker Image

The Docker image for the service is available on Docker Hub. You can pull it with the following command:

```
docker pull partha51613/simple-time-service:latest
```

## Dockerhub Repository:

```
https://hub.docker.com/r/partha51613/simple-time-service
```

## GitHub Repository


```
https://github.com/partha51613/SimpleTimeService
```

## Running with Docker Compose

The preferred way to run **SimpleTimeService** is by using Docker Compose. You may also run the container manually using **docker run** instead of compose

### Prerequisites

Ensure you have the following dependencies installed before running the service:

- Docker (version 19.03 or higher)
- Docker Compose (version 1.27.0 or higher) (_Only if you want to run it via Method 2_)

## Steps to Run

### Using Docker (Method 1)

1. Pull the docker image and run it using the commands
```
docker pull partha51613/simple-time-service:latest
docker run -dp 3001:3001 --name simple-time-service partha51613/simple-time-service
```

2. The application can be accessed on the following ip (if run using docker-compose)

```
http://localhost:3001
```

### Using Docker Compose (Method 2 [_Preferred_] )

1. Clone the repository:

```
git clone https://github.com/partha51613/SimpleTimeService.git
cd SimpleTimeService
```

2. Build and start the container using Docker Compose:

```
   docker-compose up -d
```


   This command will:
   - Build the Docker image (if not already built).
   - Start the container in detached mode.


3. Access the Application

The application can be accessed on the following ip (if run using docker-compose)


```
http://localhost:3001
```


4. Stopping the Service

To stop and remove the container, use the following command:

```
docker-compose down
```
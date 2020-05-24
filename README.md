# Remote Code Execution Engine
This API runs your code for you in a secure environment.The user can limit the memory and execution time.Currently this api supports 4 languages. Visit my [blog](https://medium.com/@yashbudukh/building-a-remote-code-execution-system-9e55c5b248d6?sk=da85e0b861383a610adcfdf086096a5d) - for a detailed walkthrough.

* C
* C++
* Python3
* Java

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* docker
* docker-compose

### Installation

1. Clone the repo
```sh
git clone https://github.com/budukhyash/remote-code-execution-engine
```
2. Run in the cloned directory
```sh
docker-compose up --build
```
3. This will start 4 services (publisher,worker,reddis-server and a rabbitMQ instance).
   The server will be listening on port 7000.


<!-- USAGE EXAMPLES -->
## Documentation
* [Api Docs](https://documenter.getpostman.com/view/11156949/Szt8fAgW?version=latest) - with examples using various languages.

## Built With

* [Express](https://expressjs.com/)     -  The web framework used
* [RabbitMQ](https://www.rabbitmq.com/) -  Task queue
* [Redis](https://redis.io/)           -  Used for caching the results.
* [nodejs](https://nodejs.org/en/)      -  Used as the js runtime.

## Acknowledgments

* https://www.youtube.com/user/GISIGeometry 
* https://blog.remoteinterview.io/how-we-used-docker-to-compile-and-run-untrusted-code-2fafbffe2ad5



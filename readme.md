# Node.js Server Project with Monitoring and Logging

This README provides a comprehensive guide to set up a Node.js server project integrated with Prometheus and Grafana for monitoring, Loki for logging, and Docker for containerization. Follow the steps below to configure and deploy the project successfully.

---

## Table of Contents

1. [Project Setup](#project-setup)
2. [Dependencies Installation](#dependencies-installation)
3. [Metrics Collection Route](#metrics-collection-route)
4. [Logging Integration](#logging-integration)
5. [Environment Variables](#environment-variables)
6. [Docker Integration](#docker-integration)
7. [GitHub Actions CI/CD](#github-actions-cicd)
8. [EC2 Instance Configuration](#ec2-instance-configuration)
9. [Prometheus Setup](#prometheus-setup)
10. [Grafana and Loki Setup](#grafana-and-loki-setup)
11. [Visualization and Monitoring](#visualization-and-monitoring)

---

## Project Setup

1. **Initialize the Project**:
    ```bash
    mkdir node-server-project
    cd node-server-project
    npm init -y
    ```

2. **Configure Sensitive Information**:
   Store sensitive information like MongoDB URL, port number, and credentials in a `.env` file.

---

## Dependencies Installation

Install the required dependencies:
```bash
npm install winston winston-loki prom-client dotenv express
```

---

## Metrics Collection Route

Add a route to collect metrics from Prometheus:

```javascript
const express = require('express');
const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

const app = express();

app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', client.register.contentType);
  const metrics = await client.register.metrics();
  return res.send(metrics);
});
```

---

## Logging Integration

Integrate Winston and Loki for logging:

```javascript
const { createLogger, transports, format } = require('winston');
const LokiTransport = require('winston-loki');
require('dotenv').config();

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.simple()),
  transports: [
    new LokiTransport({
      host: `${process.env.LOKI_HOST}`,
      labels: { job: 'my-server' },
    }),
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
});

logger.info('Server is started');
```

Use `logger.info()` at the top of each route:

```javascript
logger.info('Request received on /api/v1/user/address');
```

---

## Environment Variables

Create a `.env` file:

```plaintext
PORT=8000
DB_URL=<your_mongo_db_url>
LOKI_HOST=http://<your_system_ip>:3100
```

---

## Docker Integration

Add a `Dockerfile`:

```dockerfile
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
ENV PORT=8000
ENV DB_URL=${DB_URL}
ENV LOKI_HOST=${LOKI_HOST}
CMD ["node", "index.js"]
```

---

## GitHub Actions CI/CD

Set up a GitHub Actions workflow:

```yaml
name: Node.js CI
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
      - name: Install dependencies
        run: npm install
      - name: Build project
        run: npm run build --if-present
      - name: Docker Login
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      - name: Build and Push Docker Image
        run: |
          docker build -t ${{ secrets.DOCKER_USERNAME }}/nodejs-envanto:latest .
          docker push ${{ secrets.DOCKER_USERNAME }}/nodejs-envanto:latest
```

---

## EC2 Instance Configuration

1. **Create an EC2 Instance**:
    - OS: Ubuntu
    - Instance Type: t2.micro (Free Tier eligible)
    - Enable HTTP and HTTPS traffic.

2. **Install Docker on EC2**:
    ```bash
    sudo apt-get update
    sudo apt-get install docker.io
    sudo systemctl start docker
    sudo chmod 666 /var/run/docker.sock
    docker ps
    ```

---

## Prometheus Setup

1. Download and Extract Prometheus:
    ```bash
    wget https://github.com/prometheus/prometheus/releases/download/v2.53.3/prometheus-2.53.3.linux-amd64.tar.gz
    tar -xvzf prometheus-2.53.3.linux-amd64.tar.gz
    cd prometheus-2.53.3.linux-amd64
    ```

2. Edit `prometheus.yml`:

    ```yaml
    scrape_configs:
      - job_name: 'nodejs-app'
        static_configs:
          - targets: ['<ec2_ip>:8000']
        metrics_path: '/metrics'
    ```

---

## Grafana and Loki Setup

1. **Run Grafana and Loki using Docker**:
    ```bash
    docker run -d -p 3000:3000 --name=grafana grafana/grafana-oss
    docker run -d -p 3100:3100 --name=loki grafana/loki
    ```

2. Access Grafana at: `http://<ec2_ip>:3000` (Default credentials: admin/admin).

---

## Visualization and Monitoring

1. **Prometheus**:
    - Navigate to `http://<ec2_ip>:9090`
    - Verify metrics under **Status > Targets**.

2. **Grafana**:
    - Add Prometheus as a data source.
    - Create a new dashboard and visualize metrics.

---

## Images Placeholder

- Add relevant screenshots or diagrams to illustrate steps here.
  - ![Prometheus Targets](path/to/prometheus-targets.png)
  - ![Grafana Dashboard](path/to/grafana-dashboard.png)

---

## License

This project is licensed under the MIT License. Feel free to contribute and share.
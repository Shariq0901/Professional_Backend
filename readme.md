# Node.js Server Project with CI/CD and DevOps Monitoring Setup

This project provides a comprehensive setup for a Node.js server integrated with CI/CD pipelines, logging, and monitoring using Prometheus, Grafana, and Loki. **Note:** This setup is specifically designed for CI/CD and DevOps purposes.

---

## Prerequisites

- Node.js (v20 or later)
- Docker installed on your machine
- AWS account for EC2 setup
- GitHub repository with necessary secrets configured

---

## Steps

### Step 1: Initialize the Node.js Project

- Create a Node.js project and initialize `package.json`:
  ```bash
  npm init -y
  ```
- Install the required dependencies:
  ```bash
  npm install winston winston-loki prom-client express dotenv
  ```

---

### Step 2: Sensitive Information Management

- Use a `.env` file to manage sensitive information like MongoDB URL, port numbers, and credentials.
- Example `.env` file:
  ```
  PORT=8000
  DB_URL=your_mongodb_url
  JWT_SECRET=your_secret
  LOKI_HOST=http://<your_system_IP>:3100
  ```

---

### Step 3: Adding Monitoring with Prometheus

- Install the Prometheus client in your Node.js project:
  ```bash
  npm install prom-client
  ```
- Add a route for Prometheus metrics collection:
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

### Step 4: Adding Logging with Loki

- Configure Winston with Loki for log management:
  ```javascript
  const { createLogger, transports, format } = require('winston');
  const LokiTransport = require('winston-loki');

  require('dotenv').config();

  const options = {
    level: 'info',
    format: format.combine(format.timestamp(), format.simple()),
    transports: [
      new LokiTransport({
        host: process.env.LOKI_HOST,
        labels: { job: 'my-server' },
      }),
      new transports.Console({
        format: format.combine(format.colorize(), format.simple()),
      }),
    ],
  };

  const logger = createLogger(options);
  logger.info('Server started');
  ```

- Add `logger.info` to every route for better log tracking:
  ```javascript
  logger.info('Request received on /api/v1/user/address');
  ```

---

### Step 5: Docker Setup

- Create a `Dockerfile` for containerization:
  ```dockerfile
  FROM node:20
  WORKDIR /app
  COPY package*.json ./
  RUN npm install
  COPY . .
  RUN npm run build
  EXPOSE 8000
  ENV PORT=8000
  ENV DB_URL=${DB_URL}
  ENV CROSS_ORIGIN=${CROSS_ORIGIN}
  ENV JWT_SECRET=${JWT_SECRET}
  ENV LOKI_HOST=${LOKI_HOST}
  CMD ["node", "dist/index.js"]
  ```

- Build and run the Docker container:
  ```bash
  docker build -t nodejs-envanto .
  docker run -p 8000:8000 nodejs-envanto
  ```

---

### Step 6: GitHub Actions Workflow

- Add a CI/CD workflow file in `.github/workflows/<filename>.yaml`:
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
        - name: Use Node.js ${{ matrix.node-version }}
          uses: actions/setup-node@v4
          with:
            node-version: '20.x'
        - name: Install dependencies
          run: npm install
        - name: Build code
          run: npm run build --if-present
  ```

---

### Step 7: EC2 Instance Setup

- Launch an Ubuntu EC2 instance.
- Configure security group to allow HTTP, HTTPS, and custom TCP ports for Prometheus (9090), Grafana (3000), and Loki (3100).

---

### Step 8: Prometheus Setup

- Download and configure Prometheus:
  ```bash
  wget https://github.com/prometheus/prometheus/releases/download/v2.53.3/prometheus-2.53.3.linux-amd64.tar.gz
  tar -xvzf prometheus-2.53.3.linux-amd64.tar.gz
  cd prometheus-2.53.3.linux-amd64
  ```

- Update `prometheus.yml` with your metrics path:
  ```yaml
  scrape_configs:
    - job_name: 'nodejs-app'
      static_configs:
        - targets: ['<ec2_ip>:8000']
      metrics_path: '/metrics'
  ```

---

### Step 9: Grafana and Loki Setup

- Run Grafana and Loki containers:
  ```bash
  docker run -d -p 3000:3000 --name=grafana grafana/grafana-oss
  docker run -d -p 3100:3100 --name=loki grafana/loki
  ```

---

### Step 10: Visualizations

- Access Grafana: `http://<ec2_ip>:3000`
- Add Prometheus as a data source and create dashboards.
- Add Loki logs to visualize log data.

---

## Images

Add your screenshots and visualizations here:

- **Project Structure**
- **Prometheus Configuration**
- **Grafana Dashboards**

---

## Notes

This setup is intended for **CI/CD and DevOps** use cases only. Ensure your environment variables are securely managed and your infrastructure is properly secured.

---

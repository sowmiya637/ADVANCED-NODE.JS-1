

#  Performance & Scaling — Complete Guide

## 📌 Overview
This module teaches how to scale Node.js applications, optimize performance, and handle high traffic using:
- Clustering & load balancing  
- Child processes  
- Worker threads  
- PM2 process manager  
- Performance profiling  
- Memory leak detection  
- Event loop optimization  

---

# ⚡ 1. Clustering & Load Balancing

## 1.1 What is Clustering?
Node.js runs on a **single thread**, meaning only one CPU core is used.

Clustering allows you to:
- Create multiple worker processes  
- Utilize all CPU cores  
- Increase throughput and concurrency  

### Example:
```js
import cluster from "cluster";
import os from "os";

if (cluster.isPrimary) {
  const cores = os.cpus().length;
  for (let i = 0; i < cores; i++) {
    cluster.fork(); // start worker
  }
} else {
  // Worker server
  app.listen(3000);
}
````

---

## 1.2 Load Balancing

Load balancing distributes incoming requests across multiple worker processes.

Built-in Node.js cluster acts as a load balancer.

External load balancers:

* NGINX
* HAProxy
* AWS ELB

Used when running multiple Node.js servers/containers.

---

# 🧵 2. Child Processes

## 2.1 What are Child Processes?

Child processes allow running CPU-heavy or blocking tasks separately so main thread remains responsive.

Node provides:

* `spawn`
* `exec`
* `fork`

### Example (fork):

```js
import { fork } from "child_process";

const process = fork("./script.js");
process.send({ message: "start" });
```

Use cases:

* File compression
* Video processing
* Large computations
* Background jobs

---

# 🧱 3. Worker Threads

## 3.1 What are Worker Threads?

A Worker Thread allows running JavaScript in **parallel threads**.

Alternative to child processes but lighter and faster.

### Example:

```js
import { Worker } from "worker_threads";

new Worker("./worker.js", { workerData: 5 });
```

Use cases:

* Machine learning tasks
* Image processing
* Crypto functions
* CPU-heavy loops

---

# 🔁 4. PM2 — Process Manager

PM2 manages and scales Node.js applications.

## Key features:

* Auto restart on crashes
* Log management
* Load balancing
* Zero-downtime deployments
* Monitoring dashboard

### Start clusters:

```sh
pm2 start server.js -i max
```

### Monitor:

```sh
pm2 monit
```

### Logs:

```sh
pm2 logs
```

---

# 📊 5. Performance Profiling

Performance profiling helps identify:

* Slow functions
* CPU bottlenecks
* Event-loop delays
* High memory usage

## Tools:

* `node --prof`
* Chrome DevTools debugger
* Clinic.js (`clinic doctor`, `clinic bubbleprof`)

### Example:

```sh
node --inspect server.js
```

---

# 🧠 6. Memory Leak Detection

Memory leaks occur when:

* References are not released
* Cache grows infinitely
* Event listeners aren't cleaned
* Large objects persist accidentally

## Detection Tools:

* Chrome DevTools heap snapshot
* `clinic heapprof`
* Node's `--trace-gc`

### Example:

```sh
node --inspect --trace-gc app.js
```

## Common leak sources:

* Global variables
* Timers not cleared
* Never-expiring cache
* Open event listeners

---

# 🌀 7. Event Loop Optimization

Node.js event loop handles:

* Timers
* I/O callbacks
* Microtasks
* Network requests

If event loop is blocked → app freezes.

## Causes of blocking:

* Long loops
* Heavy JSON parsing
* Sync filesystem operations
* Crypto operations

## Fixes:

* Move heavy tasks to worker threads
* Use async non-blocking APIs
* Use streaming instead of reading entire files

Use:

```js
setImmediate(() => {...})
```

to avoid blocking.

---



| Concept                 | Purpose                  |
| ----------------------- | ------------------------ |
| Clustering              | Use all CPU cores        |
| Load Balancing          | Distribute traffic       |
| Child Processes         | Offload heavy tasks      |
| Worker Threads          | Parallel JS execution    |
| PM2                     | Manage + scale Node apps |
| Profiling               | Find performance issues  |
| Memory Leak Detection   | Prevent crashes          |
| Event Loop Optimization | Keep app responsive      |



If you want the next topic, a combined README, or example code for cluster/worker threads, just tell me!
```

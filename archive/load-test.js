#!/usr/bin/env node

/**
 * Load Testing Script for Backend Comparison
 * Tests both backends under concurrent load
 */

const http = require('http');
const { performance } = require('perf_hooks');

const GATEWAY_URL = 'http://localhost:3000';
const NODEJS_URL = 'http://localhost:3001';
const PYTHON_URL = 'http://localhost:3002';

// Load test configuration
const LOAD_TEST_CONFIG = {
  concurrentRequests: 50,
  totalRequests: 200,
  requestTimeout: 5000, // 5 seconds
  testData: {
    text: 'zebra\napple\nBanana\ncherry\ndate\nfig\ngrape\nkiwi\nlemon\nmango',
    method: 'alphabetical-asc',
    options: { caseSensitive: false, removeDuplicates: false }
  }
};

function makeRequest(url, timeout = LOAD_TEST_CONFIG.requestTimeout) {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    const postData = JSON.stringify(LOAD_TEST_CONFIG.testData);
    
    const req = http.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const endTime = performance.now();
        try {
          const data = JSON.parse(body);
          resolve({
            statusCode: res.statusCode,
            responseTime: Math.round(endTime - startTime),
            success: res.statusCode === 200 && data.success,
            processingTime: data.data?.stats?.processing_time || 0
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            responseTime: Math.round(endTime - startTime),
            success: false,
            error: 'Parse error'
          });
        }
      });
    });

    req.on('error', (err) => {
      const endTime = performance.now();
      resolve({
        statusCode: 0,
        responseTime: Math.round(endTime - startTime),
        success: false,
        error: err.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        statusCode: 0,
        responseTime: LOAD_TEST_CONFIG.requestTimeout,
        success: false,
        error: 'Request timeout'
      });
    });

    req.setTimeout(timeout);
    req.write(postData);
    req.end();
  });
}

async function runLoadTest(backendName, baseUrl) {
  console.log(`\n🚀 Load Testing: ${backendName} Backend`);
  console.log('=' .repeat(50));
  
  const results = [];
  const concurrency = LOAD_TEST_CONFIG.concurrentRequests;
  const totalRequests = LOAD_TEST_CONFIG.totalRequests;
  
  console.log(`Configuration: ${totalRequests} total requests, ${concurrency} concurrent`);
  
  // Run requests in batches
  const batches = Math.ceil(totalRequests / concurrency);
  
  for (let i = 0; i < batches; i++) {
    const batchSize = Math.min(concurrency, totalRequests - (i * concurrency));
    const promises = [];
    
    for (let j = 0; j < batchSize; j++) {
      promises.push(makeRequest(`${baseUrl}/sort`));
    }
    
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
    
    // Progress indicator
    const progress = Math.round(((i + 1) / batches) * 100);
    process.stdout.write(`\r   Progress: ${progress}% (${results.length}/${totalRequests})`);
  }
  
  console.log(); // New line after progress
  
  // Analyze results
  const successfulRequests = results.filter(r => r.success);
  const failedRequests = results.filter(r => !r.success);
  
  const responseTimes = successfulRequests.map(r => r.responseTime);
  const processingTimes = successfulRequests.map(r => r.processingTime);
  
  const avgResponseTime = responseTimes.length > 0 
    ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
    : 0;
  
  const avgProcessingTime = processingTimes.length > 0
    ? Math.round(processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length)
    : 0;
  
  const maxResponseTime = responseTimes.length > 0 ? Math.max(...responseTimes) : 0;
  const minResponseTime = responseTimes.length > 0 ? Math.min(...responseTimes) : 0;
  
  // Calculate percentiles
  const sortedTimes = responseTimes.sort((a, b) => a - b);
  const p50 = sortedTimes[Math.floor(sortedTimes.length * 0.5)] || 0;
  const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)] || 0;
  const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)] || 0;
  
  // Calculate requests per second
  const totalTime = Math.max(...results.map(r => r.responseTime));
  const requestsPerSecond = successfulRequests.length / (totalTime / 1000);
  
  console.log(`📊 Results for ${backendName}:`);
  console.log(`   ✅ Successful: ${successfulRequests.length}/${totalRequests} (${(successfulRequests.length/totalRequests*100).toFixed(1)}%)`);
  console.log(`   ❌ Failed: ${failedRequests.length} (${failedRequests.map(r => r.error).join(', ')})`);
  console.log(`   ⏱️  Response Time - Avg: ${avgResponseTime}ms, Min: ${minResponseTime}ms, Max: ${maxResponseTime}ms`);
  console.log(`   📈 Percentiles - P50: ${p50}ms, P95: ${p95}ms, P99: ${p99}ms`);
  console.log(`   ⚡ Processing Time - Avg: ${avgProcessingTime}ms`);
  console.log(`   🚀 Throughput: ${requestsPerSecond.toFixed(1)} requests/second`);
  
  return {
    backend: backendName,
    successRate: successfulRequests.length / totalRequests,
    avgResponseTime,
    avgProcessingTime,
    p95,
    requestsPerSecond,
    errors: failedRequests.map(r => r.error)
  };
}

async function compareLoadTest() {
  console.log('🔥 Backend Load Test Comparison');
  console.log('=================================');
  
  // Test both backends
  const nodeResults = await runLoadTest('Node.js (Express)', NODEJS_URL);
  const pythonResults = await runLoadTest('Python (FastAPI)', PYTHON_URL);
  
  console.log(`\n🏁 Load Test Comparison`);
  console.log('=' .repeat(40));
  
  // Compare metrics
  console.log(`📊 Performance Comparison:`);
  
  const successRateDiff = ((pythonResults.successRate - nodeResults.successRate) * 100).toFixed(1);
  const responseTimeImprovement = ((nodeResults.avgResponseTime - pythonResults.avgResponseTime) / nodeResults.avgResponseTime * 100).toFixed(1);
  const throughputImprovement = ((pythonResults.requestsPerSecond - nodeResults.requestsPerSecond) / nodeResults.requestsPerSecond * 100).toFixed(1);
  
  console.log(`   Success Rate:`);
  console.log(`     Node.js: ${(nodeResults.successRate * 100).toFixed(1)}%`);
  console.log(`     Python:  ${(pythonResults.successRate * 100).toFixed(1)}%`);
  console.log(`     Difference: ${successRateDiff}%`);
  
  console.log(`   Average Response Time:`);
  console.log(`     Node.js: ${nodeResults.avgResponseTime}ms`);
  console.log(`     Python:  ${pythonResults.avgResponseTime}ms`);
  console.log(`     Improvement: ${responseTimeImprovement}% ${pythonResults.avgResponseTime < nodeResults.avgResponseTime ? '🏆' : '📉'}`);
  
  console.log(`   Throughput ( RPS):`);
  console.log(`     Node.js: ${nodeResults.requestsPerSecond.toFixed(1)}`);
  console.log(`     Python:  ${pythonResults.requestsPerSecond.toFixed(1)}`);
  console.log(`     Improvement: ${throughputImprovement}% ${pythonResults.requestsPerSecond > nodeResults.requestsPerSecond ? '🏆' : '📉'}`);
  
  console.log(`   P95 Response Time:`);
  console.log(`     Node.js: ${nodeResults.p95}ms`);
  console.log(`     Python:  ${pythonResults.p95}ms`);
  
  // Determine winner
  console.log(`\n🏆 Load Test Winner:`);
  
  let nodeScore = 0;
  let pythonScore = 0;
  
  if (pythonResults.successRate > nodeResults.successRate) pythonScore++;
  else if (nodeResults.successRate > pythonResults.successRate) nodeScore++;
  
  if (pythonResults.avgResponseTime < nodeResults.avgResponseTime) pythonScore++;
  else if (nodeResults.avgResponseTime < pythonResults.avgResponseTime) nodeScore++;
  
  if (pythonResults.requestsPerSecond > nodeResults.requestsPerSecond) pythonScore++;
  else if (nodeResults.requestsPerSecond > pythonResults.requestsPerSecond) nodeScore++;
  
  if (pythonResults.p95 < nodeResults.p95) pythonScore++;
  else if (nodeResults.p95 < pythonResults.p95) nodeScore++;
  
  if (pythonScore > nodeScore) {
    console.log(`   🐍 Python (FastAPI) wins ${pythonScore}-${nodeScore}!`);
  } else if (nodeScore > pythonScore) {
    console.log(`   🟢 Node.js (Express) wins ${nodeScore}-${pythonScore}!`);
  } else {
    console.log(`   🤝 It's a tie ${nodeScore}-${pythonScore}!`);
  }
  
  // Recommendations
  console.log(`\n💡 Recommendations:`);
  
  if (pythonResults.successRate < 0.95) {
    console.log(`   ⚠️  Python backend has reliability issues - investigate failures`);
  }
  
  if (nodeResults.avgResponseTime > pythonResults.avgResponseTime * 1.5) {
    console.log(`   ✅ Python shows significant performance advantage - recommended for migration`);
  } else if (pythonResults.avgResponseTime < nodeResults.avgResponseTime * 0.8) {
    console.log(`   🤔 Node.js performs better - reconsider migration strategy`);
  } else {
    console.log(`   📊 Performance is similar - consider other factors ( maintainability, features)`);
  }
  
  if (Math.max(nodeResults.p95, pythonResults.p95) > 5000) {
    console.log(`   ⚠️  High P95 response times detected - optimize for production`);
  }
  
  return { nodeResults, pythonResults };
}

async function checkServices() {
  console.log('🔍 Checking Service Availability');
  console.log('=' .repeat(40));
  
  const services = [
    { name: 'Node.js Backend', url: NODEJS_URL },
    { name: 'Python Backend', url: PYTHON_URL }
  ];
  
  let allAvailable = true;
  
  for (const service of services) {
    try {
      const response = await makeRequest(`${service.url}/health`);
      if (response.statusCode === 200) {
        console.log(`   ✅ ${service.name}: Available`);
      } else {
        console.log(`   ❌ ${service.name}: HTTP ${response.statusCode}`);
        allAvailable = false;
      }
    } catch (error) {
      console.log(`   ❌ ${service.name}: Not available`);
      allAvailable = false;
    }
  }
  
  if (!allAvailable) {
    console.log(`\n💡 Start services first:`);
    console.log(`   make start-test`);
    process.exit(1);
  }
}

// Main execution
async function main() {
  await checkServices();
  await compareLoadTest();
  console.log(`\n🏁 Load testing completed!`);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { runLoadTest, compareLoadTest };

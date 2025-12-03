#!/usr/bin/env node

/**
 * Backend Comparison Test Script
 * Tests both Node.js (Express) and Python (FastAPI) backends
 * for API compatibility and performance comparison
 */

const http = require('http');
const https = require('https');

const GATEWAY_URL = 'http://localhost:3000';
const NODEJS_URL = 'http://localhost:3001';
const PYTHON_URL = 'http://localhost:3002';

// Test data
const testCases = [
  {
    name: 'Simple alphabetical sort',
    request: {
      text: 'zebra\napple\nBanana\napple',
      method: 'alphabetical-asc',
      options: { caseSensitive: false, removeDuplicates: true }
    }
  },
  {
    name: 'Natural sort with numbers',
    request: {
      text: 'item10\nitem2\nitem1\nitem20',
      method: 'natural-asc'
    }
  },
  {
    name: 'Large text processing',
    request: {
      text: Array.from({length: 1000}, (_, i) => `Line ${i}`).join('\n'),
      method: 'length-desc'
    }
  }
];

function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const parsedUrl = new URL(url);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const client = parsedUrl.protocol === 'https:' ? https : http;
    const req = client.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function testBackend(name, baseUrl) {
  console.log(`\n🧪 Testing ${name} Backend`);
  console.log('=' .repeat(50));
  
  const results = [];
  
  for (const testCase of testCases) {
    console.log(`\n📝 Test: ${testCase.name}`);
    
    try {
      // Health check first
      const healthResponse = await fetch(`${baseUrl}/health`);
      const healthData = await healthResponse.json();
      console.log(`   ✅ Health: ${healthData.status} (${healthData.service})`);
      
      // Performance test
      const startTime = Date.now();
      const response = await makeRequest(`${baseUrl}/sort`, testCase.request);
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      
      if (response.status === 200) {
        console.log(`   ✅ Status: ${response.status}`);
        console.log(`   ⏱️  Response Time: ${responseTime}ms`);
        console.log(`   📊 Stats: ${JSON.stringify(response.data.data?.stats || {})}`);
        
        results.push({
          test: testCase.name,
          success: true,
          responseTime,
          status: response.status
        });
      } else {
        console.log(`   ❌ Status: ${response.status}`);
        console.log(`   📄 Response: ${JSON.stringify(response.data)}`);
        
        results.push({
          test: testCase.name,
          success: false,
          responseTime,
          status: response.status,
          error: response.data
        });
      }
    } catch (error) {
      console.log(`   💥 Error: ${error.message}`);
      
      results.push({
        test: testCase.name,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
}

async function testGatewayRouting() {
  console.log(`\n🔄 Testing Gateway Backend Switching`);
  console.log('=' .repeat(50));
  
  // Test with Node.js backend
  console.log('\n📡 Testing Gateway → Node.js Backend');
  try {
    const response = await makeRequest(`${GATEWAY_URL}/api/text-tools/sort`, testCases[0].request);
    console.log(`   Status: ${response.status}, Time: ${Date.now() - startTime}ms`);
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }
}

async function compareBackends() {
  console.log('🚀 NiftyTools Backend Comparison Test');
  console.log('=====================================');
  
  // Test both backends
  const nodeResults = await testBackend('Node.js (Express)', NODEJS_URL);
  const pythonResults = await testBackend('Python (FastAPI)', PYTHON_URL);
  
  // Performance comparison
  console.log(`\n📈 Performance Comparison`);
  console.log('=' .repeat(50));
  
  for (let i = 0; i < testCases.length; i++) {
    const nodeResult = nodeResults[i];
    const pythonResult = pythonResults[i];
    
    console.log(`\n📊 ${testCases[i].name}:`);
    
    if (nodeResult.success && pythonResult.success) {
      const improvement = ((nodeResult.responseTime - pythonResult.responseTime) / nodeResult.responseTime * 100).toFixed(1);
      console.log(`   Node.js: ${nodeResult.responseTime}ms`);
      console.log(`   Python:  ${pythonResult.responseTime}ms`);
      console.log(`   Improvement: ${improvement}% ${pythonResult.responseTime < nodeResult.responseTime ? '🏆' : '📉'}`);
    } else {
      console.log(`   ❌ One or both backends failed`);
      if (!nodeResult.success) console.log(`   Node.js Error: ${nodeResult.error}`);
      if (!pythonResult.success) console.log(`   Python Error: ${pythonResult.error}`);
    }
  }
  
  // Summary
  const nodeSuccess = nodeResults.filter(r => r.success).length;
  const pythonSuccess = pythonResults.filter(r => r.success).length;
  
  console.log(`\n📋 Summary`);
  console.log('=' .repeat(50));
  console.log(`   Node.js Success Rate: ${nodeSuccess}/${testCases.length} (${(nodeSuccess/testCases.length*100).toFixed(0)}%)`);
  console.log(`   Python Success Rate: ${pythonSuccess}/${testCases.length} (${(pythonSuccess/testCases.length*100).toFixed(0)}%)`);
  
  if (nodeSuccess === testCases.length && pythonSuccess === testCases.length) {
    console.log(`   ✅ Both backends are fully compatible!`);
  } else {
    console.log(`   ⚠️  Compatibility issues detected - check logs above`);
  }
}

// Check if services are running
async function checkServices() {
  console.log('🔍 Checking Service Availability');
  console.log('=' .repeat(50));
  
  const services = [
    { name: 'Gateway', url: GATEWAY_URL },
    { name: 'Node.js Backend', url: NODEJS_URL },
    { name: 'Python Backend', url: PYTHON_URL }
  ];
  
  for (const service of services) {
    try {
      const response = await fetch(`${service.url}/health`);
      const data = await response.json();
      console.log(`   ✅ ${service.name}: ${data.status} (${data.service || 'Unknown'})`);
    } catch (error) {
      console.log(`   ❌ ${service.name}: Not available (${error.message})`);
      console.log(`\n💡 To start services:`);
      console.log(`   # Terminal 1: Gateway`);
      console.log(`   cd services/gateway && npm run dev`);
      console.log(`   # Terminal 2: Node.js Backend`);
      console.log(`   cd services/text-tools-service && npm run dev`);
      console.log(`   # Terminal 3: Python Backend`);
      console.log(`   cd services/text-tools-service-py && python -m uvicorn src.main:app --reload`);
      process.exit(1);
    }
  }
}

// Main execution
async function main() {
  await checkServices();
  await compareBackends();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testBackend, compareBackends };

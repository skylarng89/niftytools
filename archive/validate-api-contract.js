#!/usr/bin/env node

/**
 * API Contract Validation Script
 * Ensures both Node.js and Python backends return identical responses
 * Validates JSON structure, field names, and data types
 */

const http = require('http');

const NODEJS_URL = 'http://localhost:3001';
const PYTHON_URL = 'http://localhost:3002';

// Test cases covering all API endpoints
const testCases = [
  {
    name: 'Health Check',
    endpoint: '/health',
    method: 'GET',
    expectedFields: ['status', 'service', 'timestamp']
  },
  {
    name: 'Sort Text - Alphabetical ASC',
    endpoint: '/sort',
    method: 'POST',
    body: {
      text: 'zebra\napple\nBanana\napple',
      method: 'alphabetical-asc',
      options: { caseSensitive: false, removeDuplicates: true }
    },
    expectedFields: ['original_text', 'processed_text', 'method', 'stats']
  },
  {
    name: 'Sort Text - Natural Sort',
    endpoint: '/sort',
    method: 'POST',
    body: {
      text: 'item10\nitem2\nitem1\nitem20',
      method: 'natural-asc'
    },
    expectedFields: ['original_text', 'processed_text', 'method', 'stats']
  },
  {
    name: 'Sort Text - Length Sort',
    endpoint: '/sort',
    method: 'POST',
    body: {
      text: 'short\nmedium length\nvery long line\nx',
      method: 'length-asc'
    },
    expectedFields: ['original_text', 'processed_text', 'method', 'stats']
  },
  {
    name: 'Root Endpoint',
    endpoint: '/',
    method: 'GET',
    expectedFields: ['service', 'version', 'framework', 'endpoints']
  }
];

function makeRequest(url, method, body) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    
    let postData = '';
    if (body && method === 'POST') {
      postData = JSON.stringify(body);
    }

    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData && { 'Content-Length': Buffer.byteLength(postData) })
      }
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseBody);
          resolve({ 
            status: res.statusCode, 
            data: parsed, 
            headers: res.headers,
            raw: responseBody 
          });
        } catch (e) {
          resolve({ 
            status: res.statusCode, 
            data: responseBody, 
            headers: res.headers,
            parseError: e.message 
          });
        }
      });
    });

    req.on('error', reject);
    
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

function validateResponseStructure(response, expectedFields, testName) {
  const errors = [];
  
  if (typeof response !== 'object' || response === null) {
    errors.push(`Response is not an object: ${typeof response}`);
    return errors;
  }

  // Check expected fields exist
  for (const field of expectedFields) {
    if (!(field in response)) {
      errors.push(`Missing field: ${field}`);
    }
  }

  // Check for unexpected fields (warn only)
  const actualFields = Object.keys(response);
  const unexpectedFields = actualFields.filter(field => !expectedFields.includes(field));
  if (unexpectedFields.length > 0) {
    console.log(`   ⚠️  Unexpected fields: ${unexpectedFields.join(', ')}`);
  }

  return errors;
}

function compareResponses(nodeResponse, pythonResponse, testCase) {
  console.log(`\n🔍 Comparing responses for: ${testCase.name}`);
  console.log('=' .repeat(60));
  
  const issues = [];

  // Compare status codes
  if (nodeResponse.status !== pythonResponse.status) {
    issues.push(`Status code mismatch: Node.js=${nodeResponse.status}, Python=${pythonResponse.status}`);
  }

  // Check for parse errors
  if (nodeResponse.parseError) {
    issues.push(`Node.js parse error: ${nodeResponse.parseError}`);
  }
  if (pythonResponse.parseError) {
    issues.push(`Python parse error: ${pythonResponse.parseError}`);
  }

  // Validate structure
  const nodeErrors = validateResponseStructure(nodeResponse.data, testCase.expectedFields, 'Node.js');
  const pythonErrors = validateResponseStructure(pythonResponse.data, testCase.expectedFields, 'Python');

  issues.push(...nodeErrors.map(err => `Node.js: ${err}`));
  issues.push(...pythonErrors.map(err => `Python: ${err}`));

  // If both responses are valid objects, compare content
  if (nodeResponse.status === 200 && pythonResponse.status === 200 && 
      typeof nodeResponse.data === 'object' && typeof pythonResponse.data === 'object') {
    
    // Compare field by field
    for (const field of testCase.expectedFields) {
      const nodeValue = nodeResponse.data[field];
      const pythonValue = pythonResponse.data[field];

      if (JSON.stringify(nodeValue) !== JSON.stringify(pythonValue)) {
        issues.push(`Field '${field}' mismatch:`);
        issues.push(`  Node.js: ${JSON.stringify(nodeValue)}`);
        issues.push(`  Python:  ${JSON.stringify(pythonValue)}`);
      }
    }

    // Special validation for specific endpoints
    if (testCase.endpoint === '/sort') {
      // Validate stats structure
      const nodeStats = nodeResponse.data.stats;
      const pythonStats = pythonResponse.data.stats;
      
      const statsFields = ['original_lines', 'processed_lines', 'processing_time'];
      for (const field of statsFields) {
        if (typeof nodeStats[field] !== typeof pythonStats[field]) {
          issues.push(`Stats field '${field}' type mismatch: Node.js=${typeof nodeStats[field]}, Python=${typeof pythonStats[field]}`);
        }
      }

      // Validate processing_time is reasonable
      if (pythonStats.processing_time > 10000) { // 10 seconds
        issues.push(`Python processing time too high: ${pythonStats.processing_time}ms`);
      }
      if (nodeStats.processing_time > 10000) {
        issues.push(`Node.js processing time too high: ${nodeStats.processing_time}ms`);
      }
    }
  }

  // Print results
  if (issues.length === 0) {
    console.log(`   ✅ Responses are identical`);
    return true;
  } else {
    console.log(`   ❌ Found ${issues.length} issues:`);
    issues.forEach(issue => console.log(`     - ${issue}`));
    return false;
  }
}

async function validateApiContract() {
  console.log('🔒 API Contract Validation');
  console.log('==========================');
  console.log('Validating that both backends return identical responses...\n');

  let allTestsPassed = true;

  for (const testCase of testCases) {
    try {
      console.log(`🧪 Testing: ${testCase.name}`);

      // Make requests to both backends
      const nodePromise = makeRequest(
        `${NODEJS_URL}${testCase.endpoint}`, 
        testCase.method, 
        testCase.body
      );
      
      const pythonPromise = makeRequest(
        `${PYTHON_URL}${testCase.endpoint}`, 
        testCase.method, 
        testCase.body
      );

      const [nodeResponse, pythonResponse] = await Promise.all([nodePromise, pythonPromise]);

      // Compare responses
      const testPassed = compareResponses(nodeResponse, pythonResponse, testCase);
      allTestsPassed = allTestsPassed && testPassed;

    } catch (error) {
      console.log(`   💥 Test failed with error: ${error.message}`);
      allTestsPassed = false;
    }
  }

  // Summary
  console.log(`\n📋 Validation Summary`);
  console.log('=' .repeat(30));
  
  if (allTestsPassed) {
    console.log(`   ✅ All tests passed! API contracts are identical.`);
    console.log(`   🎉 The FastAPI migration maintains full compatibility.`);
  } else {
    console.log(`   ❌ Some tests failed. Review the issues above.`);
    console.log(`   ⚠️  Do not migrate to production until these are resolved.`);
  }

  return allTestsPassed;
}

async function checkServiceAvailability() {
  console.log('🔍 Checking Service Availability');
  console.log('=' .repeat(40));

  const services = [
    { name: 'Node.js Backend', url: NODEJS_URL },
    { name: 'Python Backend', url: PYTHON_URL }
  ];

  let allAvailable = true;

  for (const service of services) {
    try {
      const response = await makeRequest(`${service.url}/health`, 'GET');
      if (response.status === 200) {
        console.log(`   ✅ ${service.name}: Available (${response.data.service})`);
      } else {
        console.log(`   ❌ ${service.name}: HTTP ${response.status}`);
        allAvailable = false;
      }
    } catch (error) {
      console.log(`   ❌ ${service.name}: Not available (${error.message})`);
      allAvailable = false;
    }
  }

  if (!allAvailable) {
    console.log(`\n💡 Start services first:`);
    console.log(`   make start-test`);
    console.log(`   or: ./scripts/quick-test.sh start`);
    process.exit(1);
  }
}

// Main execution
async function main() {
  await checkServiceAvailability();
  const success = await validateApiContract();
  
  console.log(`\n🏁 Validation completed.`);
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { validateApiContract, compareResponses };

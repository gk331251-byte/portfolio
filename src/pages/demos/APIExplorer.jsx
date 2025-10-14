import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Plus, X, Code, Zap, Copy, Loader2, AlertCircle, CheckCircle, XCircle, Check, Clock, Info, Trash2, Globe, FileCode, Sparkles, Shield, List } from 'lucide-react';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { trackAPIRequest, trackCodeCopied, trackExampleClicked, trackPageView } from '../../utils/analytics';

const APIExplorer = () => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState([
    { key: '', value: '' },
    { key: '', value: '' }
  ]);
  const [body, setBody] = useState('{\n  "key": "value"\n}');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [jsonError, setJsonError] = useState(null);
  const [activeTab, setActiveTab] = useState('curl');
  const [responseTab, setResponseTab] = useState('body');
  const [copied, setCopied] = useState(false);
  const [showCorsInfo, setShowCorsInfo] = useState(false);

  const methods = [
    { value: 'GET', color: 'bg-green-500' },
    { value: 'POST', color: 'bg-blue-500' },
    { value: 'PUT', color: 'bg-orange-500' },
    { value: 'DELETE', color: 'bg-red-500' },
    { value: 'PATCH', color: 'bg-yellow-500' }
  ];

  const examples = [
    {
      name: 'GitHub User API',
      method: 'GET',
      endpoint: 'https://api.github.com/users/octocat',
      description: 'Fetch public GitHub user profile'
    },
    {
      name: 'JSONPlaceholder Posts',
      method: 'GET',
      endpoint: 'https://jsonplaceholder.typicode.com/posts/1',
      description: 'Test REST API with fake data'
    },
    {
      name: 'REST Countries',
      method: 'GET',
      endpoint: 'https://restcountries.com/v3.1/name/canada',
      description: 'Get country information'
    },
    {
      name: 'Random Dog Image',
      method: 'GET',
      endpoint: 'https://dog.ceo/api/breeds/image/random',
      description: 'Random dog picture API'
    },
    {
      name: 'Random User',
      method: 'GET',
      endpoint: 'https://randomuser.me/api/',
      description: 'Generate random user data'
    }
  ];

  const codeLanguages = [
    { id: 'curl', name: 'cURL' },
    { id: 'python', name: 'Python' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'nodejs', name: 'Node.js' },
    { id: 'ruby', name: 'Ruby' }
  ];

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index, field, value) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const getMethodColor = (methodName) => {
    const method = methods.find(m => m.value === methodName);
    return method ? method.color : 'bg-gray-500';
  };

  const loadExample = (example) => {
    setMethod(example.method);
    setUrl(example.endpoint);
    setHeaders([
      { key: '', value: '' },
      { key: '', value: '' }
    ]);
    setBody('{\n  "key": "value"\n}');
    setError(null);
    setJsonError(null);
    setResponse(null);
    trackExampleClicked(example.name);
  };

  const clearForm = () => {
    setMethod('GET');
    setUrl('');
    setHeaders([
      { key: '', value: '' },
      { key: '', value: '' }
    ]);
    setBody('{\n  "key": "value"\n}');
    setError(null);
    setJsonError(null);
    setResponse(null);
    setActiveTab('curl');
    setResponseTab('body');
  };

  const validateJson = () => {
    if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
      try {
        JSON.parse(body);
        setJsonError(null);
      } catch (e) {
        setJsonError('Invalid JSON format');
      }
    }
  };

  const handleSendRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    const startTime = Date.now();

    try {
      // Filter out empty headers
      const validHeaders = headers
        .filter(h => h.key && h.value)
        .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});

      // Parse body if present
      let parsedBody = null;
      if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
        try {
          parsedBody = JSON.parse(body);
        } catch (e) {
          throw new Error('Invalid JSON in request body');
        }
      }

      // Make request
      const axiosResponse = await axios({
        method: method.toLowerCase(),
        url: url.trim(),
        headers: validHeaders,
        data: parsedBody,
        timeout: 30000
      });

      const timing = Date.now() - startTime;

      const responseData = {
        status: axiosResponse.status,
        statusText: axiosResponse.statusText,
        headers: axiosResponse.headers,
        data: axiosResponse.data,
        timing: timing
      };

      setResponse(responseData);
      console.log('Response:', responseData);

      // Track successful API request
      trackAPIRequest(method, url, axiosResponse.status, timing, true);

      // Scroll to response section
      setTimeout(() => {
        document.querySelector('#response-section')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);

    } catch (err) {
      const timing = Date.now() - startTime;

      if (err.response) {
        // Server responded with error
        const errorResponse = {
          status: err.response.status,
          statusText: err.response.statusText,
          headers: err.response.headers,
          data: err.response.data,
          timing: timing
        };
        setResponse(errorResponse);
        console.log('Error Response:', errorResponse);

        // Track failed API request
        trackAPIRequest(method, url, err.response.status, timing, false);
      } else if (err.message.includes('JSON')) {
        setError('Invalid JSON in request body. Check for missing quotes or commas.');
      } else if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setError('Request timed out after 30 seconds. The API might be slow or down. Try again or use a different endpoint.');
      } else if (err.message.includes('Network Error')) {
        setError('Could not reach the API. Check your internet connection or verify the URL is correct.');
      } else {
        // CORS error or other network issue
        setError('This API does not allow browser requests (CORS policy). Try using the generated code from a backend server instead.');
        setShowCorsInfo(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const isFormValid = url.trim() && isValidUrl(url.trim()) && !loading;

  // Formatting utilities
  const formatJSON = (data) => {
    return JSON.stringify(data, null, 2);
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'bg-green-500';
    if (status >= 300 && status < 400) return 'bg-yellow-500';
    if (status >= 400 && status < 500) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStatusIcon = (status) => {
    if (status >= 200 && status < 300) return <CheckCircle size={20} />;
    return <XCircle size={20} />;
  };

  const formatHeaders = (headers) => {
    if (!headers) return [];
    return Object.entries(headers).map(([key, value]) => ({ key, value }));
  };

  const copyToClipboard = async (text, language) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (language) {
        trackCodeCopied(language);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Code generation utilities
  const generateCurl = (method, url, headers, body) => {
    const validHeaders = headers.filter(h => h.key && h.value);
    let code = `curl -X ${method} \\\n  '${url}'`;

    if (validHeaders.length > 0) {
      validHeaders.forEach(h => {
        code += ` \\\n  -H '${h.key}: ${h.value}'`;
      });
    }

    if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
      code += ` \\\n  -d '${body.replace(/'/g, "\\'")}'`;
    }

    return code;
  };

  const generatePython = (method, url, headers, body) => {
    const validHeaders = headers.filter(h => h.key && h.value);
    let code = `import requests\nimport json\n\n`;
    code += `url = '${url}'\n\n`;

    if (validHeaders.length > 0) {
      code += `headers = {\n`;
      validHeaders.forEach((h, i) => {
        code += `  '${h.key}': '${h.value}'${i < validHeaders.length - 1 ? ',' : ''}\n`;
      });
      code += `}\n\n`;
    }

    if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
      code += `data = ${body}\n\n`;
    }

    code += `response = requests.${method.toLowerCase()}(\n`;
    code += `  url`;
    if (validHeaders.length > 0) {
      code += `,\n  headers=headers`;
    }
    if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
      code += `,\n  json=data`;
    }
    code += `\n)\n\n`;
    code += `if response.status_code >= 200 and response.status_code < 300:\n`;
    code += `    print('Success!')\n`;
    code += `    print(json.dumps(response.json(), indent=2))\n`;
    code += `else:\n`;
    code += `    print(f'Error: {response.status_code}')\n`;
    code += `    print(response.text)`;

    return code;
  };

  const generateJavaScript = (method, url, headers, body) => {
    const validHeaders = headers.filter(h => h.key && h.value);
    let code = `const url = '${url}';\n\n`;

    if (validHeaders.length > 0) {
      code += `const headers = {\n`;
      validHeaders.forEach((h, i) => {
        code += `  '${h.key}': '${h.value}'${i < validHeaders.length - 1 ? ',' : ''}\n`;
      });
      code += `};\n\n`;
    }

    if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
      code += `const body = ${body};\n\n`;
    }

    code += `fetch(url, {\n`;
    code += `  method: '${method}'`;
    if (validHeaders.length > 0) {
      code += `,\n  headers: headers`;
    }
    if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
      code += `,\n  body: JSON.stringify(body)`;
    }
    code += `\n})\n`;
    code += `  .then(response => {\n`;
    code += `    if (!response.ok) {\n`;
    code += `      throw new Error(\`HTTP error! status: \${response.status}\`);\n`;
    code += `    }\n`;
    code += `    return response.json();\n`;
    code += `  })\n`;
    code += `  .then(data => {\n`;
    code += `    console.log('Success:', data);\n`;
    code += `  })\n`;
    code += `  .catch(error => {\n`;
    code += `    console.error('Error:', error);\n`;
    code += `  });`;

    return code;
  };

  const generateNodeJS = (method, url, headers, body) => {
    const validHeaders = headers.filter(h => h.key && h.value);
    let code = `const axios = require('axios');\n\n`;
    code += `const config = {\n`;
    code += `  method: '${method.toLowerCase()}',\n`;
    code += `  url: '${url}'`;

    if (validHeaders.length > 0) {
      code += `,\n  headers: {\n`;
      validHeaders.forEach((h, i) => {
        code += `    '${h.key}': '${h.value}'${i < validHeaders.length - 1 ? ',' : ''}\n`;
      });
      code += `  }`;
    }

    if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
      code += `,\n  data: ${body}`;
    }

    code += `\n};\n\n`;
    code += `axios(config)\n`;
    code += `  .then(response => {\n`;
    code += `    console.log('Status:', response.status);\n`;
    code += `    console.log('Data:', JSON.stringify(response.data, null, 2));\n`;
    code += `  })\n`;
    code += `  .catch(error => {\n`;
    code += `    if (error.response) {\n`;
    code += `      console.log('Error Status:', error.response.status);\n`;
    code += `      console.log('Error Data:', error.response.data);\n`;
    code += `    } else {\n`;
    code += `      console.log('Error:', error.message);\n`;
    code += `    }\n`;
    code += `  });`;

    return code;
  };

  const generateRuby = (method, url, headers, body) => {
    const validHeaders = headers.filter(h => h.key && h.value);
    let code = `require 'net/http'\nrequire 'json'\n\n`;
    code += `url = URI('${url}')\n\n`;
    code += `http = Net::HTTP.new(url.host, url.port)\n`;
    code += `http.use_ssl = true if url.scheme == 'https'\n\n`;
    code += `request = Net::HTTP::${method.charAt(0) + method.slice(1).toLowerCase()}.new(url)\n\n`;

    if (validHeaders.length > 0) {
      code += `# Headers\n`;
      validHeaders.forEach(h => {
        code += `request['${h.key}'] = '${h.value}'\n`;
      });
      code += `\n`;
    }

    if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
      code += `# Body\n`;
      code += `request.body = '${body.replace(/'/g, "\\'")}'\n\n`;
    }

    code += `response = http.request(request)\n\n`;
    code += `if response.code.to_i >= 200 && response.code.to_i < 300\n`;
    code += `  puts 'Success!'\n`;
    code += `  puts JSON.pretty_generate(JSON.parse(response.body))\n`;
    code += `else\n`;
    code += `  puts "Error: #{response.code}"\n`;
    code += `  puts response.body\n`;
    code += `end`;

    return code;
  };

  const generateCode = (method, url, headers, body) => {
    return {
      curl: generateCurl(method, url, headers, body),
      python: generatePython(method, url, headers, body),
      javascript: generateJavaScript(method, url, headers, body),
      nodejs: generateNodeJS(method, url, headers, body),
      ruby: generateRuby(method, url, headers, body)
    };
  };

  const getLanguageForSyntaxHighlighter = (lang) => {
    if (lang === 'curl') return 'bash';
    if (lang === 'nodejs') return 'javascript';
    return lang;
  };

  // Track page view on mount
  useEffect(() => {
    trackPageView('API Explorer');
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-primary dark:text-secondary hover:opacity-80 mb-8"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Home</span>
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-primary dark:bg-secondary text-white dark:text-dark-bg rounded-full text-sm font-semibold animate-pulse">
              ⚡ Live Interactive Tool - Try It Now
            </span>
          </div>
          <h1 className="text-5xl font-bold mb-6 text-light-text dark:text-dark-text">
            Interactive API Explorer & Code Generator
          </h1>
          <p className="text-2xl mb-6 text-neutral">
            Test any REST API and generate production-ready code in 5 languages
          </p>
          <p className="text-lg text-neutral max-w-3xl mx-auto mb-8">
            Send real HTTP requests from your browser and get instant, copy-paste ready code examples.
            No authentication required - perfect for testing public APIs.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['React', 'Axios', 'REST APIs', 'Code Generation', 'Monaco Editor'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary font-medium border border-primary/30 dark:border-secondary/30"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-light-text dark:text-dark-text">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-8 shadow-lg border border-neutral/20">
              <div className="w-12 h-12 bg-primary dark:bg-secondary rounded-full flex items-center justify-center text-white dark:text-dark-bg font-bold text-xl mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-3 text-light-text dark:text-dark-text">
                Configure Request
              </h3>
              <p className="text-neutral">
                Enter your API endpoint, select HTTP method, add headers, and configure the request body if needed.
              </p>
            </div>
            <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-8 shadow-lg border border-neutral/20">
              <div className="w-12 h-12 bg-primary dark:bg-secondary rounded-full flex items-center justify-center text-white dark:text-dark-bg font-bold text-xl mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-3 text-light-text dark:text-dark-text">
                Send & View Response
              </h3>
              <p className="text-neutral">
                Click send to execute the request and see the live response with status code, headers, and JSON body.
              </p>
            </div>
            <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-8 shadow-lg border border-neutral/20">
              <div className="w-12 h-12 bg-primary dark:bg-secondary rounded-full flex items-center justify-center text-white dark:text-dark-bg font-bold text-xl mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-3 text-light-text dark:text-dark-text">
                Generate Code
              </h3>
              <p className="text-neutral">
                Instantly get production-ready code snippets in cURL, Python, JavaScript, Node.js, or Ruby.
              </p>
            </div>
          </div>
        </section>

        {/* Features Callout Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 dark:from-primary/20 dark:via-secondary/20 dark:to-accent/20 rounded-xl p-8 border border-primary/20 dark:border-secondary/20">
            <h2 className="text-2xl font-bold text-center mb-8 text-light-text dark:text-dark-text flex items-center justify-center">
              <Sparkles className="mr-3" size={28} />
              Why Use This Tool?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary dark:bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe size={32} className="text-white dark:text-dark-bg" />
                </div>
                <h3 className="font-bold text-light-text dark:text-dark-text mb-2">Live API Testing</h3>
                <p className="text-sm text-neutral">Test real APIs directly in your browser without any setup</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent dark:bg-accent-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileCode size={32} className="text-white dark:text-dark-bg" />
                </div>
                <h3 className="font-bold text-light-text dark:text-dark-text mb-2">5 Language Support</h3>
                <p className="text-sm text-neutral">Generate production-ready code in cURL, Python, JS, Node.js & Ruby</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary dark:bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code size={32} className="text-white dark:text-dark-bg" />
                </div>
                <h3 className="font-bold text-light-text dark:text-dark-text mb-2">Syntax Highlighting</h3>
                <p className="text-sm text-neutral">Beautiful code display with VS Code-style syntax highlighting</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent dark:bg-accent-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield size={32} className="text-white dark:text-dark-bg" />
                </div>
                <h3 className="font-bold text-light-text dark:text-dark-text mb-2">Error Handling</h3>
                <p className="text-sm text-neutral">All generated code includes proper error handling & best practices</p>
              </div>
            </div>
          </div>
        </section>

        {/* CORS Information Section */}
        <section className="mb-16">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 rounded-lg">
            <div className="flex items-start">
              <Info className="text-yellow-600 dark:text-yellow-400 mr-3 flex-shrink-0 mt-1" size={24} />
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-300 mb-2">
                  About CORS (Cross-Origin Resource Sharing)
                </h3>
                <p className="text-yellow-700 dark:text-yellow-200 mb-3">
                  Some APIs block browser requests for security reasons. If you get a network error, the API might not allow CORS.
                </p>
                <button
                  onClick={() => setShowCorsInfo(!showCorsInfo)}
                  className="text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100 font-semibold flex items-center transition-colors"
                >
                  {showCorsInfo ? 'Hide Details' : 'Learn More'}
                  <ArrowLeft className={`ml-2 transform transition-transform ${showCorsInfo ? 'rotate-90' : '-rotate-90'}`} size={16} />
                </button>
                {showCorsInfo && (
                  <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-800 dark:text-yellow-200">
                    <p className="mb-3">
                      <strong>What is CORS?</strong> It's a browser security feature that prevents websites from making requests to different domains without permission.
                    </p>
                    <p className="mb-3">
                      <strong>Why does this matter?</strong> When you test an API from this browser tool, you might encounter CORS errors if the API doesn't explicitly allow browser requests.
                    </p>
                    <p className="mb-3">
                      <strong>Solution:</strong> Use the generated code snippets (Python, Node.js, etc.) to call the API from a backend server instead. Server-to-server requests don't have CORS restrictions.
                    </p>
                    <p>
                      <strong>Public APIs that work:</strong> All the example APIs above are CORS-enabled and safe to test directly in your browser!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Examples Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4 text-light-text dark:text-dark-text">
            Try These Public APIs
          </h2>
          <p className="text-center text-neutral mb-8">
            Click any example to load it into the explorer
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examples.map((example, index) => (
              <div
                key={index}
                className="bg-light-bg dark:bg-dark-bg rounded-lg p-6 shadow-lg border border-neutral/20 hover:shadow-xl hover:border-primary dark:hover:border-secondary transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-light-text dark:text-dark-text">{example.name}</h3>
                  <span className={`${getMethodColor(example.method)} text-white text-xs px-3 py-1 rounded-full font-semibold`}>
                    {example.method}
                  </span>
                </div>
                <p className="text-sm text-neutral mb-3">
                  {example.description}
                </p>
                <code className="text-xs bg-neutral/10 p-2 rounded block overflow-x-auto text-primary dark:text-secondary">
                  {example.endpoint}
                </code>
                <button
                  onClick={() => loadExample(example)}
                  className="mt-4 w-full px-4 py-2 bg-primary dark:bg-secondary hover:opacity-90 text-white dark:text-dark-bg rounded-lg font-medium transition-opacity"
                >
                  Try This API
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* API Request Form Section */}
        <section className="mb-16">
          <div className="bg-light-bg dark:bg-dark-bg rounded-lg shadow-xl border border-neutral/20 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-accent p-6">
              <h2 className="text-3xl font-bold text-white dark:text-dark-bg flex items-center">
                <Zap className="mr-3" size={32} />
                Configure Your Request
              </h2>
            </div>

            <div className="p-8">
              {/* Method and URL Row */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-light-text dark:text-dark-text mb-2">
                  HTTP Method & Endpoint
                </label>
                <div className="flex gap-4">
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="px-4 py-3 border-2 border-neutral/30 rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text font-semibold focus:outline-none focus:border-primary dark:focus:border-secondary transition-colors"
                  >
                    {methods.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.value}
                      </option>
                    ))}
                  </select>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && isFormValid) {
                          handleSendRequest();
                        }
                      }}
                      placeholder="https://api.example.com/endpoint"
                      className="w-full px-4 py-3 border-2 border-neutral/30 rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:border-primary dark:focus:border-secondary focus:ring-2 focus:ring-primary/20 dark:focus:ring-secondary/20 transition-all"
                      aria-label="API Endpoint URL"
                    />
                    <p className="text-xs text-neutral mt-1">Press Enter to send request</p>
                  </div>
                </div>
              </div>

              {/* Headers Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-light-text dark:text-dark-text">
                    Headers (Optional)
                  </label>
                  <button
                    onClick={addHeader}
                    className="flex items-center space-x-2 px-3 py-1 text-sm bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary rounded-lg hover:bg-primary/20 dark:hover:bg-secondary/20 transition-colors"
                  >
                    <Plus size={16} />
                    <span>Add Header</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {headers.map((header, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={header.key}
                        onChange={(e) => updateHeader(index, 'key', e.target.value)}
                        placeholder="Header name (e.g., Content-Type)"
                        className="flex-1 px-4 py-2 border border-neutral/30 rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:border-primary dark:focus:border-secondary transition-colors"
                      />
                      <input
                        type="text"
                        value={header.value}
                        onChange={(e) => updateHeader(index, 'value', e.target.value)}
                        placeholder="Header value (e.g., application/json)"
                        className="flex-1 px-4 py-2 border border-neutral/30 rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:border-primary dark:focus:border-secondary transition-colors"
                      />
                      <button
                        onClick={() => removeHeader(index)}
                        className="px-3 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Request Body Section - Only show for POST, PUT, PATCH */}
              {['POST', 'PUT', 'PATCH'].includes(method) && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-light-text dark:text-dark-text mb-2">
                    Request Body (JSON)
                  </label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    onBlur={validateJson}
                    rows={8}
                    className={`w-full px-4 py-3 border-2 rounded-lg bg-neutral/5 text-light-text dark:text-dark-text font-mono text-sm focus:outline-none transition-colors ${
                      jsonError
                        ? 'border-red-500 dark:border-red-400'
                        : 'border-neutral/30 focus:border-primary dark:focus:border-secondary'
                    }`}
                  />
                  {jsonError && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {jsonError}
                    </p>
                  )}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 rounded-lg">
                  <p className="text-red-800 dark:text-red-300 flex items-center">
                    <AlertCircle size={20} className="mr-2" />
                    {error}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleSendRequest}
                  disabled={!isFormValid}
                  className={`flex-1 px-6 py-4 bg-gradient-to-r from-primary to-accent text-white dark:text-dark-bg rounded-lg font-bold text-lg flex items-center justify-center space-x-3 transition-all transform hover:scale-105 hover:shadow-lg ${
                    isFormValid
                      ? 'hover:opacity-90 cursor-pointer'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  aria-label="Send API Request"
                >
                  {loading ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={24} />
                      <span>🚀 Send Request</span>
                    </>
                  )}
                </button>
                <button
                  onClick={clearForm}
                  className="px-6 py-4 bg-neutral/10 hover:bg-neutral/20 dark:bg-neutral/20 dark:hover:bg-neutral/30 text-neutral hover:text-light-text dark:hover:text-dark-text rounded-lg font-semibold flex items-center space-x-2 transition-all transform hover:scale-105"
                  aria-label="Clear Form"
                >
                  <Trash2 size={20} />
                  <span>Clear</span>
                </button>
              </div>
              {!url.trim() && (
                <p className="text-center text-sm text-neutral mt-2">
                  Enter a URL to enable the send button
                </p>
              )}
              {url.trim() && !isValidUrl(url.trim()) && (
                <p className="text-center text-sm text-red-600 dark:text-red-400 mt-2">
                  Please enter a valid URL (must start with http:// or https://)
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Response Viewer Section */}
        <section id="response-section" className="mb-16">
          <div className="bg-light-bg dark:bg-dark-bg rounded-lg shadow-xl border border-neutral/20 overflow-hidden">
            <div className="bg-gradient-to-r from-accent to-accent-dark p-6">
              <h2 className="text-3xl font-bold text-white dark:text-dark-bg">Response</h2>
            </div>
            <div className="p-8">
              {/* Empty State */}
              {!response && !loading && !error && (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <Code size={64} className="text-neutral/30 mx-auto mb-4" />
                    <p className="text-xl text-neutral">
                      Send a request to see the response here
                    </p>
                    <p className="text-sm text-neutral/70 mt-2">
                      Status code, timing, headers, and JSON body will appear here
                    </p>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <Loader2 size={64} className="text-primary dark:text-secondary animate-spin mx-auto mb-4" />
                    <p className="text-xl text-neutral">
                      Sending request...
                    </p>
                  </div>
                </div>
              )}

              {/* Response Display */}
              {response && (
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div className={`${getStatusColor(response.status)} text-white rounded-lg p-4 flex items-center justify-between`}>
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(response.status)}
                      <span className="font-bold text-lg">
                        Status: {response.status} {response.statusText}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock size={20} />
                      <span className="font-semibold">Time: {response.timing}ms</span>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="border-b border-neutral/20">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setResponseTab('body')}
                        className={`px-6 py-3 font-semibold transition-colors ${
                          responseTab === 'body'
                            ? 'text-primary dark:text-secondary border-b-2 border-primary dark:border-secondary'
                            : 'text-neutral hover:text-light-text dark:hover:text-dark-text'
                        }`}
                      >
                        Body
                      </button>
                      <button
                        onClick={() => setResponseTab('headers')}
                        className={`px-6 py-3 font-semibold transition-colors ${
                          responseTab === 'headers'
                            ? 'text-primary dark:text-secondary border-b-2 border-primary dark:border-secondary'
                            : 'text-neutral hover:text-light-text dark:hover:text-dark-text'
                        }`}
                      >
                        Headers
                      </button>
                      <button
                        onClick={() => setResponseTab('raw')}
                        className={`px-6 py-3 font-semibold transition-colors ${
                          responseTab === 'raw'
                            ? 'text-primary dark:text-secondary border-b-2 border-primary dark:border-secondary'
                            : 'text-neutral hover:text-light-text dark:hover:text-dark-text'
                        }`}
                      >
                        Raw
                      </button>
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="relative">
                    {/* Body Tab */}
                    {responseTab === 'body' && (
                      <div>
                        <div className="flex justify-end mb-2">
                          <button
                            onClick={() => copyToClipboard(formatJSON(response.data))}
                            className="flex items-center space-x-2 px-4 py-2 bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary rounded-lg hover:bg-primary/20 dark:hover:bg-secondary/20 transition-colors"
                          >
                            {copied ? (
                              <>
                                <Check size={16} />
                                <span className="text-sm font-medium">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={16} />
                                <span className="text-sm font-medium">Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="max-h-96 overflow-auto rounded-lg border border-neutral/20">
                          <SyntaxHighlighter
                            language="json"
                            style={vscDarkPlus}
                            customStyle={{
                              margin: 0,
                              borderRadius: '0.5rem',
                              fontSize: '0.9rem'
                            }}
                          >
                            {formatJSON(response.data)}
                          </SyntaxHighlighter>
                        </div>
                      </div>
                    )}

                    {/* Headers Tab */}
                    {responseTab === 'headers' && (
                      <div>
                        <div className="flex justify-end mb-2">
                          <button
                            onClick={() => copyToClipboard(formatJSON(response.headers))}
                            className="flex items-center space-x-2 px-4 py-2 bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary rounded-lg hover:bg-primary/20 dark:hover:bg-secondary/20 transition-colors"
                          >
                            {copied ? (
                              <>
                                <Check size={16} />
                                <span className="text-sm font-medium">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={16} />
                                <span className="text-sm font-medium">Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="max-h-96 overflow-auto rounded-lg border border-neutral/20 bg-white dark:bg-dark-bg">
                          <table className="w-full">
                            <thead className="bg-neutral/10 sticky top-0">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-bold text-light-text dark:text-dark-text">
                                  Header
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-bold text-light-text dark:text-dark-text">
                                  Value
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {formatHeaders(response.headers).map((header, index) => (
                                <tr
                                  key={index}
                                  className={index % 2 === 0 ? 'bg-white dark:bg-dark-bg' : 'bg-neutral/5'}
                                >
                                  <td className="px-4 py-3 text-sm font-mono font-semibold text-primary dark:text-secondary">
                                    {header.key}
                                  </td>
                                  <td className="px-4 py-3 text-sm font-mono text-neutral break-all">
                                    {header.value}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Raw Tab */}
                    {responseTab === 'raw' && (
                      <div>
                        <div className="flex justify-end mb-2">
                          <button
                            onClick={() => copyToClipboard(formatJSON(response))}
                            className="flex items-center space-x-2 px-4 py-2 bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary rounded-lg hover:bg-primary/20 dark:hover:bg-secondary/20 transition-colors"
                          >
                            {copied ? (
                              <>
                                <Check size={16} />
                                <span className="text-sm font-medium">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={16} />
                                <span className="text-sm font-medium">Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="max-h-96 overflow-auto rounded-lg border border-neutral/20">
                          <SyntaxHighlighter
                            language="json"
                            style={vscDarkPlus}
                            customStyle={{
                              margin: 0,
                              borderRadius: '0.5rem',
                              fontSize: '0.9rem'
                            }}
                          >
                            {formatJSON(response)}
                          </SyntaxHighlighter>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Code Generator Section */}
        <section className="mb-16">
          <div className="bg-light-bg dark:bg-dark-bg rounded-lg shadow-xl border border-neutral/20 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-secondary p-6">
              <h2 className="text-3xl font-bold text-white dark:text-dark-bg flex items-center">
                <Code className="mr-3" size={32} />
                Generated Code
              </h2>
            </div>

            {/* Language Tabs */}
            <div className="border-b border-neutral/20 bg-neutral/5">
              <div className="flex space-x-1 p-2">
                {codeLanguages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setActiveTab(lang.id)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                      activeTab === lang.id
                        ? 'bg-light-bg dark:bg-dark-bg text-primary dark:text-secondary shadow-md'
                        : 'text-neutral hover:text-light-text dark:hover:text-dark-text'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8">
              {/* Empty State */}
              {!url.trim() && (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <Copy size={64} className="text-neutral/30 mx-auto mb-4" />
                    <p className="text-xl text-neutral">
                      Generated code will appear here after sending a request
                    </p>
                    <p className="text-sm text-neutral/70 mt-2">
                      Copy-paste ready code in {codeLanguages.find(l => l.id === activeTab)?.name}
                    </p>
                  </div>
                </div>
              )}

              {/* Code Display */}
              {url.trim() && (
                <div>
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={() => copyToClipboard(generateCode(method, url, headers, body)[activeTab], activeTab)}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary rounded-lg hover:bg-primary/20 dark:hover:bg-secondary/20 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check size={16} />
                          <span className="text-sm font-medium">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          <span className="text-sm font-medium">Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="rounded-lg border border-neutral/20 overflow-hidden">
                    <SyntaxHighlighter
                      language={getLanguageForSyntaxHighlighter(activeTab)}
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        borderRadius: '0.5rem',
                        fontSize: '0.9rem',
                        maxHeight: '500px'
                      }}
                      showLineNumbers={false}
                    >
                      {generateCode(method, url, headers, body)[activeTab]}
                    </SyntaxHighlighter>
                  </div>
                  <p className="text-sm text-neutral mt-4 text-center">
                    Production-ready code snippet for {codeLanguages.find(l => l.id === activeTab)?.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Tips & Best Practices Section */}
        <section className="mb-16">
          <div className="bg-light-bg dark:bg-dark-bg rounded-lg shadow-xl border border-neutral/20 overflow-hidden">
            <div className="bg-gradient-to-r from-accent to-accent-dark p-6">
              <h2 className="text-3xl font-bold text-white dark:text-dark-bg flex items-center">
                <List className="mr-3" size={32} />
                Tips & Best Practices
              </h2>
            </div>
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-3 flex items-center">
                    <CheckCircle className="mr-2 text-primary dark:text-secondary" size={20} />
                    Getting Started
                  </h3>
                  <ul className="space-y-2 text-neutral">
                    <li className="flex items-start">
                      <span className="text-primary dark:text-secondary mr-2">•</span>
                      <span>Start with public APIs that don't require authentication</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary dark:text-secondary mr-2">•</span>
                      <span>Use the example APIs above to familiarize yourself with the tool</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary dark:text-secondary mr-2">•</span>
                      <span>Check API documentation for required headers and parameters</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary dark:text-secondary mr-2">•</span>
                      <span>JSONPlaceholder is perfect for testing POST/PUT/DELETE requests</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-3 flex items-center">
                    <Code className="mr-2 text-primary dark:text-secondary" size={20} />
                    Using Generated Code
                  </h3>
                  <ul className="space-y-2 text-neutral">
                    <li className="flex items-start">
                      <span className="text-primary dark:text-secondary mr-2">•</span>
                      <span>All generated code includes proper error handling</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary dark:text-secondary mr-2">•</span>
                      <span>Copy-paste snippets work out-of-the-box in your projects</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary dark:text-secondary mr-2">•</span>
                      <span>Use Python/Node.js code for backend API calls (no CORS)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary dark:text-secondary mr-2">•</span>
                      <span>Add your API keys and authentication to the generated code</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 p-6 bg-primary/10 dark:bg-secondary/10 rounded-lg border-2 border-primary/30 dark:border-secondary/30">
                <h3 className="text-lg font-bold text-primary dark:text-secondary mb-3">Popular Public APIs to Try</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-light-text dark:text-dark-text mb-1">Data & Content</p>
                    <ul className="text-neutral space-y-1">
                      <li>• JSONPlaceholder</li>
                      <li>• REST Countries</li>
                      <li>• Open Library</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-light-text dark:text-dark-text mb-1">Media & Fun</p>
                    <ul className="text-neutral space-y-1">
                      <li>• Dog CEO (Images)</li>
                      <li>• PokeAPI</li>
                      <li>• Random User Generator</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-light-text dark:text-dark-text mb-1">Development</p>
                    <ul className="text-neutral space-y-1">
                      <li>• GitHub API</li>
                      <li>• IP Geolocation</li>
                      <li>• Exchange Rates API</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default APIExplorer;

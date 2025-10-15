import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Zap, TrendingUp, DollarSign, Shield, CheckCircle, Server, Database, Gauge, Lock, Eye, Workflow, AlertTriangle, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import MermaidDiagram from '../../components/MermaidDiagram';
import { trackPageView, trackDemoViewed } from '../../utils/analytics';

const GCPArchitecture = () => {
  const [activeTab, setActiveTab] = useState('compute');
  const [openPhase, setOpenPhase] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Principle Cards Data
  const principles = [
    {
      icon: <Server className="w-8 h-8" />,
      title: 'Serverless-First Approach',
      description: 'Leverage managed services to minimize operational overhead and maximize development velocity.',
      benefit: 'Reduced infrastructure management by 80%'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Horizontal Scalability',
      description: 'Design for automatic scaling from zero to thousands of concurrent users without manual intervention.',
      benefit: 'Handle 100x traffic spikes automatically'
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Cost Optimization',
      description: 'Pay-per-use pricing models with intelligent resource allocation to minimize cloud spend.',
      benefit: '70% cost savings vs. over-provisioned VMs'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Security by Default',
      description: 'Built-in encryption, IAM policies, and network isolation at every layer of the stack.',
      benefit: 'SOC 2 and GDPR compliance ready'
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'Observable & Debuggable',
      description: 'Comprehensive monitoring, logging, and tracing integrated from day one.',
      benefit: 'MTTR reduced from hours to minutes'
    }
  ];

  // Service Comparison Tabs
  const serviceComparisons = {
    compute: {
      services: [
        {
          name: 'Cloud Run',
          useCase: 'Stateless APIs, web apps',
          scaling: 'Automatic (0-1000 instances)',
          pricing: '$0.40/million requests',
          bestFor: 'HTTP services, microservices',
          pros: ['Zero to scale', 'No cluster management', 'Built-in HTTPS'],
          cons: ['15-minute timeout', 'Stateless only']
        },
        {
          name: 'GKE Autopilot',
          useCase: 'Complex workloads, batch jobs',
          scaling: 'Node auto-provisioning',
          pricing: '$0.10/vCPU-hour',
          bestFor: 'ML pipelines, scheduled tasks',
          pros: ['Flexibility', 'Stateful workloads', 'Custom networking'],
          cons: ['Higher complexity', 'More expensive at low scale']
        },
        {
          name: 'Cloud Functions',
          useCase: 'Event-driven tasks',
          scaling: 'Per-invocation',
          pricing: '$0.40/million invocations',
          bestFor: 'Webhooks, async processing',
          pros: ['Simplest deployment', 'Event triggers'],
          cons: ['Cold starts', 'Limited runtime']
        }
      ]
    },
    database: {
      services: [
        {
          name: 'Firestore',
          useCase: 'Real-time apps, mobile backends',
          scaling: 'Automatic sharding',
          pricing: '$0.06/100k reads',
          bestFor: 'Document data, real-time sync',
          pros: ['Real-time listeners', 'Offline support', 'No ops'],
          cons: ['Limited query complexity', 'Not relational']
        },
        {
          name: 'Cloud SQL (PostgreSQL)',
          useCase: 'Relational data, analytics',
          scaling: 'Read replicas, HA',
          pricing: '$50/month (db-f1-micro)',
          bestFor: 'ACID transactions, complex joins',
          pros: ['Standard SQL', 'ACID guarantees', 'Mature ecosystem'],
          cons: ['Manual scaling', 'Higher maintenance']
        },
        {
          name: 'Spanner',
          useCase: 'Global distributed systems',
          scaling: 'Horizontal + multi-region',
          pricing: '$0.90/node-hour',
          bestFor: 'Global applications, high consistency',
          pros: ['Global consistency', 'Unlimited scale', 'SQL interface'],
          cons: ['Expensive', 'Overkill for small apps']
        }
      ]
    },
    caching: {
      services: [
        {
          name: 'Memorystore (Redis)',
          useCase: 'Session storage, caching',
          scaling: 'Up to 300GB',
          pricing: '$0.049/GB-hour',
          bestFor: 'Hot data, rate limiting',
          pros: ['Sub-millisecond latency', 'Redis compatibility', 'Managed'],
          cons: ['Not distributed', 'Limited to single region']
        },
        {
          name: 'Cloud CDN',
          useCase: 'Static assets, API responses',
          scaling: 'Global edge network',
          pricing: '$0.08/GB egress',
          bestFor: 'Images, videos, API caching',
          pros: ['Global distribution', 'Integrated with GCP', 'Cache invalidation'],
          cons: ['Cache control complexity']
        }
      ]
    }
  };

  // Cost Breakdown Data
  const costBreakdown = [
    { tier: 'MVP / Testing', users: '0-1K', compute: '$10', database: '$5', storage: '$2', monitoring: '$0', total: '$17/mo' },
    { tier: 'Early Growth', users: '1K-10K', compute: '$50', database: '$25', storage: '$10', monitoring: '$5', total: '$90/mo' },
    { tier: 'Scale-Up', users: '10K-50K', compute: '$300', database: '$150', storage: '$50', monitoring: '$20', total: '$520/mo' },
    { tier: 'Enterprise', users: '50K-100K+', compute: '$1500', database: '$800', storage: '$200', monitoring: '$100', total: '$2600/mo' }
  ];

  // Implementation Phases
  const implementationPhases = [
    {
      phase: 'Phase 1: Foundation (Week 1-2)',
      description: 'Set up core infrastructure and deployment pipeline',
      tasks: [
        'Create GCP project and enable required APIs',
        'Set up Cloud Build CI/CD pipeline',
        'Deploy containerized application to Cloud Run',
        'Configure Cloud SQL with connection pooling',
        'Implement basic monitoring with Cloud Monitoring',
        'Set up staging and production environments'
      ]
    },
    {
      phase: 'Phase 2: Optimization (Week 3-4)',
      description: 'Implement caching, CDN, and performance improvements',
      tasks: [
        'Deploy Memorystore Redis for session/cache',
        'Enable Cloud CDN for static assets',
        'Implement database read replicas',
        'Set up auto-scaling policies',
        'Configure Cloud Armor for DDoS protection',
        'Optimize container images for faster cold starts'
      ]
    },
    {
      phase: 'Phase 3: Production Hardening (Week 5-6)',
      description: 'Security, observability, and disaster recovery',
      tasks: [
        'Implement comprehensive logging and tracing',
        'Set up alerting and incident response runbooks',
        'Configure automated backups and disaster recovery',
        'Security audit: IAM, VPC, Secret Manager',
        'Load testing and performance benchmarking',
        'Documentation and team training'
      ]
    }
  ];

  // Track page view on mount
  useEffect(() => {
    trackPageView('GCP Architecture');
    trackDemoViewed('GCP Architecture');
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-primary dark:text-secondary hover:opacity-80 mb-8"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Home</span>
        </Link>

        {/* Hero Section */}
        <div className="mb-12">
          <div
            className="h-64 w-full rounded-lg mb-8 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            }}
          >
            <div className="text-center text-white px-4">
              <h1 className="text-4xl font-bold mb-4">GCP Cloud Architecture</h1>
              <p className="text-xl opacity-90">Designing Scalable SaaS Platforms</p>
            </div>
          </div>

          <p className="text-2xl text-center mb-6 text-neutral">
            Building production-ready applications with Google Cloud's managed services for maximum performance and minimal operational overhead
          </p>

          {/* Stats Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 rounded-full border border-green-300 dark:border-green-700">
              <Zap size={20} className="text-green-600 dark:text-green-400" />
              <span className="font-medium text-green-800 dark:text-green-300">&lt;200ms Response Time</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 rounded-full border border-blue-300 dark:border-blue-700">
              <TrendingUp size={20} className="text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-800 dark:text-blue-300">Scale: 0-100K Users</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/20 rounded-full border border-amber-300 dark:border-amber-700">
              <DollarSign size={20} className="text-amber-600 dark:text-amber-400" />
              <span className="font-medium text-amber-800 dark:text-amber-300">$17-2.6K/month</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/20 rounded-full border border-purple-300 dark:border-purple-700">
              <Shield size={20} className="text-purple-600 dark:text-purple-400" />
              <span className="font-medium text-purple-800 dark:text-purple-300">99.9% Uptime SLA</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {['Cloud Run', 'Firestore', 'Kubernetes', 'Docker', 'PostgreSQL', 'Redis'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 font-medium border border-green-300 dark:border-green-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Overview Section */}
        <section className="mb-16">
          <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-8 shadow-lg border border-neutral/20">
            <h2 className="text-3xl font-bold mb-6 text-primary dark:text-secondary">
              Overview: Cloud-Native Architecture
            </h2>
            <p className="text-lg leading-relaxed mb-6 text-light-text dark:text-dark-text">
              Modern SaaS applications require infrastructure that can scale elastically, maintain high availability,
              and operate cost-effectively across varying load patterns. Google Cloud Platform provides a comprehensive
              suite of managed services that enable teams to focus on application logic rather than infrastructure management.
            </p>
            <p className="text-lg leading-relaxed mb-8 text-light-text dark:text-dark-text">
              This architecture guide demonstrates production-ready patterns for building scalable web applications using
              GCP's serverless and container orchestration services, with emphasis on observability, security, and cost optimization.
            </p>

            {/* Benefit Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Automatic Scaling', desc: 'From 0 to 1000+ instances based on traffic, no manual intervention' },
                { title: 'Developer Velocity', desc: 'Deploy in minutes, not days, with fully managed infrastructure' },
                { title: 'Cost Efficiency', desc: 'Pay only for actual usage with per-request billing models' },
                { title: 'Global Reach', desc: 'Multi-region deployment for low-latency worldwide access' }
              ].map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                  <CheckCircle size={24} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-light-text dark:text-dark-text mb-1">{benefit.title}</h3>
                    <p className="text-neutral text-sm">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Design Principles */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-light-text dark:text-dark-text">
            Core Design Principles
          </h2>
          <p className="text-lg leading-relaxed mb-8 text-neutral">
            These architectural principles guide every technology decision, ensuring systems remain maintainable,
            scalable, and cost-effective as they grow from MVP to enterprise scale.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((principle, index) => (
              <div key={index} className="bg-light-bg dark:bg-dark-bg rounded-lg p-6 shadow-lg border border-neutral/20 hover:shadow-xl transition-shadow">
                <div className="text-green-600 dark:text-green-400 mb-4">
                  {principle.icon}
                </div>
                <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-2">
                  {principle.title}
                </h3>
                <p className="text-neutral mb-4 text-sm leading-relaxed">
                  {principle.description}
                </p>
                <div className="pt-4 border-t border-neutral/20">
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                    ✓ {principle.benefit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reference Architecture Diagram */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-light-text dark:text-dark-text">
            Reference Architecture
          </h2>
          <p className="text-lg leading-relaxed mb-8 text-neutral">
            High-level system architecture showing the complete request flow from client through load balancing,
            compute services, data layer, and observability stack.
          </p>

          {/* Mermaid Architecture Diagram */}
          <div className="my-8 bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto">
            <h4 className="text-center text-lg font-bold text-gray-700 dark:text-gray-300 mb-6">
              User Request Flow Through GCP Architecture
            </h4>
            <MermaidDiagram chart={`
graph TB
    subgraph CLIENT["👥 CLIENT LAYER"]
        direction LR
        Web["Web Browser"]
        Mobile["Mobile App"]
        API["API Clients"]
    end

    subgraph EDGE["🛡️ EDGE LAYER"]
        direction LR
        LB["Cloud Load<br/>Balancer"]
        CDN["Cloud CDN<br/>Static Assets"]
        Armor["Cloud Armor<br/>DDoS Protection"]
    end

    subgraph APP["⚙️ APPLICATION LAYER"]
        direction LR
        Frontend["Frontend Service<br/>Cloud Run<br/>Auto-scaling 0-1000"]
        Backend["Backend API<br/>Cloud Run<br/>Serverless Containers"]
        Tasks["Cloud Tasks<br/>Background Jobs<br/>Async Processing"]
    end

    subgraph DATA["💾 DATA LAYER"]
        direction LR
        Firestore[("Firestore<br/>NoSQL Database<br/>Real-time Sync")]
        CloudSQL[("Cloud SQL<br/>PostgreSQL<br/>Relational Data")]
        Redis[("Memorystore<br/>Redis Cache<br/>Sub-ms Latency")]
        Storage[("Cloud Storage<br/>Object Storage<br/>CDN-ready Files")]
    end

    subgraph EXTERNAL["🔌 EXTERNAL SERVICES"]
        direction LR
        Payment["Payment APIs<br/>Stripe"]
        Comms["Email/SMS<br/>SendGrid/Twilio"]
        Analytics["Analytics<br/>Google Analytics"]
    end

    subgraph OBS["👁️ OBSERVABILITY"]
        direction TB
        Monitor["☁️ Cloud Monitoring<br/>Metrics & Alerts"]
        Logs["📋 Cloud Logging<br/>Centralized Logs"]
        Trace["🔍 Cloud Trace<br/>Distributed Tracing"]
    end

    %% Primary Request Flow - Heavy arrows for main path
    CLIENT ==>|"HTTPS Requests"| LB
    LB ==>|"Route Static Assets"| CDN
    LB ==>|"Route API Traffic"| Armor
    Armor ==>|"Filtered Requests"| Frontend
    Frontend ==>|"Backend API Calls"| Backend

    %% Data Layer Connections
    Backend -->|"Query Documents"| Firestore
    Backend -->|"Cache Lookups"| Redis
    Backend -->|"Store Files"| Storage
    Backend -.->|"Complex Queries"| CloudSQL

    %% Async Processing
    Backend -->|"Queue Jobs"| Tasks

    %% External Integrations
    Backend -.->|"Payments, Email, Analytics"| EXTERNAL

    %% Observability - Dashed lines to sidebar
    APP -.->|"Logs, Metrics, Traces"| OBS

    %% Styling with distinct colors per layer
    classDef clientStyle fill:#E3F2FD,stroke:#1976D2,stroke-width:3px,color:#000
    classDef edgeStyle fill:#B2EBF2,stroke:#00838F,stroke-width:3px,color:#000
    classDef appStyle fill:#C8E6C9,stroke:#388E3C,stroke-width:3px,color:#000
    classDef dataStyle fill:#BBDEFB,stroke:#1565C0,stroke-width:3px,color:#000
    classDef externalStyle fill:#FFE0B2,stroke:#EF6C00,stroke-width:3px,color:#000
    classDef observeStyle fill:#E1BEE7,stroke:#6A1B9A,stroke-width:3px,color:#000

    class Web,Mobile,API clientStyle
    class LB,CDN,Armor edgeStyle
    class Frontend,Backend,Tasks appStyle
    class Firestore,CloudSQL,Redis,Storage dataStyle
    class Payment,Comms,Analytics externalStyle
    class Monitor,Logs,Trace observeStyle
            `} />

            {/* Legend */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Architecture Flow Legend:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-blue-100 border-2 border-blue-700 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">👥 <strong>Client Layer</strong> - User entry points</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-cyan-100 border-2 border-cyan-800 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">🛡️ <strong>Edge Layer</strong> - Security & CDN</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-green-100 border-2 border-green-700 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">⚙️ <strong>Application</strong> - Cloud Run services</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-blue-200 border-2 border-blue-800 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">💾 <strong>Data Layer</strong> - Storage & databases</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-orange-100 border-2 border-orange-700 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">🔌 <strong>External</strong> - Third-party APIs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-purple-100 border-2 border-purple-700 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">👁️ <strong>Observability</strong> - Monitoring</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-800 dark:text-gray-200">━━━▶</span>
                  <span>Primary request flow</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-800 dark:text-gray-200">- - -▶</span>
                  <span>Async/monitoring connections</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cloud Run Dashboard Screenshot */}
          <div className="my-12">
            <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Here's what this architecture looks like in production:
            </p>
            <figure className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <img
                src="/images/demos/gcp/gcp-cloud-run-dashboard.png"
                alt="Screenshot of GCP Cloud Run dashboard displaying deployed microservices with auto-scaling and production traffic routing"
                className="w-full rounded-md"
                loading="lazy"
              />
              <figcaption className="mt-3 text-sm font-medium text-center text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
                Cloud Run services dashboard showing deployed microservices with auto-scaling enabled and production traffic routing
              </figcaption>
            </figure>
          </div>

          {/* Architecture Explanation */}
          <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-6 shadow-lg border border-neutral/20 mb-8">
            <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4">
              Why This Architecture Pattern?
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-light-text dark:text-dark-text mb-2">Serverless-First Design</h4>
                <p className="text-neutral text-sm">
                  Cloud Run containers provide automatic scaling from zero to thousands of instances without managing infrastructure.
                  This eliminates the complexity of Kubernetes while maintaining containerization benefits. Pay only for actual compute
                  time with per-request billing.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-light-text dark:text-dark-text mb-2">Managed Services Reduce Operational Overhead</h4>
                <p className="text-neutral text-sm">
                  Firestore, Cloud SQL, and Memorystore are fully managed, handling backups, replication, and scaling automatically.
                  This allows engineering teams to focus on application logic rather than database administration. GCP handles
                  patching, monitoring, and high availability.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-light-text dark:text-dark-text mb-2">Multi-Region Capability for Global SaaS</h4>
                <p className="text-neutral text-sm">
                  Cloud Load Balancer and Cloud CDN distribute traffic globally, reducing latency for international customers.
                  Data can be replicated across regions with Cloud SQL read replicas and Firestore's multi-region support.
                  This architecture supports 99.99% availability SLAs required for B2B contracts.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-light-text dark:text-dark-text mb-2">Built-in Observability</h4>
                <p className="text-neutral text-sm">
                  Integrated Cloud Monitoring, Logging, and Trace provide complete visibility into application performance
                  without additional instrumentation. Automatic collection of metrics, logs, and traces from all GCP services
                  enables fast debugging and proactive issue detection.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Selection Guide */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-light-text dark:text-dark-text">
            Service Selection Guide
          </h2>
          <p className="text-lg leading-relaxed mb-8 text-neutral">
            Choosing the right GCP services for your workload characteristics ensures optimal performance and cost efficiency.
          </p>

          {/* Tabs */}
          <div className="flex space-x-2 mb-6 border-b border-neutral/20">
            {Object.keys(serviceComparisons).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400'
                    : 'text-neutral hover:text-green-600 dark:hover:text-green-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {serviceComparisons[activeTab].services.map((service, index) => (
              <div key={index} className="bg-light-bg dark:bg-dark-bg rounded-lg p-6 shadow-lg border border-neutral/20">
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">
                      {service.name}
                    </h3>
                    <p className="text-sm text-neutral">{service.useCase}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral mb-1">Scaling</p>
                    <p className="font-semibold text-light-text dark:text-dark-text">{service.scaling}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral mb-1">Pricing</p>
                    <p className="font-semibold text-light-text dark:text-dark-text">{service.pricing}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral mb-1">Best For</p>
                    <p className="font-semibold text-light-text dark:text-dark-text">{service.bestFor}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">Pros:</p>
                    <ul className="space-y-1">
                      {service.pros.map((pro, i) => (
                        <li key={i} className="text-sm text-neutral flex items-start">
                          <CheckCircle size={16} className="text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2">Considerations:</p>
                    <ul className="space-y-1">
                      {service.cons.map((con, i) => (
                        <li key={i} className="text-sm text-neutral flex items-start">
                          <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400 mr-2 mt-0.5 flex-shrink-0" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Compute Service Decision Tree */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-4 text-light-text dark:text-dark-text">
              Compute Service Decision Tree
            </h3>
            <p className="text-lg leading-relaxed mb-6 text-neutral">
              Use this decision tree to quickly identify the best GCP compute service for your specific use case.
            </p>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto">
              <MermaidDiagram chart={`
graph TD
    Start[/"What's Your Primary Workload?"/]
    Decision{"Choose Your<br/>Compute Service"}

    Start --> Decision

    %% Primary recommended path - emphasized
    Decision ==>|"Containerized<br/>HTTP Service<br/>RECOMMENDED"| CloudRun["⭐ Cloud Run<br/>START HERE"]

    %% Other paths
    Decision -->|"10+ Complex<br/>Microservices"| GKE["GKE Autopilot"]
    Decision -->|"Simple<br/>Web App"| AppEngine["App Engine"]
    Decision -->|"Need Full<br/>VM Control"| ComputeEngine["Compute Engine"]
    Decision -->|"Event Triggers<br/>& Functions"| CloudFunctions["Cloud Functions"]

    %% Detail boxes with actionable information
    CloudRun --> CloudRunDetails["⭐ RECOMMENDED<br/><br/>✓ HTTP/API services<br/>✓ Auto-scales 0-1000<br/>✓ Pay per request<br/>✓ Deploy in 5 min<br/><br/>Cost: Low<br/>Effort: Low"]

    GKE --> GKEDetails["Complex Systems<br/><br/>✓ 10+ microservices<br/>✓ K8s features needed<br/>✓ Multi-cloud ready<br/>✓ Advanced networking<br/><br/>Cost: $75+/mo<br/>Effort: High"]

    AppEngine --> AppEngineDetails["Simple PaaS<br/><br/>✓ Standard web apps<br/>✓ No containers<br/>✓ Quick MVPs<br/>✓ Fully managed<br/><br/>Cost: Low<br/>Effort: Low"]

    ComputeEngine --> ComputeDetails["Full VM Control<br/><br/>✓ Lift-and-shift<br/>✓ Windows apps<br/>✓ GPU/TPU workloads<br/>✓ Custom OS/kernel<br/><br/>Cost: $25-300/mo<br/>Effort: High"]

    CloudFunctions --> FunctionsDetails["Event-Driven<br/><br/>✓ Pub/Sub triggers<br/>✓ Single functions<br/>✓ Webhooks<br/>✓ Under 5 min exec<br/><br/>Cost: Very Low<br/>Effort: Low"]

    %% CRITICAL: Styling with BLACK TEXT for visibility in both light/dark mode
    style Start fill:#E3F2FD,stroke:#1976D2,stroke-width:3px,color:#000000
    style Decision fill:#FFF9C4,stroke:#F57F17,stroke-width:3px,color:#000000
    style CloudRun fill:#4CAF50,stroke:#2E7D32,stroke-width:4px,color:#000000
    style GKE fill:#E1F5FE,stroke:#0277BD,stroke-width:2px,color:#000000
    style AppEngine fill:#E1F5FE,stroke:#0277BD,stroke-width:2px,color:#000000
    style ComputeEngine fill:#F5F5F5,stroke:#616161,stroke-width:2px,color:#000000
    style CloudFunctions fill:#C8E6C9,stroke:#388E3C,stroke-width:2px,color:#000000

    style CloudRunDetails fill:#E8F5E9,stroke:#2E7D32,stroke-width:3px,color:#000000,text-align:left
    style GKEDetails fill:#E1F5FE,stroke:#0277BD,stroke-width:2px,color:#000000,text-align:left
    style AppEngineDetails fill:#E1F5FE,stroke:#0277BD,stroke-width:2px,color:#000000,text-align:left
    style ComputeDetails fill:#F5F5F5,stroke:#616161,stroke-width:2px,color:#000000,text-align:left
    style FunctionsDetails fill:#E8F5E9,stroke:#388E3C,stroke-width:2px,color:#000000,text-align:left
              `} />
            </div>

            {/* Quick Decision Guide */}
            <div className="mt-8 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 rounded-lg p-6 border border-green-200 dark:border-green-800">
              <h4 className="text-xl font-bold text-light-text dark:text-dark-text mb-4">
                Quick Decision Guide
              </h4>
              <ul className="space-y-3 text-sm text-light-text dark:text-dark-text">
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 dark:text-green-400 font-bold text-lg">⭐</span>
                  <div>
                    <strong className="text-green-700 dark:text-green-400">80% of cases: Start with Cloud Run.</strong>
                    <span className="text-neutral ml-1">
                      It handles most web services, APIs, and containerized apps with zero ops overhead and instant scaling.
                    </span>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">🔧</span>
                  <div>
                    <strong className="text-blue-700 dark:text-blue-400">Complex distributed systems:</strong>
                    <span className="text-neutral ml-1">
                      Choose GKE only if you have 10+ microservices requiring Kubernetes-specific features (StatefulSets, custom networking, etc.).
                    </span>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-gray-600 dark:text-gray-400 font-bold text-lg">🖥️</span>
                  <div>
                    <strong className="text-gray-700 dark:text-gray-400">Legacy migrations:</strong>
                    <span className="text-neutral ml-1">
                      Use Compute Engine for lift-and-shift migrations, Windows apps, or when you need full VM control (GPU/TPU, specific kernels).
                    </span>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 dark:text-green-400 font-bold text-lg">⚡</span>
                  <div>
                    <strong className="text-green-700 dark:text-green-400">Simple event handlers:</strong>
                    <span className="text-neutral ml-1">
                      Cloud Functions are perfect for webhook handlers, Pub/Sub triggers, and short-lived tasks under 5 minutes.
                    </span>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">🚀</span>
                  <div>
                    <strong className="text-blue-700 dark:text-blue-400">Not sure? Try Cloud Run first.</strong>
                    <span className="text-neutral ml-1">
                      It's the easiest to start with, and you can always migrate to GKE later if you outgrow it. The free tier is generous for testing.
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Decision Factors Explanation */}
            <div className="mt-8 bg-light-bg dark:bg-dark-bg rounded-lg p-6 shadow-lg border border-neutral/20">
              <h4 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4">
                Key Decision Factors
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-light-text dark:text-dark-text mb-2 flex items-center">
                    <Zap size={18} className="text-green-600 dark:text-green-400 mr-2" />
                    Traffic Patterns
                  </h5>
                  <p className="text-sm text-neutral mb-3">
                    <strong>Unpredictable/Spiky:</strong> Cloud Run or Cloud Functions scale to zero and handle sudden bursts automatically.
                  </p>
                  <p className="text-sm text-neutral">
                    <strong>Steady/Predictable:</strong> Compute Engine with sustained use discounts can be more cost-effective for 24/7 workloads.
                  </p>
                </div>

                <div>
                  <h5 className="font-semibold text-light-text dark:text-dark-text mb-2 flex items-center">
                    <Server size={18} className="text-green-600 dark:text-green-400 mr-2" />
                    Team Expertise
                  </h5>
                  <p className="text-sm text-neutral mb-3">
                    <strong>Beginner:</strong> Start with Cloud Run or App Engine for simplicity and managed infrastructure.
                  </p>
                  <p className="text-sm text-neutral">
                    <strong>Kubernetes Experts:</strong> GKE provides full control and flexibility for complex distributed systems.
                  </p>
                </div>

                <div>
                  <h5 className="font-semibold text-light-text dark:text-dark-text mb-2 flex items-center">
                    <DollarSign size={18} className="text-green-600 dark:text-green-400 mr-2" />
                    Budget Constraints
                  </h5>
                  <p className="text-sm text-neutral mb-3">
                    <strong>Startup/MVP:</strong> Cloud Run offers the best value with pay-per-use pricing and $300 free credits.
                  </p>
                  <p className="text-sm text-neutral">
                    <strong>High Volume:</strong> GKE or Compute Engine with committed use discounts reduce costs at scale.
                  </p>
                </div>

                <div>
                  <h5 className="font-semibold text-light-text dark:text-dark-text mb-2 flex items-center">
                    <TrendingUp size={18} className="text-green-600 dark:text-green-400 mr-2" />
                    Time to Market
                  </h5>
                  <p className="text-sm text-neutral mb-3">
                    <strong>Launch Fast:</strong> Cloud Functions or Cloud Run can deploy in under 5 minutes with zero infrastructure setup.
                  </p>
                  <p className="text-sm text-neutral">
                    <strong>Complex Systems:</strong> GKE requires more setup time but provides production-grade orchestration.
                  </p>
                </div>
              </div>
            </div>

            {/* Common Patterns */}
            <div className="mt-6 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/10 dark:to-green-900/10 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <h4 className="text-lg font-bold text-light-text dark:text-dark-text mb-3">
                Common Architecture Patterns
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle size={18} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-light-text dark:text-dark-text text-sm">Hybrid Approach</p>
                    <p className="text-xs text-neutral">
                      Use Cloud Run for stateless APIs + GKE for stateful services + Cloud Functions for event handlers.
                      This combines the best of each service.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle size={18} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-light-text dark:text-dark-text text-sm">Start Simple, Scale Complex</p>
                    <p className="text-xs text-neutral">
                      Begin with Cloud Run for MVP validation. Migrate specific services to GKE only when you need
                      advanced orchestration features (StatefulSets, custom scheduling).
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle size={18} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-light-text dark:text-dark-text text-sm">Migration Path</p>
                    <p className="text-xs text-neutral">
                      Compute Engine → GKE → Cloud Run is a common modernization journey. Containerize VMs first,
                      then simplify to serverless where applicable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scaling Strategies */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-light-text dark:text-dark-text">
            Scaling Strategies
          </h2>
          <p className="text-lg leading-relaxed mb-8 text-neutral">
            GCP's managed services automatically handle traffic spikes without manual intervention, maintaining consistent
            performance as load increases from hundreds to thousands of concurrent users.
          </p>

          {/* Auto-Scaling Sequence Diagram */}
          <div className="mb-12 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4">
              Auto-Scaling in Action: Traffic Spike Simulation
            </h3>
            <p className="text-neutral mb-6">
              This sequence diagram shows what happens when traffic suddenly spikes from 100 to 10,000 concurrent users
              in just 5 minutes—a common scenario during product launches or marketing campaigns.
            </p>

            <div className="overflow-x-auto">
              <MermaidDiagram chart={`
sequenceDiagram
    participant Users as 👥 User Traffic
    participant LB as Cloud Load Balancer
    participant CR as Cloud Run (Backend)
    participant Redis as Memorystore (Redis)
    participant DB as Firestore Database

    Note over Users: Traffic Spike: 100 → 10,000 users
    Note over Users,DB: Timeline: 0-5 minutes

    Users->>LB: 10K concurrent requests
    Note right of LB: ✓ Auto-distributes<br/>No config needed<br/>Instant scaling

    LB->>CR: Route requests
    Note right of CR: ⚡ Scales 1 → 50 instances<br/>Time: 5-10 seconds<br/>Auto-scaling enabled

    CR->>Redis: Cache lookup (99% hit rate)
    Note right of Redis: 🎯 Cache Hit: 99%<br/>Response: ~5ms<br/>Reduces DB load 100x

    Redis-->>CR: Cached data returned

    CR->>DB: Read/Write (1% miss rate)
    Note right of DB: ✓ Auto-scales throughput<br/>No manual intervention<br/>Instant capacity

    DB-->>CR: Data returned
    CR-->>LB: Response (200ms avg)
    LB-->>Users: 200ms response time maintained

    Note over Users,DB: Result: 99.9% success rate<br/>Consistent ~200ms latency<br/>Zero manual intervention

    rect rgb(220, 252, 231)
        Note over LB,CR: All scaling decisions automated<br/>Engineers can focus on features
    end
              `} />
            </div>

            {/* Monitoring Metrics Screenshot */}
            <div className="my-12">
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Live metrics from a production deployment showing scaling in action:
              </p>
              <figure className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <img
                  src="/images/demos/gcp/gcp-monitoring-metrics.png"
                  alt="Real-time Cloud Monitoring dashboard showing request latency percentiles, instance count, and auto-scaling metrics"
                  className="w-full rounded-md"
                  loading="lazy"
                />
                <figcaption className="mt-3 text-sm font-medium text-center text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
                  Real-time Cloud Monitoring metrics displaying request latency (P50/P95/P99), instance count, and auto-scaling response to traffic spikes
                </figcaption>
              </figure>
            </div>

            {/* Scaling Comparison Table */}
            <div className="mt-8">
              <h4 className="text-lg font-bold text-light-text dark:text-dark-text mb-4">
                Component Scaling Behavior
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full bg-light-bg dark:bg-dark-bg rounded-lg overflow-hidden border border-neutral/20">
                  <thead className="bg-green-100 dark:bg-green-900/20">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold text-green-800 dark:text-green-300">Component</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-green-800 dark:text-green-300">Scaling Method</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-green-800 dark:text-green-300">Time to Scale</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-green-800 dark:text-green-300">Manual Config?</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-green-800 dark:text-green-300">Max Capacity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral/20">
                    <tr className="hover:bg-green-50 dark:hover:bg-green-900/10">
                      <td className="px-4 py-3 font-semibold text-light-text dark:text-dark-text">Cloud Load Balancer</td>
                      <td className="px-4 py-3 text-neutral text-sm">Automatic distribution</td>
                      <td className="px-4 py-3 text-green-600 dark:text-green-400 font-semibold">Instant</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                          No
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral text-sm">Unlimited</td>
                    </tr>
                    <tr className="hover:bg-green-50 dark:hover:bg-green-900/10">
                      <td className="px-4 py-3 font-semibold text-light-text dark:text-dark-text">Cloud Run</td>
                      <td className="px-4 py-3 text-neutral text-sm">Instance auto-scaling</td>
                      <td className="px-4 py-3 text-green-600 dark:text-green-400 font-semibold">5-10 seconds</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-semibold">
                          Optional
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral text-sm">0-1000 instances</td>
                    </tr>
                    <tr className="hover:bg-green-50 dark:hover:bg-green-900/10">
                      <td className="px-4 py-3 font-semibold text-light-text dark:text-dark-text">Memorystore (Redis)</td>
                      <td className="px-4 py-3 text-neutral text-sm">Fixed capacity tier</td>
                      <td className="px-4 py-3 text-neutral text-sm">N/A (pre-provisioned)</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-semibold">
                          Yes
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral text-sm">5GB-300GB tiers</td>
                    </tr>
                    <tr className="hover:bg-green-50 dark:hover:bg-green-900/10">
                      <td className="px-4 py-3 font-semibold text-light-text dark:text-dark-text">Firestore</td>
                      <td className="px-4 py-3 text-neutral text-sm">Automatic sharding</td>
                      <td className="px-4 py-3 text-green-600 dark:text-green-400 font-semibold">Instant</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                          No
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral text-sm">Unlimited (shards)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key Insights */}
            <div className="mt-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 rounded-lg p-6 border border-green-200 dark:border-green-800">
              <h4 className="font-bold text-light-text dark:text-dark-text mb-3 flex items-center">
                <CheckCircle size={20} className="text-green-600 dark:text-green-400 mr-2" />
                Why This Matters for B2B SaaS
              </h4>
              <div className="space-y-3 text-sm text-neutral">
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                  <p>
                    <strong>No 3am Wake-up Calls:</strong> Auto-scaling handles traffic spikes without paging engineers.
                    Marketing can launch campaigns without coordinating with DevOps.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                  <p>
                    <strong>Cost Optimization:</strong> Cloud Run scales to zero during off-hours. Only pay for actual
                    compute time, not idle capacity. 70% cost reduction vs. over-provisioned VMs.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                  <p>
                    <strong>Predictable Performance:</strong> 99% cache hit rate with Redis ensures consistent ~200ms response
                    times even under extreme load. Critical for enterprise SLAs.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                  <p>
                    <strong>Focus on Features:</strong> Zero time spent managing infrastructure means engineering teams
                    ship product faster. Competitive advantage in fast-moving markets.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Horizontal Scaling */}
            <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-6 shadow-lg border border-neutral/20">
              <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4">
                Horizontal Scaling with Cloud Run
              </h3>
              <p className="text-neutral mb-4">
                Automatically scale container instances based on request load. Cloud Run manages all scaling decisions,
                from 0 to 1000+ instances, without manual configuration.
              </p>
              <div className="relative">
                <button
                  onClick={() => copyToClipboard('gcloud run deploy api --image gcr.io/project/api:latest --platform managed --region us-central1 --allow-unauthenticated --min-instances 0 --max-instances 100 --concurrency 80 --cpu 2 --memory 1Gi --timeout 300', 'scaling-1')}
                  className="absolute top-4 right-4 p-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
                >
                  {copiedCode === 'scaling-1' ? <Check size={16} /> : <Copy size={16} />}
                </button>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`gcloud run deploy api \\
  --image gcr.io/project/api:latest \\
  --platform managed \\
  --region us-central1 \\
  --allow-unauthenticated \\
  --min-instances 0 \\
  --max-instances 100 \\
  --concurrency 80 \\
  --cpu 2 \\
  --memory 1Gi \\
  --timeout 300`}</code>
                </pre>
              </div>
            </div>

            {/* Database Scaling */}
            <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-6 shadow-lg border border-neutral/20">
              <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4">
                Database Read Replicas
              </h3>
              <p className="text-neutral mb-4">
                Distribute read traffic across multiple replicas while maintaining a single write primary.
                Essential for read-heavy applications with high query volumes.
              </p>
              <div className="relative">
                <button
                  onClick={() => copyToClipboard('gcloud sql instances create read-replica-1 --master-instance-name=primary-db --tier=db-n1-standard-2 --replica-type=READ --region=us-east1', 'scaling-2')}
                  className="absolute top-4 right-4 p-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
                >
                  {copiedCode === 'scaling-2' ? <Check size={16} /> : <Copy size={16} />}
                </button>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`gcloud sql instances create read-replica-1 \\
  --master-instance-name=primary-db \\
  --tier=db-n1-standard-2 \\
  --replica-type=READ \\
  --region=us-east1`}</code>
                </pre>
              </div>
            </div>

            {/* Firestore Console Screenshot */}
            <div className="my-12">
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Firestore data structure in the GCP console:
              </p>
              <figure className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <img
                  src="/images/demos/gcp/gcp-firestore-console.png"
                  alt="Firestore console showing NoSQL document collections, data structure, and real-time synchronization"
                  className="w-full rounded-md"
                  loading="lazy"
                />
                <figcaption className="mt-3 text-sm font-medium text-center text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
                  Firestore console interface showing NoSQL document structure, collections, and real-time data synchronization across regions
                </figcaption>
              </figure>
            </div>

            {/* Caching Strategy */}
            <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-6 shadow-lg border border-neutral/20">
              <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4">
                Redis Caching Pattern
              </h3>
              <p className="text-neutral mb-4">
                Implement cache-aside pattern with Memorystore Redis to reduce database load and improve response times
                for frequently accessed data.
              </p>
              <div className="relative">
                <button
                  onClick={() => copyToClipboard(`import redis
from functools import wraps

redis_client = redis.Redis(host='10.0.0.3', port=6379)

def cached(ttl=300):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            cache_key = f"{func.__name__}:{args}:{kwargs}"
            cached_result = redis_client.get(cache_key)

            if cached_result:
                return json.loads(cached_result)

            result = await func(*args, **kwargs)
            redis_client.setex(cache_key, ttl, json.dumps(result))
            return result
        return wrapper
    return decorator`, 'scaling-3')}
                  className="absolute top-4 right-4 p-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
                >
                  {copiedCode === 'scaling-3' ? <Check size={16} /> : <Copy size={16} />}
                </button>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`import redis
from functools import wraps

redis_client = redis.Redis(host='10.0.0.3', port=6379)

def cached(ttl=300):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            cache_key = f"{func.__name__}:{args}:{kwargs}"
            cached_result = redis_client.get(cache_key)

            if cached_result:
                return json.loads(cached_result)

            result = await func(*args, **kwargs)
            redis_client.setex(cache_key, ttl, json.dumps(result))
            return result
        return wrapper
    return decorator`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Cost Management */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-light-text dark:text-dark-text">
            Cost Management & Optimization
          </h2>
          <p className="text-lg leading-relaxed mb-8 text-neutral">
            Estimated monthly costs across different scale tiers, based on real production workloads.
          </p>

          {/* Cost Table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full bg-light-bg dark:bg-dark-bg rounded-lg overflow-hidden border border-neutral/20">
              <thead className="bg-green-100 dark:bg-green-900/20">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-green-800 dark:text-green-300">Scale Tier</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-green-800 dark:text-green-300">Users</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-green-800 dark:text-green-300">Compute</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-green-800 dark:text-green-300">Database</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-green-800 dark:text-green-300">Storage</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-green-800 dark:text-green-300">Monitoring</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-green-800 dark:text-green-300">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral/20">
                {costBreakdown.map((row, index) => (
                  <tr key={index} className="hover:bg-green-50 dark:hover:bg-green-900/10">
                    <td className="px-6 py-4 font-semibold text-light-text dark:text-dark-text">{row.tier}</td>
                    <td className="px-6 py-4 text-neutral">{row.users}</td>
                    <td className="px-6 py-4 text-neutral">{row.compute}</td>
                    <td className="px-6 py-4 text-neutral">{row.database}</td>
                    <td className="px-6 py-4 text-neutral">{row.storage}</td>
                    <td className="px-6 py-4 text-neutral">{row.monitoring}</td>
                    <td className="px-6 py-4 font-bold text-green-700 dark:text-green-400">{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Optimization Tips */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Use Committed Use Discounts', desc: '57% savings on predictable workloads' },
              { title: 'Implement Auto-Scaling', desc: 'Scale to zero during off-hours' },
              { title: 'Right-Size Resources', desc: 'Monitor and adjust CPU/memory allocation' },
              { title: 'Use Cloud CDN', desc: 'Reduce egress costs by 40-60%' },
              { title: 'Archive Old Data', desc: 'Move to Nearline/Coldline storage' },
              { title: 'Set Budget Alerts', desc: 'Get notified before overspending' }
            ].map((tip, index) => (
              <div key={index} className="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">{tip.title}</h4>
                <p className="text-sm text-neutral">{tip.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Security Best Practices */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-light-text dark:text-dark-text">
            Security Best Practices
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* IAM & Access Control */}
            <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-6 shadow-lg border border-neutral/20">
              <div className="flex items-center space-x-3 mb-4">
                <Lock className="text-green-600 dark:text-green-400" size={24} />
                <h3 className="text-xl font-bold text-light-text dark:text-dark-text">IAM & Access Control</h3>
              </div>
              <ul className="space-y-2 text-sm text-neutral">
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  Principle of least privilege for service accounts
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  Workload Identity for GKE pods
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  Automated IAM policy reviews
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  MFA enforcement for all human access
                </li>
              </ul>
            </div>

            {/* Network Security */}
            <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-6 shadow-lg border border-neutral/20">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="text-green-600 dark:text-green-400" size={24} />
                <h3 className="text-xl font-bold text-light-text dark:text-dark-text">Network Security</h3>
              </div>
              <ul className="space-y-2 text-sm text-neutral">
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  VPC with private subnets for databases
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  Cloud Armor for DDoS protection
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  SSL/TLS termination at load balancer
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  Cloud NAT for outbound connections
                </li>
              </ul>
            </div>

            {/* Data Encryption */}
            <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-6 shadow-lg border border-neutral/20">
              <div className="flex items-center space-x-3 mb-4">
                <Database className="text-green-600 dark:text-green-400" size={24} />
                <h3 className="text-xl font-bold text-light-text dark:text-dark-text">Data Encryption</h3>
              </div>
              <ul className="space-y-2 text-sm text-neutral">
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  Encryption at rest (default on all GCP services)
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  Encryption in transit with TLS 1.3
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  Customer-managed encryption keys (CMEK)
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  Secret Manager for API keys and credentials
                </li>
              </ul>
            </div>

            {/* Compliance & Auditing */}
            <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-6 shadow-lg border border-neutral/20">
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="text-green-600 dark:text-green-400" size={24} />
                <h3 className="text-xl font-bold text-light-text dark:text-dark-text">Compliance & Auditing</h3>
              </div>
              <ul className="space-y-2 text-sm text-neutral">
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  Cloud Audit Logs for all API calls
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  Security Command Center monitoring
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  Automated compliance scanning
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  Data residency controls (regional storage)
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Deployment & CI/CD */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-light-text dark:text-dark-text">
            Deployment Pipeline & CI/CD
          </h2>
          <p className="text-lg leading-relaxed mb-8 text-neutral">
            Automated deployment pipeline using Cloud Build for continuous integration and delivery.
          </p>

          <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-6 shadow-lg border border-neutral/20 mb-6">
            <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4">
              Cloud Build Configuration
            </h3>
            <div className="relative">
              <button
                onClick={() => copyToClipboard(`steps:
  # Build Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/api:$COMMIT_SHA', '.']

  # Push to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/api:$COMMIT_SHA']

  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'api'
      - '--image'
      - 'gcr.io/$PROJECT_ID/api:$COMMIT_SHA'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'

images:
  - 'gcr.io/$PROJECT_ID/api:$COMMIT_SHA'`, 'cicd-1')}
                className="absolute top-4 right-4 p-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
              >
                {copiedCode === 'cicd-1' ? <Check size={16} /> : <Copy size={16} />}
              </button>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`steps:
  # Build Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/api:$COMMIT_SHA', '.']

  # Push to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/api:$COMMIT_SHA']

  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'api'
      - '--image'
      - 'gcr.io/$PROJECT_ID/api:$COMMIT_SHA'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'

images:
  - 'gcr.io/$PROJECT_ID/api:$COMMIT_SHA'`}</code>
              </pre>
            </div>

            {/* Cloud Build History Screenshot */}
            <div className="my-12">
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Automated deployment pipeline in action:
              </p>
              <figure className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <img
                  src="/images/demos/gcp/gcp-cloud-build-history.png"
                  alt="Cloud Build pipeline history showing automated builds, tests, and deployments to Cloud Run"
                  className="w-full rounded-md"
                  loading="lazy"
                />
                <figcaption className="mt-3 text-sm font-medium text-center text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
                  Cloud Build pipeline history showing automated container builds, test execution, and deployment to Cloud Run with sub-5-minute build times
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* Observability Stack */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-light-text dark:text-dark-text">
            Observability Stack
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-6 shadow-lg border border-neutral/20">
              <Gauge className="text-blue-600 dark:text-blue-400 mb-4" size={32} />
              <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-3">Monitoring</h3>
              <p className="text-sm text-neutral mb-4">
                Cloud Monitoring with custom dashboards for request latency, error rates, and resource utilization.
              </p>
              <ul className="space-y-2 text-xs text-neutral">
                <li>• Golden signals: Latency, Traffic, Errors, Saturation</li>
                <li>• Custom metrics from application code</li>
                <li>• Uptime checks with alerting</li>
              </ul>
            </div>

            <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-6 shadow-lg border border-neutral/20">
              <Database className="text-purple-600 dark:text-purple-400 mb-4" size={32} />
              <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-3">Logging</h3>
              <p className="text-sm text-neutral mb-4">
                Centralized logging with Cloud Logging, structured JSON logs, and log-based metrics.
              </p>
              <ul className="space-y-2 text-xs text-neutral">
                <li>• Automatic log collection from Cloud Run</li>
                <li>• Log severity filtering (DEBUG to CRITICAL)</li>
                <li>• Long-term archival to Cloud Storage</li>
              </ul>
            </div>

            <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-6 shadow-lg border border-neutral/20">
              <Workflow className="text-green-600 dark:text-green-400 mb-4" size={32} />
              <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-3">Tracing</h3>
              <p className="text-sm text-neutral mb-4">
                Cloud Trace for distributed tracing across microservices and external API calls.
              </p>
              <ul className="space-y-2 text-xs text-neutral">
                <li>• End-to-end request tracing</li>
                <li>• Latency analysis per service</li>
                <li>• Integration with OpenTelemetry</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Implementation Roadmap */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-light-text dark:text-dark-text">
            Implementation Roadmap
          </h2>
          <p className="text-lg leading-relaxed mb-8 text-neutral">
            6-week implementation plan from initial setup to production-ready deployment.
          </p>

          <div className="space-y-4">
            {implementationPhases.map((phase, index) => (
              <div key={index} className="bg-light-bg dark:bg-dark-bg rounded-lg border border-neutral/20 overflow-hidden">
                <button
                  onClick={() => setOpenPhase(openPhase === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {index + 1}
                    </span>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-light-text dark:text-dark-text">
                        {phase.phase}
                      </h3>
                      <p className="text-sm text-neutral">{phase.description}</p>
                    </div>
                  </div>
                  <ArrowRight
                    size={20}
                    className={`text-green-600 dark:text-green-400 transform transition-transform ${
                      openPhase === index ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {openPhase === index && (
                  <div className="px-6 pb-6 border-t border-neutral/20 pt-4">
                    <ul className="space-y-3">
                      {phase.tasks.map((task, i) => (
                        <li key={i} className="flex items-start space-x-3">
                          <CheckCircle size={18} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-neutral">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <div className="mt-16 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold mb-2 text-light-text dark:text-dark-text">
            Ready to discuss cloud architecture?
          </h3>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Let's talk about scalability, cost optimization, and building production-ready systems on GCP.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="https://linkedin.com/in/gavin-kelly1"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Connect on LinkedIn
            </a>
            <Link
              to="/demos/stripe-integration"
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Previous: Stripe Integration
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-16">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-primary dark:text-secondary hover:opacity-80 font-medium"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/demos/stripe-integration"
            className="inline-flex items-center space-x-2 text-primary dark:text-secondary hover:opacity-80 font-medium"
          >
            <span>Next: Stripe Integration</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GCPArchitecture;

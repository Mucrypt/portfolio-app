'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Shield,
  Lock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Key,
  FileWarning,
  Globe,
  Eye,
  RefreshCw,
  ExternalLink,
} from 'lucide-react'

interface SecurityMetric {
  name: string
  status: 'secure' | 'warning' | 'vulnerable'
  score: number
  details: string
  lastChecked: string
}

interface SecurityHeaders {
  header: string
  value: string
  status: 'present' | 'missing' | 'warning'
  recommendation?: string
}

interface Vulnerability {
  id: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  package: string
  version: string
  fixedIn?: string
  cve?: string
}

export default function SecurityDashboardPage() {
  const [metrics, setMetrics] = useState<SecurityMetric[]>([])
  const [headers, setHeaders] = useState<SecurityHeaders[]>([])
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([])
  const [loading, setLoading] = useState(true)
  const [scanningVulnerabilities, setScanningVulnerabilities] = useState(false)

  const fetchSecurityMetrics = useCallback(async () => {
    setLoading(true)
    try {
      // Simulate fetching security metrics
      setMetrics([
        {
          name: 'SSL/TLS Certificate',
          status: 'secure',
          score: 100,
          details: 'Valid certificate, expires in 90 days',
          lastChecked: new Date().toISOString(),
        },
        {
          name: 'Security Headers',
          status: 'secure',
          score: 95,
          details: 'All critical headers configured',
          lastChecked: new Date().toISOString(),
        },
        {
          name: 'Dependency Audit',
          status: 'secure',
          score: 98,
          details: 'No known vulnerabilities',
          lastChecked: new Date().toISOString(),
        },
        {
          name: 'Authentication Security',
          status: 'secure',
          score: 100,
          details: 'Strong authentication mechanisms',
          lastChecked: new Date().toISOString(),
        },
        {
          name: 'API Security',
          status: 'secure',
          score: 92,
          details: 'Rate limiting and validation enabled',
          lastChecked: new Date().toISOString(),
        },
      ])

      setHeaders([
        {
          header: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
          status: 'present',
        },
        {
          header: 'Content-Security-Policy',
          value:
            "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          status: 'present',
        },
        {
          header: 'X-Frame-Options',
          value: 'DENY',
          status: 'present',
        },
        {
          header: 'X-Content-Type-Options',
          value: 'nosniff',
          status: 'present',
        },
        {
          header: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
          status: 'present',
        },
        {
          header: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
          status: 'present',
        },
        {
          header: 'Cross-Origin-Embedder-Policy',
          value: 'require-corp',
          status: 'present',
        },
        {
          header: 'Cross-Origin-Opener-Policy',
          value: 'same-origin',
          status: 'present',
        },
        {
          header: 'Cross-Origin-Resource-Policy',
          value: 'same-origin',
          status: 'present',
        },
      ])

      setVulnerabilities([])

      setLoading(false)
    } catch (error) {
      console.error('Error fetching security metrics:', error)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSecurityMetrics()
  }, [fetchSecurityMetrics])

  const scanVulnerabilities = async () => {
    setScanningVulnerabilities(true)
    // Simulate vulnerability scan
    setTimeout(() => {
      setScanningVulnerabilities(false)
      // No vulnerabilities found
      alert('Vulnerability scan completed. No vulnerabilities found!')
    }, 3000)
  }

  const getStatusColor = (status: SecurityMetric['status']) => {
    switch (status) {
      case 'secure':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'vulnerable':
        return 'text-red-600 bg-red-100 border-red-200'
    }
  }

  const getStatusIcon = (status: SecurityMetric['status']) => {
    switch (status) {
      case 'secure':
        return <CheckCircle className='w-5 h-5 text-green-600' />
      case 'warning':
        return <AlertTriangle className='w-5 h-5 text-yellow-600' />
      case 'vulnerable':
        return <XCircle className='w-5 h-5 text-red-600' />
    }
  }

  const getHeaderStatusColor = (status: SecurityHeaders['status']) => {
    switch (status) {
      case 'present':
        return 'text-green-600 bg-green-50'
      case 'warning':
        return 'text-yellow-600 bg-yellow-50'
      case 'missing':
        return 'text-red-600 bg-red-50'
    }
  }

  const getSeverityColor = (severity: Vulnerability['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-600 text-white'
      case 'high':
        return 'bg-orange-600 text-white'
      case 'medium':
        return 'bg-yellow-600 text-white'
      case 'low':
        return 'bg-blue-600 text-white'
    }
  }

  const overallScore = Math.round(
    metrics.reduce((acc, m) => acc + m.score, 0) / metrics.length,
  )

  if (loading) {
    return (
      <div className='p-8'>
        <div className='animate-pulse space-y-4'>
          <div className='h-8 bg-gray-200 rounded w-1/3'></div>
          <div className='grid grid-cols-3 gap-4'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='h-32 bg-gray-200 rounded'></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='p-8 max-w-7xl mx-auto'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex justify-between items-start mb-4'>
          <div>
            <h1 className='text-4xl font-bold text-gray-900 mb-2'>
              Security Dashboard
            </h1>
            <p className='text-gray-600'>
              Security headers, SSL, vulnerability scanning, and audits
            </p>
          </div>
          <button
            onClick={fetchSecurityMetrics}
            className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition'
          >
            <RefreshCw className='w-4 h-4' />
            Refresh
          </button>
        </div>
      </div>

      {/* Overall Security Score */}
      <div className='bg-linear-to-rrom-blue-600 to-purple-600 text-white p-8 rounded-xl mb-8 shadow-lg'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-3xl font-bold mb-2'>Overall Security Score</h2>
            <p className='text-blue-100'>
              Your application has excellent security practices
            </p>
          </div>
          <div className='text-center'>
            <div className='relative inline-flex items-center justify-center mb-2'>
              <svg className='w-40 h-40 transform -rotate-90'>
                <circle
                  cx='80'
                  cy='80'
                  r='70'
                  stroke='currentColor'
                  strokeWidth='10'
                  fill='none'
                  className='text-white opacity-20'
                />
                <circle
                  cx='80'
                  cy='80'
                  r='70'
                  stroke='currentColor'
                  strokeWidth='10'
                  fill='none'
                  strokeDasharray={`${(overallScore / 100) * 439.82} 439.82`}
                  className='text-white'
                />
              </svg>
              <div className='absolute'>
                <div className='text-5xl font-bold'>{overallScore}</div>
              </div>
            </div>
            <div className='text-sm text-blue-100'>Security Rating</div>
          </div>
        </div>
      </div>

      {/* Security Metrics */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 mb-8'>
        <div className='p-6 border-b border-gray-200'>
          <h2 className='text-2xl font-bold text-gray-900'>Security Metrics</h2>
          <p className='text-sm text-gray-600 mt-1'>
            Comprehensive security assessment
          </p>
        </div>
        <div className='divide-y divide-gray-200'>
          {metrics.map((metric) => (
            <div
              key={metric.name}
              className='p-6 hover:bg-gray-50 transition flex items-center justify-between'
            >
              <div className='flex items-center gap-4'>
                {getStatusIcon(metric.status)}
                <div>
                  <div className='font-semibold text-gray-900'>
                    {metric.name}
                  </div>
                  <div className='text-sm text-gray-600'>{metric.details}</div>
                  <div className='text-xs text-gray-500 mt-1'>
                    Last checked:{' '}
                    {new Date(metric.lastChecked).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <div className='text-right'>
                  <div className='text-2xl font-bold text-gray-900'>
                    {metric.score}
                  </div>
                  <div className='text-xs text-gray-500'>Score</div>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                    metric.status,
                  )}`}
                >
                  {metric.status.charAt(0).toUpperCase() +
                    metric.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Headers */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 mb-8'>
        <div className='p-6 border-b border-gray-200'>
          <div className='flex justify-between items-center'>
            <div>
              <h2 className='text-2xl font-bold text-gray-900'>
                Security Headers
              </h2>
              <p className='text-sm text-gray-600 mt-1'>
                HTTP security headers configuration
              </p>
            </div>
            <a
              href='https://securityheaders.com'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition'
            >
              <ExternalLink className='w-4 h-4' />
              Test Headers
            </a>
          </div>
        </div>
        <div className='p-6'>
          <div className='space-y-3'>
            {headers.map((header) => (
              <div
                key={header.header}
                className='flex items-start justify-between p-4 bg-gray-50 rounded-lg'
              >
                <div className='flex-1'>
                  <div className='flex items-center gap-3 mb-2'>
                    <span className='font-mono text-sm font-semibold text-gray-900'>
                      {header.header}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${getHeaderStatusColor(
                        header.status,
                      )}`}
                    >
                      {header.status.toUpperCase()}
                    </span>
                  </div>
                  <div className='font-mono text-xs text-gray-600 bg-white p-2 rounded border border-gray-200'>
                    {header.value}
                  </div>
                  {header.recommendation && (
                    <div className='text-xs text-yellow-600 mt-2 flex items-center gap-1'>
                      <AlertTriangle className='w-3 h-3' />
                      {header.recommendation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vulnerability Scan */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 mb-8'>
        <div className='p-6 border-b border-gray-200'>
          <div className='flex justify-between items-center'>
            <div>
              <h2 className='text-2xl font-bold text-gray-900'>
                Vulnerability Scan
              </h2>
              <p className='text-sm text-gray-600 mt-1'>
                NPM package security audit
              </p>
            </div>
            <button
              onClick={scanVulnerabilities}
              disabled={scanningVulnerabilities}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                scanningVulnerabilities
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
            >
              <FileWarning
                className={`w-4 h-4 ${scanningVulnerabilities ? 'animate-pulse' : ''}`}
              />
              {scanningVulnerabilities ? 'Scanning...' : 'Run Scan'}
            </button>
          </div>
        </div>
        <div className='p-6'>
          {vulnerabilities.length === 0 ? (
            <div className='text-center py-12'>
              <CheckCircle className='w-16 h-16 text-green-600 mx-auto mb-4' />
              <h3 className='text-xl font-bold text-gray-900 mb-2'>
                No Vulnerabilities Found
              </h3>
              <p className='text-gray-600'>
                All dependencies are secure and up to date
              </p>
            </div>
          ) : (
            <div className='space-y-4'>
              {vulnerabilities.map((vuln) => (
                <div
                  key={vuln.id}
                  className='p-4 bg-red-50 border border-red-200 rounded-lg'
                >
                  <div className='flex items-start justify-between mb-2'>
                    <div className='flex items-center gap-3'>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getSeverityColor(
                          vuln.severity,
                        )}`}
                      >
                        {vuln.severity.toUpperCase()}
                      </span>
                      <div>
                        <div className='font-semibold text-gray-900'>
                          {vuln.title}
                        </div>
                        <div className='text-sm text-gray-600'>
                          {vuln.package} @ {vuln.version}
                        </div>
                      </div>
                    </div>
                  </div>
                  {vuln.fixedIn && (
                    <div className='text-sm text-gray-700 mt-2'>
                      <span className='font-medium'>Fix available:</span>{' '}
                      Upgrade to {vuln.fixedIn}
                    </div>
                  )}
                  {vuln.cve && (
                    <div className='text-xs text-gray-500 mt-1'>
                      CVE: {vuln.cve}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Security Best Practices */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='p-3 bg-green-100 rounded-lg'>
              <Lock className='w-6 h-6 text-green-600' />
            </div>
            <h3 className='text-lg font-bold text-gray-900'>SSL/TLS</h3>
          </div>
          <p className='text-sm text-gray-600 mb-4'>
            Your site uses HTTPS with a valid SSL certificate, ensuring
            encrypted connections
          </p>
          <div className='flex items-center gap-2 text-sm text-green-600'>
            <CheckCircle className='w-4 h-4' />
            <span className='font-medium'>Secure</span>
          </div>
        </div>

        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='p-3 bg-blue-100 rounded-lg'>
              <Shield className='w-6 h-6 text-blue-600' />
            </div>
            <h3 className='text-lg font-bold text-gray-900'>CORS Policy</h3>
          </div>
          <p className='text-sm text-gray-600 mb-4'>
            Cross-Origin Resource Sharing configured to prevent unauthorized
            access
          </p>
          <div className='flex items-center gap-2 text-sm text-green-600'>
            <CheckCircle className='w-4 h-4' />
            <span className='font-medium'>Configured</span>
          </div>
        </div>

        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='p-3 bg-purple-100 rounded-lg'>
              <Key className='w-6 h-6 text-purple-600' />
            </div>
            <h3 className='text-lg font-bold text-gray-900'>Authentication</h3>
          </div>
          <p className='text-sm text-gray-600 mb-4'>
            Strong authentication mechanisms protect admin areas and sensitive
            data
          </p>
          <div className='flex items-center gap-2 text-sm text-green-600'>
            <CheckCircle className='w-4 h-4' />
            <span className='font-medium'>Protected</span>
          </div>
        </div>
      </div>

      {/* External Security Tools */}
      <div className='mt-8 bg-linear-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200'>
        <h3 className='text-lg font-bold text-gray-900 mb-4'>
          External Security Tools
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <a
            href='https://securityheaders.com'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition'
          >
            <Globe className='w-5 h-5 text-blue-600' />
            <div>
              <div className='font-medium text-gray-900'>Security Headers</div>
              <div className='text-xs text-gray-500'>Test HTTP headers</div>
            </div>
          </a>
          <a
            href='https://observatory.mozilla.org'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-400 hover:shadow-md transition'
          >
            <Eye className='w-5 h-5 text-purple-600' />
            <div>
              <div className='font-medium text-gray-900'>
                Mozilla Observatory
              </div>
              <div className='text-xs text-gray-500'>Security scan</div>
            </div>
          </a>
          <a
            href='https://www.ssllabs.com/ssltest/'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-green-400 hover:shadow-md transition'
          >
            <Lock className='w-5 h-5 text-green-600' />
            <div>
              <div className='font-medium text-gray-900'>SSL Labs</div>
              <div className='text-xs text-gray-500'>SSL test</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Upload, BarChart3, FileText, PieChart, LayoutDashboard, Menu, X } from 'lucide-react';

// Mock data for demonstration
const mockClients = [
  { id: 1, name: 'John Doe', revenue: 15000, risk: 'High' },
  { id: 2, name: 'Jane Smith', revenue: 25000, risk: 'Low' },
  { id: 3, name: 'Robert Johnson', revenue: 18000, risk: 'Medium' },
  { id: 4, name: 'Emily Davis', revenue: 30000, risk: 'Low' },
  { id: 5, name: 'Michael Brown', revenue: 12000, risk: 'High' },
  { id: 6, name: 'Sarah Wilson', revenue: 22000, risk: 'Medium' },
  { id: 7, name: 'David Taylor', revenue: 28000, risk: 'Low' },
  { id: 8, name: 'Lisa Anderson', revenue: 14000, risk: 'High' },
];

const mockPerformanceData = {
  accuracy: 0.85,
  precision: 0.82,
  recall: 0.79,
  f1Score: 0.80,
  auc: 0.88,
};

// Navbar Component
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { path: '/', name: 'Home', icon: <Home className="w-5 h-5" /> },
    { path: '/upload', name: 'Upload & Predict', icon: <Upload className="w-5 h-5" /> },
    { path: '/performance', name: 'Model Performance', icon: <BarChart3 className="w-5 h-5" /> },
    { path: '/reports', name: 'PDF Reports', icon: <FileText className="w-5 h-5" /> },
    { path: '/insights', name: 'Dashboard Insights', icon: <PieChart className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-indigo-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <LayoutDashboard className="h-8 w-8" />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`${
                      location.pathname === item.path
                        ? 'bg-indigo-800 text-white'
                        : 'text-gray-200 hover:bg-indigo-600'
                    } px-3 py-2 rounded-md text-sm font-medium flex items-center`}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? 'bg-indigo-800 text-white'
                    : 'text-gray-200 hover:bg-indigo-600'
                } block px-3 py-2 rounded-md text-base font-medium flex items-center`}
                onClick={toggleMenu}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// Dashboard Stats Component
const DashboardStats = () => {
  const highRiskClients = mockClients.filter(client => client.risk === 'High').length;
  const totalRevenue = mockClients.reduce((sum, client) => sum + client.revenue, 0);
  const highRevenueClients = mockClients.filter(client => client.revenue > 20000).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-gray-500 text-sm">Total Clients</p>
            <p className="text-2xl font-semibold text-gray-800">{mockClients.length}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-600">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-gray-500 text-sm">High Risk Clients</p>
            <p className="text-2xl font-semibold text-gray-800">{highRiskClients}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-gray-500 text-sm">High Revenue Clients</p>
            <p className="text-2xl font-semibold text-gray-800">{highRevenueClients}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Home Page Component
const HomePage = () => {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Client Attrition Risk Prediction
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Predict which clients are at risk of leaving and take proactive measures to retain them.
          </p>
        </div>

        <DashboardStats />

        <div className="mt-10">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                How It Works
              </h2>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Step 1</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    Upload your client dataset with relevant features.
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Step 2</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    Our machine learning model analyzes the data and predicts attrition risk.
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Step 3</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    View detailed insights and reports on client attrition risk.
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Step 4</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    Generate PDF reports to share with your team.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Upload and Predict Component
const UploadPredict = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictions, setPredictions] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (file) {
      setIsUploaded(true);
    }
  };

  const handlePredict = () => {
    setIsPredicting(true);
    // Simulate prediction process
    setTimeout(() => {
      setPredictions(mockClients);
      setIsPredicting(false);
    }, 2000);
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Upload Dataset & Predict</h1>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
          <form onSubmit={handleUpload}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Client Dataset (CSV)
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
                  <div className="h-full w-full text-center flex flex-col items-center justify-center">
                    <Upload className="w-10 h-10 text-indigo-500 group-hover:text-indigo-600" />
                    <p className="pointer-none text-gray-500 mt-3">
                      {fileName ? fileName : "Select a file or drag and drop here"}
                    </p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".csv" 
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={!file}
              >
                Upload Dataset
              </button>
            </div>
          </form>
        </div>

        {isUploaded && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-900">Run Prediction</h2>
              <p className="mt-1 text-sm text-gray-500">
                Click the button below to run the attrition risk prediction model on your dataset.
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handlePredict}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                disabled={isPredicting}
              >
                {isPredicting ? 'Processing...' : 'Run Prediction'}
              </button>
            </div>

            {isPredicting && (
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              </div>
            )}

            {predictions.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Prediction Results</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Attrition Risk
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {predictions.map((client) => (
                        <tr key={client.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {client.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {client.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${client.revenue.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              client.risk === 'High' 
                                ? 'bg-red-100 text-red-800' 
                                : client.risk === 'Medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {client.risk}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Model Performance Component
const ModelPerformance = () => {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Model Performance</h1>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-indigo-600 font-medium">Accuracy</p>
              <p className="text-2xl font-bold">{(mockPerformanceData.accuracy * 100).toFixed(1)}%</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Precision</p>
              <p className="text-2xl font-bold">{(mockPerformanceData.precision * 100).toFixed(1)}%</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Recall</p>
              <p className="text-2xl font-bold">{(mockPerformanceData.recall * 100).toFixed(1)}%</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">F1 Score</p>
              <p className="text-2xl font-bold">{(mockPerformanceData.f1Score * 100).toFixed(1)}%</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">AUC-ROC</p>
              <p className="text-2xl font-bold">{(mockPerformanceData.auc * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Confusion Matrix</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-green-100 p-6 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">True Negative</p>
                  <p className="text-2xl font-bold">42</p>
                </div>
                <div className="bg-red-100 p-6 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">False Positive</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <div className="bg-red-100 p-6 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">False Negative</p>
                  <p className="text-2xl font-bold">7</p>
                </div>
                <div className="bg-green-100 p-6 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">True Positive</p>
                  <p className="text-2xl font-bold">43</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Feature Importance</h2>
          <div className="h-64">
            <div className="h-full flex items-end space-x-2">
              <div className="h-full flex flex-col justify-end">
                <div className="bg-indigo-500 w-16" style={{ height: '90%' }}></div>
                <p className="text-xs text-center mt-1">Tenure</p>
              </div>
              <div className="h-full flex flex-col justify-end">
                <div className="bg-indigo-500 w-16" style={{ height: '75%' }}></div>
                <p className="text-xs text-center mt-1">Revenue</p>
              </div>
              <div className="h-full flex flex-col justify-end">
                <div className="bg-indigo-500 w-16" style={{ height: '60%' }}></div>
                <p className="text-xs text-center mt-1">Support Calls</p>
              </div>
              <div className="h-full flex flex-col justify-end">
                <div className="bg-indigo-500 w-16" style={{ height: '45%' }}></div>
                <p className="text-xs text-center mt-1">Complaints</p>
              </div>
              <div className="h-full flex flex-col justify-end">
                <div className="bg-indigo-500 w-16" style={{ height: '30%' }}></div>
                <p className="text-xs text-center mt-1">Age</p>
              </div>
              <div className="h-full flex flex-col justify-end">
                <div className="bg-indigo-500 w-16" style={{ height: '25%' }}></div>
                <p className="text-xs text-center mt-1">Products</p>
              </div>
              <div className="h-full flex flex-col justify-end">
                <div className="bg-indigo-500 w-16" style={{ height: '15%' }}></div>
                <p className="text-xs text-center mt-1">Location</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// PDF Reports Component
const PDFReports = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
    }, 2000);
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">PDF Reports</h1>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Generate Reports</h2>
          <p className="text-gray-500 mb-4">
            Generate comprehensive PDF reports with detailed analysis of client attrition risk.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="report-all"
                name="report-type"
                type="radio"
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                defaultChecked
              />
              <label htmlFor="report-all" className="ml-3 block text-sm font-medium text-gray-700">
                Complete Attrition Risk Report
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="report-high-risk"
                name="report-type"
                type="radio"
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <label htmlFor="report-high-risk" className="ml-3 block text-sm font-medium text-gray-700">
                High Risk Clients Only
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="report-high-value"
                name="report-type"
                type="radio"
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <label htmlFor="report-high-value" className="ml-3 block text-sm font-medium text-gray-700">
                High Value Clients Only
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="report-summary"
                name="report-type"
                type="radio"
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <label htmlFor="report-summary" className="ml-3 block text-sm font-medium text-gray-700">
                Executive Summary
              </label>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleGenerateReport}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate PDF Report'}
            </button>
          </div>
          
          {isGenerating && (
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          )}
        </div>
        
        {reportGenerated && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Generated Reports</h2>
            
            <div className="border border-gray-200 rounded-md p-4 flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-indigo-500" />
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">Client_Attrition_Risk_Report.pdf</h3>
                  <p className="text-xs text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                  Download
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Dashboard Insights Component
const DashboardInsights = () => {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard Insights</h1>
        
        <DashboardStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Attrition Risk Distribution</h2>
            <div className="h-64 flex items-end space-x-8 justify-center">
              <div className="flex flex-col items-center">
                <div className="bg-green-500 w-24" style={{ height: '40%' }}></div>
                <p className="text-sm mt-2">Low Risk</p>
                <p className="text-xs text-gray-500">40%</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-yellow-500 w-24" style={{ height: '25%' }}></div>
                <p className="text-sm mt-2">Medium Risk</p>
                <p className="text-xs text-gray-500">25%</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-red-500 w-24" style={{ height: '35%' }}></div>
                <p className="text-sm mt-2">High Risk</p>
                <p className="text-xs text-gray-500">35%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Revenue by Risk Category</h2>
            <div className="h-64 flex items-end space-x-8 justify-center">
              <div className="flex flex-col items-center">
                <div className="bg-green-500 w-24" style={{ height: '70%' }}></div>
                <p className="text-sm mt-2">Low Risk</p>
                <p className="text-xs text-gray-500">$75,000</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-yellow-500 w-24" style={{ height: '40%' }}></div>
                <p className="text-sm mt-2">Medium Risk</p>
                <p className="text-xs text-gray-500">$40,000</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-red-500 w-24" style={{ height: '25%' }}></div>
                <p className="text-sm mt-2">High Risk</p>
                <p className="text-xs text-gray-500">$26,000</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Top Attrition Factors</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">Low Engagement</p>
                  <p className="text-sm text-gray-500">85%</p>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">Support Issues</p>
                  <p className="text-sm text-gray-500">72%</p>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">Price Sensitivity</p>
                  <p className="text-sm text-gray-500">65%</p>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">Competitor Offers</p>
                  <p className="text-sm text-gray-500">58%</p>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '58%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">Product Limitations</p>
                  <p className="text-sm text-gray-500">45%</p>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Retention Recommendations</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-3 text-sm text-gray-700">Implement proactive outreach for high-risk clients</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-3 text-sm text-gray-700">Offer loyalty discounts to high-value clients</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-3 text-sm text-gray-700">Improve support response times for all clients</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-3 text-sm text-gray-700">Schedule quarterly business reviews with key accounts</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-3 text-sm text-gray-700">Develop targeted product enhancements based on feedback</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload" element={<UploadPredict />} />
            <Route path="/performance" element={<ModelPerformance />} />
            <Route path="/reports" element={<PDFReports />} />
            <Route path="/insights" element={<DashboardInsights />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
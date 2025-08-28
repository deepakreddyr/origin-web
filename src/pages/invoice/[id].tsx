// pages/invoice/[id].tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Loader2, AlertCircle, Download, ArrowLeft, ExternalLink, Eye } from 'lucide-react';

const InvoicePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [invoiceContent, setInvoiceContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showFallback, setShowFallback] = useState<boolean>(false);
  
  const invoiceId = Array.isArray(id) ? id[0] : id;
  // console.log(process.env.NEXT_PUBLIC_BACKEND_API_URL);
  const apiUrl = invoiceId ? `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/public/preview-store-invoice/${invoiceId}` : '';
  // console.log(apiUrl, "API");

  // Detect mobile device and browser capabilities
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isAndroid = /android/i.test(userAgent);
      const isChrome = /chrome/i.test(userAgent);
      
      // Android Chrome often has issues with PDF iframes
      const shouldUseFallback = isMobileDevice && (isAndroid || isChrome);
      
      setIsMobile(isMobileDevice);
      setShowFallback(shouldUseFallback);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (invoiceId && typeof invoiceId === 'string') {
      fetchInvoice();
    }
  }, [invoiceId]);

  const fetchInvoice = async (): Promise<void> => {
    if (!invoiceId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Invoice not found');
        } else if (response.status === 403) {
          throw new Error('Access denied to this invoice');
        } else {
          throw new Error(`Failed to load invoice (${response.status})`);
        }
      }
      
      const blob = await response.blob();
      const pdfUrl = window.URL.createObjectURL(blob);
      setInvoiceContent(pdfUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching invoice:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (): void => {
    if (invoiceContent && invoiceId) {
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = invoiceContent;
      a.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleOpenExternal = (): void => {
    if (invoiceContent) {
      // Open PDF in new tab/window - better mobile support
      window.open(invoiceContent, '_blank');
    }
  };

  const handlePrint = (): void => {
    if (isMobile) {
      // On mobile, open in new tab for printing
      handleOpenExternal();
    } else {
      window.print();
    }
  };

  const goBack = (): void => {
    router.back();
  };

  // Show loading until we have a valid ID
  if (!invoiceId || loading) {
    return (
      <>
        <Head>
          <title>Loading Invoice - Origin Fresh</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Invoice</h2>
            <p className="text-gray-600">Please wait while we fetch your invoice...</p>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Head>
          <title>Invoice Error - Origin Fresh</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md mx-auto text-center p-6">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invoice Not Available</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={fetchInvoice}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={goBack}
                className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const displayId = typeof invoiceId === 'string' && invoiceId.includes('@') 
    ? invoiceId.split('@')[1] 
    : invoiceId;

  // Main invoice display
  return (
    <>
      <Head>
        <title>Invoice {displayId} - Origin Fresh</title>
        <meta name="description" content={`Origin Fresh Invoice ${invoiceId}`} />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen bg-[#F7F5EE]">
        {/* Header with actions - responsive design */}
        <div className="print:hidden bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={goBack}
                  className="flex items-center px-2 sm:px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Back</span>
                </button>
                <h1 className="text-base sm:text-lg font-semibold text-gray-900">
                  Invoice {displayId}
                </h1>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Mobile: Show external link and download */}
                {isMobile ? (
                  <>
                    <button
                      onClick={handleOpenExternal}
                      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      title="View in new tab"
                    >
                      <Eye className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">View</span>
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Download</span>
                    </button>
                  </>
                ) : (
                  /* Desktop: Show all options */
                  <>
                    <button
                      onClick={handleDownload}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                    <button
                      onClick={handlePrint}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Print
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="max-w-6xl mx-auto p-2 sm:p-4">
          {invoiceContent && (
            <>
              {/* Mobile fallback or problematic browsers */}
              {showFallback ? (
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 text-center">
                  <div className="mb-6">
                    <AlertCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      PDF Preview Not Available
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Your device doesn't support inline PDF viewing. Please use the options below to view your invoice.
                    </p>
                  </div>
                  
                  <div className="space-y-3 max-w-sm mx-auto">
                    <button
                      onClick={handleOpenExternal}
                      className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Open PDF in New Tab
                    </button>
                    
                    <button
                      onClick={handleDownload}
                      className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download PDF
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-4">
                    For the best experience, download the PDF or open it in your device's PDF viewer.
                  </p>
                </div>
              ) : (
                /* Standard iframe for desktop and supported browsers */
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden print:shadow-none print:border-0 print:rounded-none">
                  <iframe
                    src={invoiceContent}
                    className="w-full h-[70vh] sm:h-[80vh] min-h-[500px] sm:min-h-[600px]"
                    title={`Invoice ${displayId}`}
                    style={{ border: 'none' }}
                    onError={() => {
                      // console.log('Iframe failed to load, showing fallback');
                      setShowFallback(true);
                    }}
                  />
                  
                  {/* Mobile helper text */}
                  {isMobile && (
                    <div className="p-4 bg-blue-50 border-t border-blue-100">
                      <p className="text-sm text-blue-700 text-center">
                        Having trouble viewing? 
                        <button 
                          onClick={handleOpenExternal}
                          className="ml-1 underline font-medium hover:no-underline"
                        >
                          Open in new tab
                        </button>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Print styles */}
        <style jsx>{`
          @media print {
            .print\\:hidden {
              display: none !important;
            }
            .print\\:shadow-none {
              box-shadow: none !important;
            }
            .print\\:border-0 {
              border: 0 !important;
            }
            .print\\:rounded-none {
              border-radius: 0 !important;
            }
          }
          
          @media (max-width: 640px) {
            iframe {
              height: 60vh !important;
              min-height: 400px !important;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default InvoicePage;
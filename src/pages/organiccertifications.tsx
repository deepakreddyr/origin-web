// src/pages/organiccertifications.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomHead from '@/components/shared/CustomHead';
import { Loader2, AlertCircle, Download, ArrowLeft, ExternalLink, Eye, Printer, ShieldCheck } from 'lucide-react';

const OrganicCertificationsPage: React.FC = () => {
  return (
    <>
      <CustomHead
        title="Organic Certifications | Origin Fresh"
        description="Organic produce certification details coming soon."
      />
      <div className="min-h-screen bg-[#F7F5EE] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full flex flex-col items-center">
          <div className="w-16 h-16 bg-[#DDEEDD] rounded-full flex items-center justify-center mb-6">
            <ShieldCheck className="w-10 h-10 text-[#26B45F]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3 font-[SofiaPro]">Coming Soon</h1>
          <p className="text-gray-600 text-sm font-[SofiaPro] leading-relaxed">
            We are preparing our verified organic and residue-free certifications for you. Check back shortly!
          </p>
        </div>
      </div>
    </>
  );
};

export default OrganicCertificationsPage;

/* 
================================================================================
FULL PDF VIEWER IMPLEMENTATION (PRESERVED FOR PRODUCTION ENABLEMENT)
================================================================================

const OrganicCertificationsPDFViewer: React.FC = () => {
  const router = useRouter();
  const { pdf: queryPdf, url: queryUrl, cert: queryCert, id: queryId } = router.query;

  const [pdfContent, setPdfContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showFallback, setShowFallback] = useState<boolean>(false);

  const pdfSourceUrl = (queryPdf || queryUrl || queryCert) as string | undefined;

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isAndroid = /android/i.test(userAgent);
      const isChrome = /chrome/i.test(userAgent);

      const shouldUseFallback = isMobileDevice && (isAndroid || isChrome);

      setIsMobile(isMobileDevice);
      setShowFallback(shouldUseFallback);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchCertificationPdf();
  }, [pdfSourceUrl, queryId]);

  const fetchCertificationPdf = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      let targetUrl = pdfSourceUrl;

      if (!targetUrl && queryId) {
        targetUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/public/preview-organic-certification/${queryId}`;
      }

      if (!targetUrl) {
        targetUrl = 'https://cdn.originfresh.in/public-assets/website/organic-certification.pdf';
      }

      if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://') || targetUrl.startsWith('/')) {
        try {
          const response = await fetch(targetUrl);
          if (response.ok) {
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            setPdfContent(blobUrl);
          } else {
            setPdfContent(targetUrl);
          }
        } catch {
          setPdfContent(targetUrl);
        }
      } else {
        setPdfContent(targetUrl);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load organic certification document';
      setError(errorMessage);
      console.error('Error fetching certification PDF:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (): void => {
    if (pdfContent) {
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = pdfContent;
      a.download = `organic-certification-${queryId || 'origin-fresh'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleOpenExternal = (): void => {
    if (pdfContent) {
      window.open(pdfContent, '_blank');
    }
  };

  const handlePrint = (): void => {
    if (isMobile) {
      handleOpenExternal();
    } else {
      window.print();
    }
  };

  const goBack = (): void => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  if (loading) {
    return (
      <>
        <CustomHead
          title="Loading Organic Certification | Origin Fresh"
          description="Fetching organic produce certification details..."
          noIndex={true}
        />
        <div className="min-h-screen bg-[#F7F5EE] flex items-center justify-center px-4">
          <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-sm w-full">
            <Loader2 className="w-12 h-12 text-[#26B45F] animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2 font-[SofiaPro]">Loading Certification</h2>
            <p className="text-gray-600 text-sm font-[SofiaPro]">Please wait while we load the organic certification document...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <CustomHead
          title="Organic Certification Error | Origin Fresh"
          noIndex={true}
        />
        <div className="min-h-screen bg-[#F7F5EE] flex items-center justify-center px-4">
          <div className="max-w-md mx-auto text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2 font-[SofiaPro]">Certification Not Available</h2>
            <p className="text-gray-600 mb-6 font-[SofiaPro]">{error}</p>
            <div className="space-y-3">
              <button
                onClick={fetchCertificationPdf}
                className="w-full px-4 py-3 bg-[#26B45F] text-white rounded-xl font-medium hover:bg-[#20964f] transition-colors font-[SofiaPro]"
              >
                Try Again
              </button>
              <button
                onClick={goBack}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center font-[SofiaPro]"
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

  return (
    <>
      <CustomHead
        title="Organic Certifications | Origin Fresh"
        description="View 100% verified Organic & Residue-Free produce certifications for Origin Fresh."
      />

      <div className="min-h-screen bg-[#F7F5EE]">
        <div className="print:hidden bg-white border-b border-gray-200 sticky top-0 z-10 shadow-xs">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={goBack}
                  className="flex items-center px-2 sm:px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <ArrowLeft className="w-5 h-5 mr-1" />
                  <span className="hidden sm:inline font-[SofiaPro] font-medium">Back</span>
                </button>

                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-[#26B45F]" />
                  <div>
                    <h1 className="text-base sm:text-lg font-bold text-gray-900 font-[SofiaPro] leading-tight">
                      Organic Certification
                    </h1>
                    <p className="text-xs text-gray-500 hidden sm:block font-[SofiaPro]">
                      100% Verified Fresh & Residue-Free Produce
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-3">
                {isMobile ? (
                  <>
                    <button
                      onClick={handleOpenExternal}
                      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium font-[SofiaPro]"
                      title="View in new tab"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center px-3 py-2 bg-[#26B45F] text-white rounded-xl hover:bg-[#20964f] transition-colors text-sm font-medium font-[SofiaPro]"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      <span>Download</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleDownload}
                      className="flex items-center px-4 py-2 bg-[#26B45F] text-white rounded-xl hover:bg-[#20964f] transition-colors text-sm font-medium font-[SofiaPro]"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </button>
                    <button
                      onClick={handlePrint}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium font-[SofiaPro]"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-3 sm:p-6">
          {pdfContent && (
            <>
              {showFallback ? (
                <div className="bg-white shadow-xs border border-gray-200 rounded-2xl p-6 sm:p-10 text-center max-w-xl mx-auto my-6">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-[#DDEEDD] rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShieldCheck className="w-10 h-10 text-[#26B45F]" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 font-[SofiaPro]">
                      Organic Certification Document
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 font-[SofiaPro]">
                      To view the full organic certification PDF on your device, please open it in a new tab or download the file directly.
                    </p>
                  </div>

                  <div className="space-y-3 max-w-sm mx-auto">
                    <button
                      onClick={handleOpenExternal}
                      className="w-full flex items-center justify-center px-5 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium font-[SofiaPro] shadow-xs"
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Open PDF in New Tab
                    </button>

                    <button
                      onClick={handleDownload}
                      className="w-full flex items-center justify-center px-5 py-3.5 bg-[#26B45F] text-white rounded-xl hover:bg-[#20964f] transition-colors font-medium font-[SofiaPro] shadow-xs"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Certification PDF
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white shadow-xs border border-gray-200 rounded-2xl overflow-hidden print:shadow-none print:border-0 print:rounded-none">
                  <iframe
                    src={pdfContent}
                    className="w-full h-[75vh] sm:h-[82vh] min-h-[550px] sm:min-h-[650px]"
                    title="Organic Certification"
                    style={{ border: 'none' }}
                    onError={() => {
                      setShowFallback(true);
                    }}
                  />

                  {isMobile && (
                    <div className="p-4 bg-emerald-50 border-t border-emerald-100">
                      <p className="text-sm text-emerald-800 text-center font-[SofiaPro]">
                        Having trouble viewing the PDF preview?
                        <button
                          onClick={handleOpenExternal}
                          className="ml-1 underline font-semibold hover:no-underline text-emerald-900"
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
      </div>
    </>
  );
};
*/

// pages/invoice/[id].tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Loader2, AlertCircle, Download, ArrowLeft } from 'lucide-react';

const InvoicePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // This can be string | string[] | undefined
  
  // Fix 1: Proper TypeScript typing
  const [invoiceContent, setInvoiceContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fix 2: Ensure ID is a string
  const invoiceId = Array.isArray(id) ? id[0] : id;
  console.log(process.env.NEXT_PUBLIC_BACKEND_API_URL);
  const apiUrl = invoiceId ? `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/v1/public/preview-store-invoice/${invoiceId}` : '';
//   const apiUrl = invoiceId ? `https://api.webdev.madrasmandi.in/api/v1/public/preview-store-invoice/011c7093e29b@4398` : '';
    console.log(apiUrl,"API");
  useEffect(() => {
    // Only fetch when we have a valid string ID
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
      
      // Get the response as a blob (for PDF data)
      const blob = await response.blob();
      
      // Create a blob URL for the PDF
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
      // Create a temporary link to download the PDF
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = invoiceContent; // This is now a blob URL
      a.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handlePrint = (): void => {
    window.print();
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
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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

  // Fix 3: Safe string handling for split operation
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
      </Head>

      <div className="min-h-screen bg-[#F7F5EE]">
        {/* Invoice Content - PDF Viewer */}
        <div className="max-w-6xl mx-auto p-4">
          {invoiceContent && (
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden print:shadow-none print:border-0 print:rounded-none">
              <iframe
                src={invoiceContent}
                className="w-full h-[80vh] min-h-[600px]"
                title={`Invoice ${displayId}`}
                style={{
                  border: 'none'
                }}
              />
            </div>
          )}
        </div>

        {/* Print styles */}
        <style jsx>{`
          @media print {
            .print\\:hidden {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default InvoicePage;
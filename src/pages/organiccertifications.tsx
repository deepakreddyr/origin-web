import React from 'react';
import CustomHead from '@/components/shared/CustomHead';

const OrganicCertificationsPage: React.FC = () => {
  const images = Array.from({ length: 12 }, (_, i) => {
    const num = String(i + 1).padStart(4, '0');
    return `https://cdn.originfresh.in/website-images/organic-certification_page-${num}.jpg`;
  });

  return (
    <>
      <CustomHead
        title="Organic Certifications | Origin Fresh"
        description="View 100% verified Organic & Residue-Free produce certifications for Origin Fresh."
      />

      <div className="min-h-screen bg-[#F7F5EE]">
        <div className="max-w-4xl mx-auto p-3 sm:p-6 pb-20 pt-6 sm:pt-10">
          <div className="bg-white shadow-xs border border-gray-200 rounded-2xl overflow-hidden flex flex-col items-center">
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Organic Certification Page ${index + 1}`}
                className="w-full h-auto object-contain border-b border-gray-100 last:border-b-0"
                loading={index < 3 ? 'eager' : 'lazy'}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrganicCertificationsPage;

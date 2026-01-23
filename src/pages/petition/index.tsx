import React, { useState, useEffect } from 'react';
import originLogo from '/public/assets/images/neworiginlogo.png';
import Image from 'next/image';
import petitionImage from '/public/assets/images/PetitionDoc.png';

export default function PetitionPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [petitionCount, setPetitionCount] = useState<number | null>(null);
  const [liveVisitors, setLiveVisitors] = useState<number>(0);
  const [errors, setErrors] = useState({ name: '', phone: '', email: '' });

  // Assets
  const productImage = '/assets/svg/petitionimage.svg';
  const formImage = '/assets/svg/petitionformimage.svg';

  // Fake live visitors count (40-70)
  useEffect(() => {
    setLiveVisitors(Math.floor(Math.random() * (70 - 40 + 1)) + 40);
    const interval = setInterval(() => {
      setLiveVisitors(Math.floor(Math.random() * (70 - 40 + 1)) + 40);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fetch petition count
  useEffect(() => {
    fetch('https://api.webdev.wholesalemandi.com/api/v1/public/petitions')
      .then(res => res.json())
      .then(data => {
        if (data?.data?.count) {
          setPetitionCount(data.data.count);
        }
      })
      .catch(err => console.error('Error fetching count:', err));
  }, []);

  const scrollToForm = () => {
    const element = document.getElementById('signup-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const validate = () => {
    let isValid = true;
    const newErrors = { name: '', phone: '', email: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be digits only';
      isValid = false;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      setSubmitStatus('validation');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const response = await fetch('https://api.webdev.wholesalemandi.com/api/v1/public/petitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone_number: formData.phone,
          item_id: 1
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', phone: '', email: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-black selection:text-yellow-400">
      {/* Header */}
      <header className="px-2 md:px-10">
        <div className="bg-[#ffbe00] rounded-b-[32px] py-3 px-6 flex justify-center items-center shadow-sm relative">
          <Image
            src={originLogo}
            alt="origin Fresh"
            className="h-10 md:h-12 w-auto object-contain mt-5"
            priority
          />
          {petitionCount !== null && (
            <div className="absolute right-6 top-1/2 -translate-y-1/2 mt-2.5 text-right flex flex-col items-end">
              <p className="font-bold text-2xl leading-none tracking-tight">{petitionCount}</p>
              <p className="font-bold text-[10px] md:text-xs uppercase leading-none mb-1">SIGNED</p>
              <div className="flex items-center gap-1 text-green-700 animate-pulse">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                <p className="text-[10px] font-bold uppercase">{liveVisitors} viewing</p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 pt-8">
        {/* Top Section - Equal Sized Side-by-Side Images */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12 items-stretch">

          {/* Left - Petition Document (Clickable) */}
          <div
            className="flex-1 relative min-h-[500px] w-full cursor-pointer transition-transform hover:scale-[1.01] active:scale-100"
            onClick={scrollToForm}
          >
            <Image
              src={petitionImage}
              alt="Petition Document"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Right - Product SVG */}
          <div className="flex-1 relative min-h-[500px] w-full overflow-hidden bg-white">
            <img
              src={productImage}
              alt="Honey Pineapple Product"
              className="w-full h-full object-contain lg:object-cover"
            />
          </div>
        </div>

        {/* Bottom Section - Sign Up Form */}
        <div id="signup-form" className="bg-[#ffbe00] rounded-[40px] p-8 md:p-16 relative overflow-hidden scroll-mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Form Section */}
            <div className="z-10">
              <h2 className="text-4xl font-black mb-10 uppercase italic leading-none tracking-tighter">
                SIGN UP HERE!
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-black mb-2 uppercase italic">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-5 py-4 border-[3px] ${errors.name ? 'border-red-600' : 'border-black'} rounded-2xl bg-[#ffbe00] focus:bg-white focus:outline-none font-black transition-all`}
                  />
                  {errors.name && <p className="text-red-700 text-xs mt-2 font-bold italic">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-black mb-2 uppercase italic">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-5 py-4 border-[3px] ${errors.phone ? 'border-red-600' : 'border-black'} rounded-2xl bg-[#ffbe00] focus:bg-white focus:outline-none font-black transition-all`}
                  />
                  {errors.phone && <p className="text-red-700 text-xs mt-2 font-bold italic">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-black mb-2 uppercase italic">Email (Optional)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-5 py-4 border-[3px] ${errors.email ? 'border-red-600' : 'border-black'} rounded-2xl bg-[#ffbe00] focus:bg-white focus:outline-none font-black transition-all`}
                  />
                  {errors.email && <p className="text-red-700 text-xs mt-2 font-bold italic">{errors.email}</p>}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full md:w-auto bg-black text-white px-12 py-5 rounded-2xl font-black uppercase hover:bg-zinc-900 transition-all disabled:bg-zinc-800 shadow-2xl text-xl italic tracking-tight active:translate-y-1"
                >
                  {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
                </button>

                {submitStatus === 'success' && (
                  <p className="text-green-800 font-black italic mt-4 animate-bounce">✓ Successfully Signed!</p>
                )}
              </div>
            </div>

            {/* Right Side Illustration */}
            <div className="relative flex justify-center lg:justify-end">
              <img
                src={formImage}
                alt="Join the Cult of Fresh"
                className="w-full max-w-lg object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buffer */}
      <div className="h-20" />
    </div>
  );
}
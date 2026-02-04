import React, { useState, useEffect } from 'react';
import originLogo from '/public/assets/images/neworiginlogo.png';
import Image from 'next/image';
import petitionImage from '/public/assets/images/PetitionDocument2.png';
import petitionImage2 from '/public/assets/images/petitionproductimage.png';
import formImage from '/public/assets/images/petitionform.png';

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
  const [showPopup, setShowPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Check if mandatory fields are filled to enable button
  const isFormFilled = formData.name.trim() !== '' && formData.phone.trim() !== '';

  // Show popup on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
      setShowConfetti(true);
      // Stop confetti after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

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
    fetch('https://api.originfresh.in/api/v1/public/petitions')
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

    if (!/^\d{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
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
      const response = await fetch('https://api.originfresh.in/api/v1/public/petitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone_number: formData.phone,
          item_id: 399
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', phone: '', email: '' });
        // Redirect to product page after 1.5 seconds
        setTimeout(() => {
          window.location.href = 'https://originfresh.in/honey-baby-pineapple-peeled/399';
        }, 1500);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProductNavigate = () => {
    window.location.href = 'https://originfresh.in/honey-baby-pineapple-peeled/399';
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-black selection:text-yellow-400">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-2 h-2 md:w-3 md:h-3"
                style={{
                  backgroundColor: ['#ffbe00', '#000000', '#ff6b6b', '#4ecdc4', '#95e1d3'][Math.floor(Math.random() * 5)],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Notification Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 md:p-10 relative animate-scaleIn border-4 border-[#ffbe00]">
            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black text-white hover:bg-zinc-800 transition-colors font-black"
            >
              ✕
            </button>

            {/* Popup Content */}
            <div className="text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">🍯🍍</div>
                <h2 className="font-[SofiaPro] text-3xl md:text-4xl font-black tracking-tight mb-3">
                  You made it happen! 
                </h2>
                <p className="text-lg font-semibold mb-2">
                  Honey baby pineapples are back in stock. 
                </p>
                {/* <p className="text-base text-gray-600">
                  Join <span className="font-black text-[#ffbe00]">{petitionCount ? 722 + petitionCount : '1000+'}</span> people who've already signed the petition!
                </p> */}
              </div>

              {/* <div className="bg-[#ffbe00]/20 rounded-2xl p-4 mb-6 border-2 border-[#ffbe00]">
                <p className="font-black text-sm uppercase mb-1">Limited Time Offer</p>
                <p className="text-2xl font-black">Get 20% OFF</p>
                <p className="text-sm">on your first order</p>
              </div> */}

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleProductNavigate}
                  className="w-full px-8 py-4 bg-black text-white rounded-2xl font-black uppercase hover:bg-zinc-900 transition-all shadow-lg active:translate-y-1"
                >
                  Shop Now →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="px-2 md:px-10">
        <div className="bg-[#ffbe00] rounded-b-[32px] py-3 px-6 flex justify-center items-center shadow-sm relative">
          <Image
            src={originLogo}
            alt="origin Fresh"
            className="h-10 md:h-12 w-auto object-contain mt-5 cursor-pointer"
            onClick={() => window.location.href = '/shop'}
            priority
          />
          {petitionCount !== null && (
            <div className="absolute right-6 top-1/2 -translate-y-1/2 mt-2.5 text-right flex flex-col items-end">
              <p className="font-bold text-2xl leading-none tracking-tight">{722 + petitionCount}</p>
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
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-0 mb-12 items-stretch">
          {/* Left - Petition Document (Clickable) */}
          <div
            className="flex-1 relative min-h-[500px] w-full cursor-pointer transition-transform hover:scale-[1.01] active:scale-100 order-2 lg:order-1 mt-[10px]"
            onClick={scrollToForm}
          >
            <Image
              src={petitionImage}
              alt="Petition Document"
              fill
              className="object-fit"
              priority
            />
          </div>

          {/* Right - Product SVG */}
          <div className="flex-1 relative w-full overflow-hidden bg-white order-1 lg:order-2">
            <Image
              src={petitionImage2}
              alt="Honey Pineapple Product"
              className="w-full h-full object-fit"
            />
          </div>
        </div>

        {/* Bottom Section - Sign Up Form */}
        <div id="signup-form" className="bg-[#ffbe00] rounded-[32px] p-8 md:p-16 relative overflow-hidden scroll-mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Form Section */}
            <div className="z-10">
              <h2 className="text-4xl font-black mb-10 uppercase leading-none tracking-tighter">
                SIGN UP HERE!
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-black mb-2 uppercase">
                    Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-5 py-4 border-[3px] ${errors.name ? 'border-red-600' : 'border-black'} rounded-2xl bg-[#ffbe00] placeholder:text-black/40 focus:bg-white focus:outline-none font-black transition-all`}
                  />
                  {errors.name && <p className="text-red-700 text-xs mt-2 font-bold italic">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-black mb-2 uppercase">
                    Phone Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-5 py-4 border-[3px] ${errors.phone ? 'border-red-600' : 'border-black'} rounded-2xl bg-[#ffbe00] placeholder:text-black/40 focus:bg-white focus:outline-none font-black transition-all`}
                  />
                  {errors.phone && <p className="text-red-700 text-xs mt-2 font-bold italic">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-black mb-2 uppercase">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-5 py-4 border-[3px] ${errors.email ? 'border-red-600' : 'border-black'} rounded-2xl bg-[#ffbe00] placeholder:text-black/40 focus:bg-white focus:outline-none font-black transition-all`}
                  />
                  {errors.email && <p className="text-red-700 text-xs mt-2 font-bold italic">{errors.email}</p>}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isFormFilled}
                  className={`w-full md:w-auto px-12 py-5 rounded-2xl font-black uppercase transition-all shadow-2xl text-xl tracking-tight active:translate-y-1 
                    ${isSubmitting || !isFormFilled
                      ? 'bg-black/20 text-black/40 cursor-not-allowed border-black/10'
                      : 'bg-black text-white hover:bg-zinc-900 cursor-pointer'
                    }`}
                >
                  {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
                </button>

                {submitStatus === 'success' && (
                  <p className="text-green-800 font-black italic mt-4 animate-bounce">✓ Successfully Signed!</p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-red-700 font-black italic mt-4">Something went wrong. Please try again.</p>
                )}
              </div>
            </div>

            {/* Right Side Illustration */}
            <div className="relative flex justify-center lg:justify-end">
              <Image
                src={formImage}
                alt="Join the Cult of Fresh"
                className="w-full max-w-2xl object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buffer */}
      <div className="h-20" />

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-confetti {
          animation: confetti linear forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
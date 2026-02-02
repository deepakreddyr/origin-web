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

    // Check if mandatory fields are filled to enable button
    const isFormFilled = formData.name.trim() !== '' && formData.phone.trim() !== '';

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
                <div className="bg-[#ffbe00] rounded-b-[32px] py-3 px-6 flex justify-center items-center shadow-sm relative" onClick={() => window.location.href = '/'}>
                    <Image
                        src={originLogo}
                        alt="origin Fresh"
                        className="h-10 md:h-12 w-auto object-contain mt-5"
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
        </div>
    );
}
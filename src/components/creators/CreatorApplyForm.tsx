import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import SectionHeading from './SectionHeading';
import { body, heading } from './constants';

const formSchema = z.object({
  name: z.string().min(1, { message: 'This field has to be filled.' }),
  email: z.string().min(1, { message: 'This field has to be filled.' }).email('Enter a valid email.'),
  phone: z
    .string()
    .length(10, { message: 'Must be exactly 10 characters long' })
    .refine((value) => !/^[0-5]/.test(value), { message: 'Enter a valid contact number' }),
  handle: z.string().min(1, { message: 'Share your Instagram or YouTube handle.' }),
  interests: z.array(z.string()).min(1, { message: 'Pick at least one option.' }),
  message: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

// TODO: wire to the creator applications API when available.
const submitCreatorApplication = async (values: FormValues) => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return values;
};

const inputClass =
  'w-full bg-transparent border border-[#231f20]/25 rounded-[14px] px-4 py-3 text-[15px] text-[#231f20] placeholder:text-[#231f20]/40 focus:outline-none focus:border-[#231f20] focus:ring-4 ring-[#fac510]/40 transition-all';

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <label className="block" style={body}>
    <span className="block mb-1.5 text-[13px] font-[700] text-[#231f20]">{label}</span>
    {children}
    {error && <span className="block mt-1 text-[12px] text-[#C70000]">{error}</span>}
  </label>
);

const confettiColors = ['#fac510', '#619269', '#231f20', '#CFE6D2', '#EA8E4F'];

const Confetti = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    {Array.from({ length: 28 }).map((_, i) => {
      const angle = (i / 28) * Math.PI * 2;
      const dist = 90 + (i % 4) * 35;
      return (
        <motion.span
          key={i}
          className="absolute w-2 h-3 rounded-[2px]"
          style={{ backgroundColor: confettiColors[i % confettiColors.length] }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist + 40, opacity: 0, rotate: 360 + i * 20 }}
          transition={{ duration: 1.3, ease: 'easeOut' }}
        />
      );
    })}
  </div>
);

const CreatorApplyForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', phone: '', handle: '', interests: [], message: '' }
  });

  const onSubmit = async (values: FormValues) => {
    await submitCreatorApplication(values);
    setSubmitted(true);
  };

  return (
    <section id="apply" className="px-6 py-16 md:py-24 bg-white scroll-mt-24">
      <div className="max-w-[640px] mx-auto">
        <SectionHeading
          eyebrow="Join us"
          title="Apply to be an Origin creator"
          subtitle="Takes two minutes. We'll get back to you within a few days."
        />

        <div className="mt-10 bg-[#FAF7F0] border border-[#231f20]/10 rounded-[28px] p-6 md:p-10">
          {submitted ? (
            <div className="relative text-center py-8">
              <Confetti />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                className="mx-auto mb-4 w-14 h-14 rounded-full bg-[#619269] flex items-center justify-center"
              >
                <Check className="text-white" size={28} />
              </motion.div>
              <p className="text-[28px] text-[#231f20] font-[500]" style={heading}>
                You're in the circle!
              </p>
              <p className="mt-3 text-[15px] text-[#231f20]/70" style={body}>
                Your application is in. We'll reach out soon with next steps.
              </p>
            </div>
          ) : (
            <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Field label="Full name" error={errors.name?.message}>
                <input {...register('name')} className={inputClass} placeholder="Your name" />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Email" error={errors.email?.message}>
                  <input {...register('email')} type="email" className={inputClass} placeholder="you@email.com" />
                </Field>
                <Field label="Phone" error={errors.phone?.message}>
                  <input
                    {...register('phone')}
                    inputMode="numeric"
                    className={inputClass}
                    placeholder="10-digit number"
                  />
                </Field>
              </div>
              <Field label="Instagram / YouTube handle" error={errors.handle?.message}>
                <input {...register('handle')} className={inputClass} placeholder="@yourhandle" />
              </Field>

              <fieldset style={body}>
                <legend className="mb-2 text-[13px] font-[700] text-[#231f20]">I'm interested in</legend>
                <div className="flex flex-wrap gap-2">
                  {['Barter', 'Affiliate', 'Weekly goodies'].map((option) => (
                    <label key={option} className="cursor-pointer">
                      <input type="checkbox" value={option} {...register('interests')} className="peer sr-only" />
                      <motion.span
                        whileHover={{ scale: 1.08, rotate: -2 }}
                        whileTap={{ scale: 0.88 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                        className="inline-block border border-[#231f20]/25 rounded-full px-4 py-2 text-[14px] text-[#231f20] peer-checked:bg-[#231f20] peer-checked:text-[#FAF7F0] peer-focus-visible:ring-2 ring-[#619269] transition-colors"
                      >
                        {option}
                      </motion.span>
                    </label>
                  ))}
                </div>
                {errors.interests && (
                  <span className="block mt-1 text-[12px] text-[#C70000]">{errors.interests.message}</span>
                )}
              </fieldset>

              <Field label="Anything else? (optional)">
                <textarea {...register('message')} rows={3} className={inputClass} />
              </Field>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#231f20] text-[#FAF7F0] rounded-full py-3.5 text-[15px] font-[700] hover:bg-black transition-colors disabled:opacity-60"
                style={body}
              >
                {isSubmitting ? 'Submitting…' : 'Submit application'}
              </motion.button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default CreatorApplyForm;

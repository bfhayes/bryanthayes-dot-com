import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    honeypot: '', // Hidden field to catch bots
  });
  
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmit, setLastSubmit] = useState(0);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.message.length > 500) {
      newErrors.message = 'Message must be 500 characters or less';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Rate limiting: prevent multiple submits within 5 seconds
    const now = Date.now();
    if (now - lastSubmit < 5000) {
      return;
    }

    // Check honeypot (should be empty)
    if (formData.honeypot) {
      return;
    }

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Focus first error field
      const firstErrorField = Object.keys(newErrors)[0];
      const field = document.querySelector(`[name="${firstErrorField}"]`);
      field?.focus();
      return;
    }

    setIsSubmitting(true);
    setLastSubmit(now);

    try {
      // Send to API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setShowSuccess(true);
        
        // Announce success to screen readers
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
          liveRegion.textContent = result.message || 'Your message has been sent successfully.';
        }
      } else {
        // Show error
        setErrors({ submit: result.error || 'Failed to send message. Please try again.' });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccess(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
      honeypot: '',
    });
    setErrors({});
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Honeypot field - hidden from users */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Website (leave blank)</label>
          <input
            type="text"
            name="honeypot"
            id="website"
            value={formData.honeypot}
            onChange={handleChange}
            tabIndex="-1"
            autoComplete="off"
          />
        </div>

        {/* Name field */}
        <div>
          <label 
            htmlFor="name" 
            className="block text-sm font-medium text-neutral-700 mb-2"
          >
            Full Name <span className="text-red-500" aria-label="required">*</span>
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-transparent transition-colors ${
              errors.name 
                ? 'border-red-500 bg-red-50' 
                : 'border-neutral-300 focus:border-brand-700'
            }`}
            placeholder="Your full name"
            aria-describedby={errors.name ? 'name-error' : undefined}
            aria-invalid={errors.name ? 'true' : 'false'}
          />
          {errors.name && (
            <p id="name-error" className="mt-2 text-sm text-red-600" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email field */}
        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-neutral-700 mb-2"
          >
            Email Address <span className="text-red-500" aria-label="required">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-transparent transition-colors ${
              errors.email 
                ? 'border-red-500 bg-red-50' 
                : 'border-neutral-300 focus:border-brand-700'
            }`}
            placeholder="your.email@example.com"
            aria-describedby={errors.email ? 'email-error' : undefined}
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          {errors.email && (
            <p id="email-error" className="mt-2 text-sm text-red-600" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone field */}
        <div>
          <label 
            htmlFor="phone" 
            className="block text-sm font-medium text-neutral-700 mb-2"
          >
            Phone Number <span className="text-sm text-neutral-500">(optional)</span>
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-transparent transition-colors"
            placeholder="(555) 123-4567"
          />
        </div>

        {/* Message field */}
        <div>
          <label 
            htmlFor="message" 
            className="block text-sm font-medium text-neutral-700 mb-2"
          >
            Message <span className="text-sm text-neutral-500">(optional, max 500 characters)</span>
          </label>
          <textarea
            name="message"
            id="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-transparent transition-colors resize-vertical ${
              errors.message 
                ? 'border-red-500 bg-red-50' 
                : 'border-neutral-300 focus:border-brand-700'
            }`}
            placeholder="Tell me a bit about what brings you to therapy..."
            aria-describedby={errors.message ? 'message-error' : 'message-help'}
            aria-invalid={errors.message ? 'true' : 'false'}
          />
          <div className="mt-2 flex justify-between text-sm">
            {errors.message ? (
              <p id="message-error" className="text-red-600" role="alert">
                {errors.message}
              </p>
            ) : (
              <p id="message-help" className="text-neutral-500">
                Please do not include personal health information (PHI) in this form.
              </p>
            )}
            <span className={`${formData.message.length > 450 ? 'text-red-600' : 'text-neutral-500'}`}>
              {formData.message.length}/500
            </span>
          </div>
        </div>

        {/* Submit error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600" role="alert">
              {errors.submit}
            </p>
          </div>
        )}

        {/* Submit button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full btn btn-primary ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending...
              </span>
            ) : (
              'Send Message'
            )}
          </button>
        </div>

        {/* Remove demo notice in production */}
      </form>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Thank You!
              </h3>
              <p className="text-neutral-600 mb-6">
                Thank you for reaching out! Your message has been sent successfully. We'll get back to you within 24 hours during business days.
              </p>
              <button
                onClick={closeSuccessModal}
                className="btn btn-primary"
                autoFocus
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
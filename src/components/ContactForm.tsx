import React, { useState } from 'react';

interface ContactFormProps {}

export default function ContactForm({}: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const subjects = [
    { value: 'job-opportunity', label: 'Job Opportunity' },
    { value: 'freelance', label: 'Freelance Project' },
    { value: 'commission', label: 'Commission Request' },
    { value: 'collaboration', label: 'Collaboration' },
    { value: 'general', label: 'General Inquiry' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: 'general',
          message: ''
        });
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to send message. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-space-cadet dark:text-gray-200 mb-2">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-rose-quartz/30 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-pale-dogwood focus:border-transparent transition-all"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-space-cadet dark:text-gray-200 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-rose-quartz/30 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-pale-dogwood focus:border-transparent transition-all"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-space-cadet dark:text-gray-200 mb-2">
          Subject *
        </label>
        <select
          id="subject"
          name="subject"
          required
          value={formData.subject}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-rose-quartz/30 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-pale-dogwood focus:border-transparent transition-all"
        >
          {subjects.map(subject => (
            <option key={subject.value} value={subject.value}>
              {subject.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-space-cadet dark:text-gray-200 mb-2">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-rose-quartz/30 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-pale-dogwood focus:border-transparent transition-all resize-none"
          placeholder="Tell me about your project, opportunity, or idea..."
        />
      </div>

      {/* Status Messages */}
      {status === 'success' && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-md">
          <p className="text-green-800 dark:text-green-300">Thank you for your message! I'll get back to you soon.</p>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md">
          <p className="text-red-800 dark:text-red-300">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className={`w-full btn-primary ${status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {status === 'loading' ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          </span>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  );
}
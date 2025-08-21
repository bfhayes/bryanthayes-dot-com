interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
}

export function generateSEOTags({
  title,
  description,
  canonical,
  image = '/images/og-default.png',
  noIndex = false,
  type = 'website'
}: SEOProps) {
  const siteName = 'Hailey Gonnerman Counseling';
  const siteUrl = 'https://haileygonnermancounseling.com';
  
  return {
    title,
    description,
    canonical: canonical || siteUrl,
    noIndex,
    openGraph: {
      title,
      description,
      type,
      url: canonical || siteUrl,
      image: image.startsWith('http') ? image : `${siteUrl}${image}`,
      siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      image: image.startsWith('http') ? image : `${siteUrl}${image}`,
    },
  };
}

export function generateJSONLD(type: string, data: any) {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return JSON.stringify(baseSchema, null, 2);
}

export function generateBusinessJSONLD() {
  return generateJSONLD('ProfessionalService', {
    name: 'Hailey Gonnerman Counseling',
    alternateName: 'Hailey Gonnerman, LMFT',
    description: 'Licensed Marriage and Family Therapist providing compassionate therapy for anxiety, life transitions, relationships, and personal growth.',
    provider: {
      '@type': 'Person',
      name: 'Hailey Gonnerman',
      jobTitle: 'Licensed Marriage and Family Therapist',
      description: 'LMFT specializing in anxiety, trauma, life transitions, and relationship issues',
      sameAs: []
    },
    areaServed: {
      '@type': 'State',
      name: 'Oregon'
    },
    practiceModel: 'Telehealth Only',
    telephone: '(503) 555-0123',
    email: 'hello@haileygonnermancounseling.com',
    url: 'https://haileygonnermancounseling.com',
    openingHours: [
      'Mo-Th 09:00-18:00',
      'Fr 09:00-15:00'
    ],
    paymentAccepted: ['Cash', 'Check', 'Credit Card'],
    priceRange: '$$',
    serviceType: [
      'Individual Therapy',
      'Anxiety Treatment',
      'Depression Therapy',
      'Trauma Therapy',
      'Relationship Counseling',
      'Life Transition Support'
    ]
  });
}
export async function verifyRecaptcha(token: string): Promise<boolean> {
  // In development environment or localhost, bypass reCAPTCHA verification
  const isDevelopment = process.env.NODE_ENV === 'development' || 
                       process.env.NODE_ENV !== 'production' ||
                       process.env.VERCEL_ENV === 'development' ||
                       process.env.VERCEL_URL?.includes('localhost');
  
  if (isDevelopment) {
    console.log('Development/localhost mode: bypassing reCAPTCHA verification');
    return true;
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  
  if (!secretKey) {
    console.error('RECAPTCHA_SECRET_KEY is not configured');
    // In development, return true even without key
    if (process.env.NODE_ENV !== 'production') {
      console.log('Non-production environment: bypassing missing reCAPTCHA key');
      return true;
    }
    return false;
  }

  // Log the key format for debugging (only first/last few characters for security)
  console.log('reCAPTCHA Secret Key format:', {
    length: secretKey.length,
    starts_with: secretKey.substring(0, 6),
    ends_with: secretKey.substring(secretKey.length - 4)
  });

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();
    
    console.log('reCAPTCHA verification response:', {
      success: data.success,
      'error-codes': data['error-codes'],
      hostname: data.hostname,
      score: data.score,
      challenge_ts: data.challenge_ts
    });

    if (!data.success) {
      console.error('reCAPTCHA verification failed:', data['error-codes']);
      // In non-production, still allow through if it's just a key issue
      if (process.env.NODE_ENV !== 'production' && 
          data['error-codes']?.includes('invalid-input-secret')) {
        console.log('Non-production: bypassing invalid-input-secret error');
        return true;
      }
    }

    return data.success;
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    // In development, return true even on error
    if (process.env.NODE_ENV !== 'production') {
      console.log('Non-production environment: bypassing reCAPTCHA error');
      return true;
    }
    return false;
  }
}

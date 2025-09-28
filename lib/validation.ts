export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('メールアドレスは必須です');
    return { isValid: false, errors };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push('有効なメールアドレスを入力してください');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateUrl(url: string): ValidationResult {
  const errors: string[] = [];
  
  if (!url) {
    return { isValid: true, errors: [] }; // URLは任意
  }
  
  // URLの基本形式チェック
  const urlPattern = /^https?:\/\/.+/;
  if (!urlPattern.test(url)) {
    errors.push('https:// または http:// で始まるURLを入力してください');
    return { isValid: false, errors };
  }
  
  try {
    new URL(url);
  } catch {
    errors.push('有効なURLを入力してください');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateSubscriptionForm(data: {
  email: string;
  url?: string;
  company?: string; // ハニーポット
}): ValidationResult {
  const errors: string[] = [];
  
  // ハニーポットチェック
  if (data.company) {
    errors.push('スパムと判定されました');
    return { isValid: false, errors };
  }
  
  // メールアドレス検証
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.push(...emailValidation.errors);
  }
  
  // URL検証
  const urlValidation = validateUrl(data.url || '');
  if (!urlValidation.isValid) {
    errors.push(...urlValidation.errors);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

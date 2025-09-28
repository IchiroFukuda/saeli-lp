'use client';

import { useState } from 'react';
import { validateSubscriptionForm } from '@/lib/validation';
import Toast from './Toast';

export default function BetaCTA() {
  const [formData, setFormData] = useState({
    email: '',
    url: '',
    company: '' // ハニーポット
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    // バリデーション
    const validation = validateSubscriptionForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          url: formData.url || undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setToast({
          message: result.message,
          type: 'success',
          isVisible: true
        });
        setFormData({ email: '', url: '', company: '' });
      } else {
        setToast({
          message: result.errors?.join(', ') || 'エラーが発生しました',
          type: 'error',
          isVisible: true
        });
      }
    } catch (error) {
      setToast({
        message: 'ネットワークエラーが発生しました',
        type: 'error',
        isVisible: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <section id="beta" className="section-padding bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              現在、βテスターを募集中！
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              クローズドβ期間中は無料でお試しいただけます。
              <br />
              正式版前にご意見をお寄せください。
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-left">
                <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-2">
                  メールアドレス <span className="text-red-300">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="your@email.com"
                />
              </div>

              <div className="text-left">
                <label htmlFor="url" className="block text-sm font-medium text-blue-100 mb-2">
                  利用予定アプリのURL <span className="text-blue-200">（任意）</span>
                </label>
                <input
                  id="url"
                  name="url"
                  type="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="https://your-app.com/api/chat"
                />
              </div>

              {/* ハニーポット */}
              <div className="sr-only">
                <label htmlFor="company">会社名</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleInputChange}
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ display: 'none' }}
                />
              </div>

              {errors.length > 0 && (
                <div className="bg-red-500/20 border border-red-400 rounded-lg p-4">
                  <ul className="text-red-100 text-sm space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-blue-600 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? '送信中...' : 'β版に無料登録する'}
              </button>
            </form>

            <div className="text-sm text-blue-200 mt-4 space-y-2">
              <p>※ 登録いただいたメールアドレスは、β版のご案内以外には使用いたしません</p>
              <p className="text-xs text-blue-300">
                > 「この診断は、あなたが所有または明示的許可を得たアプリに対してのみ実行してください。」
              </p>
              <p className="text-xs">
                <a href="/privacy" className="underline hover:text-white transition-colors">
                  プライバシーポリシー
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </>
  );
}

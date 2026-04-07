'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FiArrowLeft, FiLoader, FiCheckCircle } from 'react-icons/fi';
import Link from 'next/link';
import { toast } from '@/components/Toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function PaymentContent() {
  const router = useRouter();
  const params = useParams();
  const paymentIntentId = params.id as string;

  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'succeeded' | 'failed'>('idle');
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  useEffect(() => {
    // Fetch payment intent info
    const fetchPaymentInfo = async () => {
      try {
        // Lấy token từ localStorage
        const userStr = localStorage.getItem('user');
        const userToken = userStr ? JSON.parse(userStr).token : null;

        if (!userToken) {
          toast.error('Vui lòng đăng nhập lại');
          return;
        }

        const response = await fetch(
          `/api/payment-status?paymentIntentId=${paymentIntentId}`,
          {
            headers: {
              'Authorization': `Bearer ${userToken}`,
            },
          }
        );
        const data = await response.json();
        setPaymentInfo(data);
      } catch (error) {
        console.error('Failed to fetch payment info:', error);
        toast.error('Không thể tải thông tin thanh toán');
      }
    };

    if (paymentIntentId) {
      fetchPaymentInfo();
    }
  }, [paymentIntentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setPaymentStatus('processing');

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Confirm payment
      const result = await stripe.confirmCardPayment(paymentIntentId, {
        payment_method: {
          card: cardElement,
          billing_details: { name: 'Guest' },
        },
      });

      if (result.error) {
        toast.error(result.error.message || 'Payment failed');
        setPaymentStatus('failed');
      } else {
        setPaymentStatus('succeeded');
        toast.success('Thanh toán thành công! 🎉');
        setTimeout(() => {
          router.push('/orders');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment processing error');
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-md mx-auto">
        <Link href="/orders" className="flex items-center text-accent-gold hover:text-accent-silver mb-8">
          <FiArrowLeft className="mr-2" /> Quay lại
        </Link>

        <div className="glass-effect p-8 rounded-2xl">
          <h1 className="text-3xl font-bold mb-8 text-accent-gold">💳 Thanh Toán Đặt Cọc</h1>

          {paymentStatus === 'succeeded' && (
            <div className="text-center py-8">
              <FiCheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-400 mb-2">Thành công!</h2>
              <p className="text-dark-300 mb-4">Thanh toán đặt cọc đã hoàn tất</p>
              <p className="text-sm text-dark-400">Đang chuyển hướng...</p>
            </div>
          )}

          {paymentStatus !== 'succeeded' && paymentInfo && (
            <>
              <div className="bg-dark-800 p-4 rounded-lg mb-6">
                <p className="text-dark-400 text-sm mb-2">Số tiền thanh toán:</p>
                <p className="text-3xl font-bold text-accent-gold">
                  {paymentInfo.amount?.toLocaleString('vi-VN')} {paymentInfo.currency?.toUpperCase()}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border border-dark-700 rounded-lg p-4 bg-dark-800">
                  <label className="block text-sm font-semibold mb-3">Thông tin thẻ</label>
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#ffffff',
                          '::placeholder': {
                            color: '#9CA3AF',
                          },
                        },
                        invalid: {
                          color: '#EF4444',
                        },
                      },
                    }}
                  />
                </div>

                <div className="bg-blue-900/30 border border-blue-600/50 p-4 rounded-lg text-sm text-blue-300">
                  <p className="font-semibold mb-2">🧪 Stripe Demo Mode</p>
                  <p className="mb-2"><strong>Test Card:</strong> 4242 4242 4242 4242</p>
                  <p className="mb-2"><strong>Expiry:</strong> 12/25</p>
                  <p><strong>CVC:</strong> 123</p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !stripe}
                  className="w-full py-4 bg-gradient-to-r from-accent-gold to-yellow-500 text-dark-900 rounded-lg font-bold hover:shadow-lg hover:shadow-accent-gold/50 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    'Thanh toán ngay'
                  )}
                </button>
              </form>
            </>
          )}

          {!paymentInfo && paymentStatus !== 'succeeded' && (
            <div className="text-center py-8">
              <FiLoader className="w-8 h-8 animate-spin mx-auto mb-4 text-accent-gold" />
              <p className="text-dark-300">Đang tải...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentContent />
    </Elements>
  );
}

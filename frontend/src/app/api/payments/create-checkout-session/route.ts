import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount, carName, userEmail, currency } = body;

    if (!orderId || !amount || !carName || !userEmail) {
      return NextResponse.json(
        { message: 'Missing required parameters: orderId, amount, carName, userEmail' },
        { status: 400 }
      );
    }

    // Get token from header (sent from client via fetch)
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    // Call backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const backendResponse = await fetch(`${backendUrl}/api/payments/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        orderId,
        amount,
        carName,
        userEmail,
        currency: currency || 'vnd',
      }),
    });

    const backendData = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(backendData, { status: backendResponse.status });
    }

    return NextResponse.json(backendData);
  } catch (error: any) {
    console.error('Checkout session API error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

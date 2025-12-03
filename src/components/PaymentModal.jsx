import React, { useState, useEffect } from 'react';
import { X, CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, totalAmount, onPaymentSuccess }) => {
    const [step, setStep] = useState('input'); // input, processing, success, error
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        if (isOpen) {
            setStep('input');
            setCardNumber('');
            setExpiry('');
            setCvv('');
            setName('');
        }
    }, [isOpen]);

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    const handlePay = (e) => {
        e.preventDefault();
        setStep('processing');

        // Simulate API call
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                onPaymentSuccess();
            }, 2000);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-semibold text-gray-600">Secure Payment Gateway</span>
                    </div>
                    <button onClick={onClose} disabled={step === 'processing'} className="text-gray-400 hover:text-gray-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {step === 'input' && (
                        <form onSubmit={handlePay} className="space-y-4">
                            <div className="text-center mb-6">
                                <p className="text-gray-500 text-sm">Total Amount to Pay</p>
                                <p className="text-3xl font-bold text-gray-800">₹{totalAmount}</p>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Card Number</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="0000 0000 0000 0000"
                                            maxLength="19"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                            required
                                        />
                                        <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Expiry Date</label>
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            maxLength="5"
                                            value={expiry}
                                            onChange={(e) => setExpiry(e.target.value)}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">CVV</label>
                                        <input
                                            type="password"
                                            placeholder="123"
                                            maxLength="3"
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value)}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Cardholder Name</label>
                                    <input
                                        type="text"
                                        placeholder="Name on Card"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 shadow-lg shadow-green-200 transition-all mt-4"
                            >
                                Pay ₹{totalAmount}
                            </button>

                            <div className="flex justify-center gap-2 mt-4 opacity-50">
                                <div className="h-6 w-10 bg-gray-200 rounded"></div>
                                <div className="h-6 w-10 bg-gray-200 rounded"></div>
                                <div className="h-6 w-10 bg-gray-200 rounded"></div>
                            </div>
                        </form>
                    )}

                    {step === 'processing' && (
                        <div className="flex flex-col items-center justify-center py-10 space-y-4">
                            <div className="relative h-16 w-16">
                                <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
                            </div>
                            <p className="text-gray-600 font-medium animate-pulse">Processing Payment...</p>
                            <p className="text-xs text-gray-400">Do not close this window</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in zoom-in-50">
                            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-10 w-10 text-green-600" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-gray-800">Payment Successful!</h3>
                                <p className="text-gray-500">Transaction ID: TXN-{Math.floor(Math.random() * 1000000)}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;

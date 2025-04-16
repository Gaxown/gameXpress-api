import React from 'react';

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface SummaryOrderProps {
  cartItems?: CartItem[];
  onClose: () => void;
  onCheckout: () => void;
}

const SummaryOrder = ({ cartItems = [], onClose, onCheckout }: SummaryOrderProps) => {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxRate = 0.20; // 20% TVA
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
</button>        </div>

        <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-2">Product</th>
                <th className="text-center pb-2">Quantity</th>
                <th className="text-right pb-2">Price</th>
                <th className="text-right pb-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item: any) => (
                <tr key={item.id} className="border-b">
                  <td className="py-4 pr-2">
                    <div className="flex items-center">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded mr-3" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-center">{item.quantity}</td>
                  <td className="py-4 text-right">{item.price.toFixed(2)} €</td>
                  <td className="py-4 text-right">{(item.price * item.quantity).toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-gray-50">
          <div className="flex justify-between py-1">
            <span>Subtotal</span>
            <span>{subtotal.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Tax (20%)</span>
            <span>{tax.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between py-2 font-bold text-lg">
            <span>Total</span>
            <span>{total.toFixed(2)} €</span>
          </div>

          <button
            onClick={onCheckout}
            className="mt-4 w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300 font-medium"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryOrder;

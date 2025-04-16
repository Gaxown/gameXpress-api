import React from 'react';

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
  return (
    <div className="flex py-4 border-b">
      <img 
        src={item.image} 
        alt={item.name} 
        className="w-16 h-16 object-cover rounded"
      />
      <div className="ml-3 flex-1">
        <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
        <div className="flex justify-between mt-1">
          <p className="text-sm text-gray-600">{item.price.toFixed(2)} €</p>
          <div className="flex items-center border rounded-md">
            <button 
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="px-1 text-xs text-gray-700 hover:bg-gray-100"
            >
              -
            </button>
            <span className="px-2 text-xs">{item.quantity}</span>
            <button 
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="px-1 text-xs text-gray-700 hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-sm font-medium text-gray-900">
            {(item.price * item.quantity).toFixed(2)} €
          </p>
          <button 
            onClick={() => onRemove(item.id)}
            className="text-xs text-red-600 hover:text-red-800"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

const PanierSidebar = ({ cartItems = [], onRemoveItem, onUpdateQuantity, onViewSummary, isOpen, onClose }) => {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className={`fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg font-medium text-gray-900">Panier ({totalItems})</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4">
          {cartItems.length === 0 ? (
            <p className="py-6 text-gray-500 text-center">Votre panier est vide</p>
          ) : (
            cartItems.map(item => (
              <CartItem 
                key={item.id} 
                item={item} 
                onRemove={onRemoveItem}
                onUpdateQuantity={onUpdateQuantity}
              />
            ))
          )}
        </div>
        
        <div className="border-t px-4 py-4">
          <div className="flex justify-between mb-3">
            <span className="text-sm font-medium text-gray-900">Total</span>
            <span className="text-lg font-bold text-indigo-700">{totalPrice.toFixed(2)} €</span>
          </div>
          <button 
            onClick={onViewSummary}
            disabled={cartItems.length === 0}
            className={`w-full py-2 px-4 rounded-md text-white transition-colors ${cartItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            Voir résumé de commande
          </button>
        </div>
      </div>
    </div>
  );
};

export default PanierSidebar;
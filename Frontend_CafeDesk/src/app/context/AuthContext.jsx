import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentOrder, setCurrentOrder] = useState([]);

  const login = (username, password, role) => {
    // Mock login - in production this would call an API
    setUser({
      username,
      role,
      name: username,
    });
    return true;
  };

  const logout = () => {
    setUser(null);
    setCurrentOrder([]);
  };

  const addToOrder = (item) => {
    setCurrentOrder(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromOrder = (itemId) => {
    setCurrentOrder(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromOrder(itemId);
      return;
    }
    setCurrentOrder(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearOrder = () => {
    setCurrentOrder([]);
  };

  const getTotalAmount = () => {
    return currentOrder.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      currentOrder,
      addToOrder,
      removeFromOrder,
      updateQuantity,
      clearOrder,
      getTotalAmount,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

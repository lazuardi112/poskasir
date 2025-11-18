// Data produk dummy
const products = [
  { id: 1, name: 'Kopi Hitam', price: 15000 },
  { id: 2, name: 'Cappuccino', price: 25000 },
  { id: 3, name: 'Teh Manis', price: 10000 },
  { id: 4, name: 'Roti Bakar', price: 20000 },
];

function App() {
  const [cart, setCart] = React.useState(() => {
    const savedCart = localStorage.getItem('posCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  React.useEffect(() => {
    localStorage.setItem('posCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem.quantity === 1) {
        return prevCart.filter((item) => item.id !== product.id);
      }
      return prevCart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="app">
      <header>
        <h1>Aplikasi POS Kasir</h1>
      </header>
      <main className="main-content">
        <div className="product-list">
          <h2>Produk</h2>
          <div className="products">
            {products.map((product) => (
              <div key={product.id} className="product-card" onClick={() => addToCart(product)}>
                <h3>{product.name}</h3>
                <p>Rp {product.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="cart">
          <h2>Keranjang</h2>
          {cart.length === 0 ? (
            <p>Keranjang kosong</p>
          ) : (
            <ul>
              {cart.map((item) => (
                <li key={item.id} className="cart-item">
                  <span>{item.name}</span>
                  <div className="quantity-controls">
                    <button onClick={() => removeFromCart(item)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => addToCart(item)}>+</button>
                  </div>
                  <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="total">
            <h3>Total: Rp {calculateTotal().toLocaleString()}</h3>
          </div>
          <button className="clear-button" onClick={clearCart}>
            Kosongkan Keranjang
          </button>
        </div>
      </main>
    </div>
  );
}

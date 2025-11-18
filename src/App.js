// Komponen Halaman POS (Point of Sale)
const PosPage = ({ products, cart, addToCart, removeFromCart, clearCart, calculateTotal, handlePrint }) => {
  return (
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
        {cart.length === 0 ? ( <p>Keranjang kosong</p> ) : ( <ul> {cart.map((item) => ( <li key={item.id} className="cart-item"> <span>{item.name}</span> <div className="quantity-controls"> <button onClick={() => removeFromCart(item)}>-</button> <span>{item.quantity}</span> <button onClick={() => addToCart(item)}>+</button> </div> <span>Rp {(item.price * item.quantity).toLocaleString()}</span> </li> ))} </ul> )}
        <div className="total">
          <h3>Total: Rp {calculateTotal().toLocaleString()}</h3>
        </div>
        <div className="cart-buttons">
          <button className="clear-button" onClick={clearCart}>
              Kosongkan Keranjang
          </button>
          <button className="pay-button" onClick={handlePrint} disabled={cart.length === 0}>
              Bayar & Cetak
          </button>
        </div>
      </div>
    </main>
  );
};

// Komponen Halaman Manajemen Produk
const ProductsPage = ({ products, productForm, isEditing, handleProductFormChange, handleProductSubmit, handleEditProduct, handleDeleteProduct, cancelEdit }) => {
    return (
        <section className="product-management">
            <h2>Manajemen Produk</h2>
            <form onSubmit={handleProductSubmit} className="product-form">
                <input type="text" name="name" placeholder="Nama Produk" value={productForm.name} onChange={handleProductFormChange} required />
                <input type="number" name="price" placeholder="Harga" value={productForm.price} onChange={handleProductFormChange} required />
                <input type="text" name="ean" placeholder="Kode EAN (Barcode)" value={productForm.ean} onChange={handleProductFormChange} />
                <button type="submit">{isEditing ? 'Perbarui Produk' : 'Tambah Produk'}</button>
                {isEditing && <button type="button" onClick={cancelEdit}>Batal</button>}
            </form>
            <ul className="product-management-list">
                {products.map(p => (
                    <li key={p.id}>
                        <span>{p.name} - Rp {p.price.toLocaleString()} <br/> <small>EAN: {p.ean || 'N/A'}</small></span>
                        <div>
                            <button onClick={() => handleEditProduct(p)}>Edit</button>
                            <button onClick={() => handleDeleteProduct(p.id)}>Hapus</button>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
};

// Komponen Halaman Riwayat
const HistoryPage = ({ history }) => {
    return (
        <div className="history-page">
            <h2>Riwayat Transaksi</h2>
            {history.length === 0 ? (
                <p>Belum ada transaksi.</p>
            ) : (
                <ul className="history-list">
                    {history.map(tx => (
                        <li key={tx.id} className="history-item">
                            <div className="history-item-header">
                                <span>ID: {tx.id}</span>
                                <span>{new Date(tx.id).toLocaleString()}</span>
                            </div>
                            <ul className="history-item-products">
                                {tx.cart.map(item => (
                                    <li key={item.id}>{item.name} x {item.quantity}</li>
                                ))}
                            </ul>
                            <div className="history-item-total">
                                <strong>Total: Rp {tx.total.toLocaleString()}</strong>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// Komponen Halaman Pindai EAN
const ScanPage = ({ onScanSuccess }) => {
    React.useEffect(() => {
        const html5QrCode = new Html5Qrcode("reader");
        let scannerIsRunning = false;

        const startScanner = () => {
            if (scannerIsRunning) return;
            scannerIsRunning = true;
            html5QrCode.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: 250
                },
                (decodedText, decodedResult) => {
                    onScanSuccess(decodedText);
                    stopScanner(); // Hentikan setelah pindai berhasil
                },
                (errorMessage) => {
                    // Abaikan kesalahan, teruskan pemindaian
                }
            ).catch((err) => {
                console.error("Gagal memulai pemindai", err);
                scannerIsRunning = false;
            });
        };

        const stopScanner = () => {
            if (!scannerIsRunning) return;
            html5QrCode.stop().then(() => {
                scannerIsRunning = false;
            }).catch(err => {
                console.error("Gagal menghentikan pemindai", err);
            });
        };

        startScanner();

        // Cleanup function untuk menghentikan pemindai saat komponen di-unmount
        return () => {
            stopScanner();
        };
    }, [onScanSuccess]);

    return (
        <div className="scan-page">
            <h2>Pindai Kode EAN</h2>
            <div id="reader" style={{ width: '100%' }}></div>
        </div>
    );
};

// Komponen Halaman Pengaturan
const SettingsPage = ({ settings, setSettings }) => {
    const handleSettingsChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="settings-page">
            <h2>Pengaturan Toko</h2>
            <form className="settings-form">
                <label>
                    Nama Toko:
                    <input
                        type="text"
                        name="storeName"
                        value={settings.storeName}
                        onChange={handleSettingsChange}
                    />
                </label>
                <label>
                    Slogan Struk:
                    <input
                        type="text"
                        name="receiptSlogan"
                        value={settings.receiptSlogan}
                        onChange={handleSettingsChange}
                    />
                </label>
            </form>
        </div>
    );
};

// Komponen Placeholder untuk halaman masa depan
const PlaceholderPage = ({ title }) => <div><h2>{title}</h2><p>Fitur ini akan segera hadir.</p></div>;

// Komponen Navigasi Bawah
const BottomNav = ({ activePage, setActivePage }) => {
  const navItems = ['POS', 'Produk', 'Riwayat', 'Pindai', 'Pengaturan'];
  return (
    <nav className="bottom-nav">
      {navItems.map(item => (
        <button
          key={item}
          className={`nav-button ${activePage === item.toLowerCase() ? 'active' : ''}`}
          onClick={() => setActivePage(item.toLowerCase())}>
          {item}
        </button>
      ))}
    </nav>
  );
};

// Komponen Aplikasi Utama
function App() {
  const [activePage, setActivePage] = React.useState('pos');
  const [cart, setCart] = React.useState(() => JSON.parse(localStorage.getItem('posCart') || '[]'));
  const [products, setProducts] = React.useState(() => JSON.parse(localStorage.getItem('posProducts') || JSON.stringify([
    { id: 1, name: 'Kopi Hitam', price: 15000, ean: '1111' },
    { id: 2, name: 'Cappuccino', price: 25000, ean: '2222' },
  ])));

  const [productForm, setProductForm] = React.useState({ id: null, name: '', price: '', ean: '' });
  const [isEditing, setIsEditing] = React.useState(false);
  const [settings, setSettings] = React.useState(() => JSON.parse(localStorage.getItem('posSettings') || JSON.stringify({
      storeName: 'Toko Kopi Saya',
      receiptSlogan: 'Terima kasih telah berkunjung!'
  })));
  const [history, setHistory] = React.useState(() => JSON.parse(localStorage.getItem('posHistory') || '[]'));

  React.useEffect(() => { localStorage.setItem('posCart', JSON.stringify(cart)); }, [cart]);
  React.useEffect(() => { localStorage.setItem('posProducts', JSON.stringify(products)); }, [products]);
  React.useEffect(() => { localStorage.setItem('posSettings', JSON.stringify(settings)); }, [settings]);
  React.useEffect(() => { localStorage.setItem('posHistory', JSON.stringify(history)); }, [history]);

  // Semua fungsi helper (addToCart, removeFromCart, dll.)
  const addToCartByEan = (ean) => {
    const product = products.find(p => p.ean === ean);
    if (product) {
        addToCart(product);
        setActivePage('pos'); // Kembali ke halaman POS setelah berhasil memindai
    } else {
        alert('Produk dengan kode EAN ini tidak ditemukan.');
    }
  };

  const addToCart = (product) => {
    setCart(prev => {
      const exist = prev.find(item => item.id === product.id);
      if (exist) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };
  const removeFromCart = (product) => {
    setCart(prev => {
      const exist = prev.find(item => item.id === product.id);
      if (exist.quantity === 1) return prev.filter(item => item.id !== product.id);
      return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item);
    });
  };
  const clearCart = () => setCart([]);
  const calculateTotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const handlePrint = () => {
      const newTransaction = {
          id: Date.now(),
          cart: [...cart],
          total: calculateTotal()
      };
      setHistory([newTransaction, ...history]);
      window.print();
      setCart([]);
  };
  const handleProductFormChange = (e) => setProductForm({ ...productForm, [e.target.name]: e.target.value });
  const handleProductSubmit = (e) => {
    e.preventDefault();
    const { id, name, price, ean } = productForm;
    if (isEditing) {
      setProducts(products.map(p => p.id === id ? { ...p, name, price: Number(price), ean } : p));
    } else {
      setProducts([...products, { id: Date.now(), name, price: Number(price), ean }]);
    }
    setIsEditing(false);
    setProductForm({ id: null, name: '', price: '', ean: '' });
  };
  const handleEditProduct = (product) => { setProductForm(product); setIsEditing(true); };
  const handleDeleteProduct = (id) => setProducts(products.filter(p => p.id !== id));
  const cancelEdit = () => { setIsEditing(false); setProductForm({ id: null, name: '', price: '', ean: '' }); };

  const renderPage = () => {
    switch (activePage) {
      case 'pos':
        return <PosPage products={products} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} calculateTotal={calculateTotal} handlePrint={handlePrint} />;
      case 'produk':
        return <ProductsPage products={products} productForm={productForm} isEditing={isEditing} handleProductFormChange={handleProductFormChange} handleProductSubmit={handleProductSubmit} handleEditProduct={handleEditProduct} handleDeleteProduct={handleDeleteProduct} cancelEdit={cancelEdit} />;
      case 'riwayat': return <HistoryPage history={history} />;
      case 'pindai': return <ScanPage onScanSuccess={addToCartByEan} />;
      case 'pengaturan': return <SettingsPage settings={settings} setSettings={setSettings} />;
      default: return <PosPage />;
    }
  };

  return (
    <div>
        <div id="app-container">
            <div className="app">
              <header><h1>{settings.storeName}</h1></header>
              <div className="page-content">
                {renderPage()}
              </div>
              <BottomNav activePage={activePage} setActivePage={setActivePage} />
            </div>
        </div>
        <div id="receipt-container">
            <h2>{settings.storeName}</h2>
            <table>
                <thead> <tr> <th>Produk</th> <th>Jumlah</th> <th>Harga</th> <th>Subtotal</th> </tr> </thead>
                <tbody>{cart.map(item => (<tr key={item.id}><td>{item.name}</td><td>{item.quantity}</td><td>Rp {item.price.toLocaleString()}</td><td>Rp {(item.price * item.quantity).toLocaleString()}</td></tr>))}</tbody>
            </table>
            <hr /><div className="receipt-total"><h3>Total: Rp {calculateTotal().toLocaleString()}</h3></div>
            <p className="thank-you-note">{settings.receiptSlogan}</p>
        </div>
    </div>
  );
}

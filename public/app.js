// Komponen Halaman POS (Point of Sale)
const PosPage = ({ products, cart, addToCart, removeFromCart, clearCart, calculateTotal, handlePrint }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="main-content">
      <div className="product-list">
        <div className="product-list-header">
            <h2>Produk</h2>
            <input
                type="text"
                placeholder="Cari produk..."
                className="search-bar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="products">
          {filteredProducts.map((product) => (
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
const ProductsPage = ({ products, productForm, isEditing, handleProductFormChange, handleProductSubmit, handleEditProduct, handleDeleteProduct, cancelEdit, onScanClick }) => {
    return (
        <section className="product-management">
            <h2>Manajemen Produk</h2>
            <form onSubmit={handleProductSubmit} className="product-form">
                <input type="text" name="name" placeholder="Nama Produk" value={productForm.name} onChange={handleProductFormChange} required />
                <input type="number" name="price" placeholder="Harga" value={productForm.price} onChange={handleProductFormChange} required />
                <div className="ean-input-group">
                    <input type="text" name="ean" placeholder="Kode EAN (Barcode)" value={productForm.ean} onChange={handleProductFormChange} />
                    <button type="button" onClick={onScanClick}>Pindai</button>
                </div>
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
const ScanPage = ({ onScanSuccess, onCancel }) => {
    const scannerRef = React.useRef(null);

    React.useEffect(() => {
        if (!scannerRef.current) {
            scannerRef.current = new Html5Qrcode("reader");
        }
        const html5QrCode = scannerRef.current;

        html5QrCode.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: { width: 250, height: 150 }
            },
            (decodedText, decodedResult) => {
                onScanSuccess(decodedText);
            },
            (errorMessage) => { /* abaikan */ }
        ).catch(err => console.error("Gagal memulai pemindai", err));

        return () => {
            html5QrCode.stop().catch(err => console.error("Gagal menghentikan pemindai.", err));
        };
    }, [onScanSuccess]);

    return (
        <div className="scan-overlay">
            <div className="scan-viewfinder">
                <div id="reader"></div>
            </div>
            <button className="cancel-scan-button" onClick={onCancel}>Batal</button>
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
const BottomNav = ({ activePage, setActivePage, startScan, addToCartByEan }) => {
  const navItems = [
    { name: 'POS', icon: 'pos', action: () => setActivePage('pos') },
    { name: 'Produk', icon: 'produk', action: () => setActivePage('produk') },
    { name: 'Pindai', icon: 'pindai', action: () => startScan(addToCartByEan) },
    { name: 'Riwayat', icon: 'riwayat', action: () => setActivePage('riwayat') },
    { name: 'Pengaturan', icon: 'pengaturan', action: () => setActivePage('pengaturan') },
  ];

  // Komponen ikon SVG generik
  const Icon = ({ name }) => {
    const icons = {
        pos: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
        produk: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
        riwayat: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
        pengaturan: "M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6",
        pindai: "M3 7V5a2 2 0 0 1 2-2h2 M17 3h2a2 2 0 0 1 2 2v2 M21 17v2a2 2 0 0 1-2 2h-2 M7 21H5a2 2 0 0 1-2-2v-2 M7 12h10",
    };
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={icons[name]} />
        </svg>
    );
  };

  return (
    <nav className="bottom-nav">
      {navItems.map(item => (
        <button key={item.name} className={`nav-button ${activePage === item.name.toLowerCase() ? 'active' : ''}`} onClick={item.action}>
          <Icon name={item.icon} />
          <span>{item.name}</span>
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
  const [isScanning, setIsScanning] = React.useState(false);
  const [scanCallback, setScanCallback] = React.useState(null);

  React.useEffect(() => { localStorage.setItem('posCart', JSON.stringify(cart)); }, [cart]);
  React.useEffect(() => { localStorage.setItem('posProducts', JSON.stringify(products)); }, [products]);
  React.useEffect(() => { localStorage.setItem('posSettings', JSON.stringify(settings)); }, [settings]);
  React.useEffect(() => { localStorage.setItem('posHistory', JSON.stringify(history)); }, [history]);

  // Semua fungsi helper (addToCart, removeFromCart, dll.)
  const handleScanForForm = (ean) => {
    setProductForm(prev => ({...prev, ean: ean}));
    setIsScanning(false);
  };

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

  const startScan = (callback) => {
      setScanCallback(() => callback);
      setIsScanning(true);
  };

  const onScanSuccess = (decodedText) => {
      if (scanCallback) {
          scanCallback(decodedText);
      }
      setIsScanning(false);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'pos':
        return <PosPage products={products} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} calculateTotal={calculateTotal} handlePrint={handlePrint} />;
      case 'produk':
        return <ProductsPage products={products} productForm={productForm} isEditing={isEditing} handleProductFormChange={handleProductFormChange} handleProductSubmit={handleProductSubmit} handleEditProduct={handleEditProduct} handleDeleteProduct={handleDeleteProduct} cancelEdit={cancelEdit} onScanClick={() => startScan(handleScanForForm)} />;
      case 'riwayat': return <HistoryPage history={history} />;
      case 'pengaturan': return <SettingsPage settings={settings} setSettings={setSettings} />;
      default: return <PosPage />;
    }
  };

  return (
    <div>
        <div id="app-container">
            {isScanning && <ScanPage onScanSuccess={onScanSuccess} onCancel={() => setIsScanning(false)} />}
            <div className="app">
              <header><h1>{settings.storeName}</h1></header>
              <div className="page-content">
                {renderPage()}
              </div>
              <BottomNav activePage={activePage} setActivePage={setActivePage} startScan={() => startScan(addToCartByEan)} />
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

ReactDOM.render(<App />, document.getElementById('root'));

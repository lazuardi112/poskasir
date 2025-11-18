// Komponen Ikon Pencarian
const SearchIcon = () => (
    <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

// Komponen Halaman POS (Point of Sale)
const PosPage = ({ products, cart, addToCart, removeFromCart, clearCart, calculateTotal, completeTransaction }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="main-content">
      <div className="product-list">
        <div className="product-list-header">
            <SearchIcon />
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
        {cart.length === 0 ? ( <p>Keranjang kosong</p> ) : ( <ul> {cart.map((item) => ( <li key={item.id} className="cart-item"> <div className="item-details"> <span>{item.name}</span> <small>Rp {item.price.toLocaleString()}</small> </div> <div className="quantity-controls"> <button onClick={() => removeFromCart(item)}>-</button> <span>{item.quantity}</span> <button onClick={() => addToCart(item)}>+</button> </div> <strong>Rp {(item.price * item.quantity).toLocaleString()}</strong> </li> ))} </ul> )}
        <div className="total">
          <h3>Total: Rp {calculateTotal().toLocaleString()}</h3>
        </div>
        <div className="cart-buttons">
          <button className="clear-button" onClick={clearCart}>
              Kosongkan
          </button>
          <button className="pay-button" onClick={completeTransaction} disabled={cart.length === 0}>
              Bayar
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
            <form onSubmit={handleProductSubmit} className="product-form">
                <h3>{isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
                <input type="text" name="name" placeholder="Nama Produk" value={productForm.name} onChange={handleProductFormChange} required />
                <input type="number" name="price" placeholder="Harga" value={productForm.price} onChange={handleProductFormChange} required />
                <div className="ean-input-group">
                    <input type="text" name="ean" placeholder="Kode EAN (Barcode)" value={productForm.ean} onChange={handleProductFormChange} />
                    <button type="button" onClick={onScanClick}>Pindai</button>
                </div>
                <button type="submit">{isEditing ? 'Perbarui Produk' : 'Tambah Produk'}</button>
                {isEditing && <button type="button" onClick={cancelEdit}>Batal</button>}
            </form>
            <h2>Daftar Produk</h2>
            <ul className="product-management-list">
                {products.map(p => (
                    <li key={p.id}>
                        <div className="product-info">
                           <span>{p.name} - Rp {p.price.toLocaleString()}</span>
                           <small>EAN: {p.ean || 'N/A'}</small>
                        </div>
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
                                    <li key={item.id}>
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
                                    </li>
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
        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;
        html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 150 } },
            onScanSuccess,
            (errorMessage) => { /* abaikan */ }
        ).catch(err => console.error("Gagal memulai pemindai", err));

        return () => {
            scannerRef.current.stop().catch(err => console.error("Gagal menghentikan pemindai.", err));
        };
    }, [onScanSuccess]);

    return (
        <div className="scan-overlay">
            <div id="reader"></div>
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
            <h2>Pengaturan</h2>
            <form className="settings-form">
                <label>
                    Nama Toko:
                    <input type="text" name="storeName" value={settings.storeName} onChange={handleSettingsChange} />
                </label>
                <label>
                    Slogan Struk:
                    <input type="text" name="receiptSlogan" value={settings.receiptSlogan} onChange={handleSettingsChange} />
                </label>
            </form>
        </div>
    );
};

// Komponen Halaman Struk
const ReceiptPage = ({ transaction, settings, onBack, onPrint }) => {
    return (
        <div className="receipt-page">
            <h2>Transaksi Berhasil</h2>
            <div className="receipt-details">
                <div className="receipt-header">
                    <h3>{settings.storeName}</h3>
                    <p>{new Date(transaction.id).toLocaleString()}</p>
                </div>
                <ul className="receipt-items">
                    {transaction.cart.map(item => (
                        <li key={item.id}>
                            <span>{item.name} (x{item.quantity})</span>
                            <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
                        </li>
                    ))}
                </ul>
                <div className="receipt-total">
                    <strong>Total:</strong>
                    <strong>Rp {transaction.total.toLocaleString()}</strong>
                </div>
            </div>
            <div className="receipt-actions">
                <button className="back-button" onClick={onBack}>Kembali</button>
                <button className="print-button" onClick={onPrint}>Print Struk</button>
            </div>
        </div>
    );
};

// Komponen Navigasi Bawah
const BottomNav = ({ activePage, setActivePage, startScan }) => {
  const navItems = [
    { name: 'POS', icon: 'pos', action: () => setActivePage('pos') },
    { name: 'Produk', icon: 'produk', action: () => setActivePage('produk') },
    { name: 'Pindai', icon: 'pindai', action: () => startScan() },
    { name: 'Riwayat', icon: 'riwayat', action: () => setActivePage('riwayat') },
    { name: 'Pengaturan', icon: 'pengaturan', action: () => setActivePage('pengaturan') },
  ];
  const Icon = ({ name }) => {
    const icons = {
        pos: "<path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/><circle cx='12' cy='12' r='3'/>",
        produk: "<path d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z'/><polyline points='3.27 6.96 12 12.01 20.73 6.96'/><line x1='12' y1='22.08' x2='12' y2='12'/>",
        riwayat: "<polyline points='22 12 18 12 15 21 9 3 6 12 2 12'/>",
        pengaturan: "<circle cx='12' cy='12' r='3'/><path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z'/>",
        pindai: "<path d='M3 7V5a2 2 0 0 1 2-2h2'/><path d='M17 3h2a2 2 0 0 1 2 2v2'/><path d='M21 17v2a2 2 0 0 1-2 2h-2'/><path d='M7 21H5a2 2 0 0 1-2-2v-2'/><line x1='7' y1='12' x2='17' y2='12'/>",
    };
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: icons[name] }} />
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
    { id: 1, name: 'Kopi Hitam', price: 15000, ean: '1111' }, { id: 2, name: 'Cappuccino', price: 25000, ean: '2222' },
    { id: 3, name: 'Latte', price: 20000, ean: '3333' }, { id: 4, name: 'Espresso', price: 12000, ean: '4444' },
  ])));
  const [productForm, setProductForm] = React.useState({ id: null, name: '', price: '', ean: '' });
  const [isEditing, setIsEditing] = React.useState(false);
  const [settings, setSettings] = React.useState(() => JSON.parse(localStorage.getItem('posSettings') || JSON.stringify({
      storeName: 'Modern POS', receiptSlogan: 'Terima kasih telah berkunjung!'
  })));
  const [history, setHistory] = React.useState(() => JSON.parse(localStorage.getItem('posHistory') || '[]'));
  const [isScanning, setIsScanning] = React.useState(false);
  const [scanCallback, setScanCallback] = React.useState(null);
  const [currentTransaction, setCurrentTransaction] = React.useState(null);

  React.useEffect(() => { localStorage.setItem('posCart', JSON.stringify(cart)); }, [cart]);
  React.useEffect(() => { localStorage.setItem('posProducts', JSON.stringify(products)); }, [products]);
  React.useEffect(() => { localStorage.setItem('posSettings', JSON.stringify(settings)); }, [settings]);
  React.useEffect(() => { localStorage.setItem('posHistory', JSON.stringify(history)); }, [history]);

  // Fungsi-fungsi helper
  const handleScanForForm = (ean) => { setProductForm(prev => ({...prev, ean: ean})); setIsScanning(false); };
  const addToCartByEan = (ean) => {
    const product = products.find(p => p.ean === ean);
    if (product) { addToCart(product); setActivePage('pos'); }
    else { alert('Produk dengan kode EAN ini tidak ditemukan.'); }
    setIsScanning(false);
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

  const completeTransaction = () => {
      const newTransaction = { id: Date.now(), cart: [...cart], total: calculateTotal() };
      setHistory([newTransaction, ...history]);
      setCurrentTransaction(newTransaction);
      setCart([]);
  };

  const handlePrintReceipt = () => window.print();
  const handleBackToPos = () => setCurrentTransaction(null);

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
  const handleEditProduct = (product) => { setProductForm(product); setIsEditing(true); setActivePage('produk'); };
  const handleDeleteProduct = (id) => setProducts(products.filter(p => p.id !== id));
  const cancelEdit = () => { setIsEditing(false); setProductForm({ id: null, name: '', price: '', ean: '' }); };
  const startScan = () => {
      const callback = activePage === 'produk' ? handleScanForForm : addToCartByEan;
      setScanCallback(() => callback);
      setIsScanning(true);
  };
  const onScanSuccess = (decodedText) => {
      if (scanCallback) scanCallback(decodedText);
      setIsScanning(false);
  };

  const renderPage = () => {
    if (currentTransaction) {
        return <ReceiptPage transaction={currentTransaction} settings={settings} onBack={handleBackToPos} onPrint={handlePrintReceipt} />;
    }
    switch (activePage) {
      case 'pos': return <PosPage products={products} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} calculateTotal={calculateTotal} completeTransaction={completeTransaction} />;
      case 'produk': return <ProductsPage products={products} productForm={productForm} isEditing={isEditing} handleProductFormChange={handleProductFormChange} handleProductSubmit={handleProductSubmit} handleEditProduct={handleEditProduct} handleDeleteProduct={handleDeleteProduct} cancelEdit={cancelEdit} onScanClick={startScan} />;
      case 'riwayat': return <HistoryPage history={history} />;
      case 'pengaturan': return <SettingsPage settings={settings} setSettings={setSettings} />;
      default: return <PosPage />;
    }
  };

  const receiptData = currentTransaction || { cart: cart, total: calculateTotal() };

  return (
    <div>
        <div id="app-container">
            {isScanning && <ScanPage onScanSuccess={onScanSuccess} onCancel={() => setIsScanning(false)} />}
            <header><h1>{settings.storeName}</h1></header>
            <div className="app">
              <div className="page-content">
                {renderPage()}
              </div>
              {!currentTransaction && <BottomNav activePage={activePage} setActivePage={setActivePage} startScan={startScan} />}
            </div>
        </div>
        <div id="receipt-container">
            <h2>{settings.storeName}</h2>
            <table>
                <thead> <tr> <th>Produk</th> <th>Jumlah</th> <th>Harga</th> <th>Subtotal</th> </tr> </thead>
                <tbody>{receiptData.cart.map(item => (<tr key={item.id}><td>{item.name}</td><td>{item.quantity}</td><td>Rp {item.price.toLocaleString()}</td><td>Rp {(item.price * item.quantity).toLocaleString()}</td></tr>))}</tbody>
            </table>
            <hr /><div className="receipt-total"><h3>Total: Rp {receiptData.total.toLocaleString()}</h3></div>
            <p className="thank-you-note">{settings.receiptSlogan}</p>
        </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

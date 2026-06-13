function App() {
  const navigate = useNavigate();
  const { searchTerm } = useStore(); // Grab ONLY what App needs to filter products

  const [products, setProducts] = useState<Product[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  // ... other local states

  // Only keep the data fetching logic
  useEffect(() => {
    api.fetchProducts().then(setProducts);
  }, []);

  // Filter products locally using the store's search term
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="app-container">
      <NavBar /> {/* No more props! */}
      <Routes>
        <Route
          path="/"
          element={
            <div className="layout">
              <ShopView filteredProducts={filteredProducts} />
              <CartSideBar orderPlaced={orderPlaced} />
            </div>
          }
        />
        {/* ... other routes */}
      </Routes>
    </div>
  );
}

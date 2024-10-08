import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';
import ProductDetails from './ProductDetails';
import '../App.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState(''); // Controle de ordenação
  const [productToEdit, setProductToEdit] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [error, setError] = useState(null);
  const limit = 10;

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/products`, {
        params: {
          page: currentPage,
          limit: limit,
          name: searchTerm,
          orderBy: orderBy,  // Enviar o valor de ordenação para a API
        },
      });

      const processedProducts = response.data.data.map(product => ({
        ...product,
        price: parseFloat(product.price),
        quantity: parseInt(product.quantity, 10)
      }));

      setProducts(processedProducts);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (error) {
      console.error('Erro ao buscar os produtos:', error);
      setError('Erro ao carregar os produtos');
    }
  };

  // Recarregar a lista ao mudar página, termo de pesquisa ou ordenação
  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, orderBy]); // Atualizado para incluir 'orderBy'

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleOrderChange = (e) => {
    setOrderBy(e.target.value);  // Mudar o estado de ordenação
    setCurrentPage(1);  // Reseta a página para a primeira ao mudar a ordenação
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Erro ao excluir o produto:', error);
    }
  };

  const handleFormSubmit = () => {
    setProductToEdit(null);
    fetchProducts();
  };

  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
    window.history.pushState(null, '', `/product/${productId}`);
  };

  const handleCloseDetails = () => {
    setSelectedProductId(null);
    window.history.pushState(null, '', '/');
  };

  return (
    <div className="App">
      <h1>Gerenciamento de Produtos</h1>

      <ProductForm productToEdit={productToEdit} onFormSubmit={handleFormSubmit} />

      <div className="search-order-container">
        <input
          type="text"
          placeholder="Pesquisar por nome"
          value={searchTerm}
          onChange={handleSearch}
        />
        <select onChange={handleOrderChange} value={orderBy}>
          <option value="">Ordenar por</option>
          <option value="quantity-asc">Quantidade (Crescente)</option>
          <option value="quantity-desc">Quantidade (Decrescente)</option>
          <option value="price-asc">Preço (Crescente)</option>
          <option value="price-desc">Preço (Decrescente)</option>
        </select>
      </div>

      <h2>Lista de Produtos</h2>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <ul>
            {products.map((product) => (
              <li key={product.id} onClick={() => handleProductClick(product.id)}>
                <div className="product-content">
                  <strong>{product.name}</strong> - R$ {product.price.toFixed(2)}
                  <br />
                  <small>Quantidade: {product.quantity}</small>
                </div>
                <div className="button-container">
                  <button onClick={(e) => { e.stopPropagation(); setProductToEdit(product); }}>Editar</button>
                  <button onClick={(e) => { e.stopPropagation(); deleteProduct(product.id); }}>Excluir</button>
                </div>
              </li>
            ))}
          </ul>

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? 'active' : ''}
                onClick={() => handlePageChange(index + 1)}
                disabled={currentPage === index + 1}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {selectedProductId && (
        <ProductDetails productId={selectedProductId} onClose={handleCloseDetails} />
      )}
    </div>
  );
}

export default ProductList;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm'; // Importe o formulário de produto

function ProductList() {
  const [products, setProducts] = useState([]);  // Inicializa a lista de produtos
  const [searchTerm, setSearchTerm] = useState('');  // Estado para o termo de pesquisa
  const [error, setError] = useState(null);  // Estado para armazenar erros
  const [productToEdit, setProductToEdit] = useState(null);  // Estado para o produto a ser editado
  const [currentPage, setCurrentPage] = useState(1);  // Página atual
  const [totalPages, setTotalPages] = useState(1);  // Número total de páginas
  const limit = 10;  // Produtos por página

  // Função para buscar a lista de produtos com paginação e pesquisa
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products with search term:', searchTerm);  // Adiciona log para verificar o termo de busca
        const response = await axios.get(`http://localhost:5000/products`, {
          params: {
            page: currentPage,
            limit: limit,
            search: searchTerm,  // Passa o termo de pesquisa para o back-end
          },
        });

        console.log('Response data:', response.data);  // Adiciona log para verificar os dados retornados
        setProducts(response.data.data);  // Define os produtos retornados pelo back-end
        setTotalPages(response.data.totalPages);  // Define o número total de páginas
        setError(null);  // Limpa o erro anterior, se houver
      } catch (error) {
        console.error('Erro ao buscar os produtos:', error);
        setError('Erro ao carregar os produtos');
      }
    };

    fetchProducts();
  }, [currentPage, searchTerm]);  // Escuta as mudanças de `currentPage` e `searchTerm`

  // Função para mudar de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Função para lidar com a pesquisa de produtos
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();  // Termo de busca em letras minúsculas
    setSearchTerm(term);
    setCurrentPage(1);  // Reiniciar para a primeira página quando a pesquisa mudar
    console.log('Search term changed to:', term);  // Log para verificar o novo termo de busca
  };

  return (
    <div>
      <h2>{productToEdit ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>

      <ProductForm productToEdit={productToEdit} onFormSubmit={() => setCurrentPage(1)} />

      {/* Campo de pesquisa */}
      <input
        type="text"
        placeholder="Pesquisar Produto"
        value={searchTerm}
        onChange={handleSearch}
        style={{ margin: '20px 0', padding: '10px', width: '100%' }}
      />

      <h2>Lista de Produtos</h2>
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                <div className="product-content">
                  {product.name} - R$ {product.price} (Quantidade: {product.quantity})
                </div>
                <div className="button-container">
                  <button onClick={() => setProductToEdit(product)}>Editar</button>
                  <button onClick={() => deleteProduct(product.id)}>Excluir</button>
                </div>
              </li>
            ))}
          </ul>

          {/* Navegação de páginas */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? 'active' : ''}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ProductList;

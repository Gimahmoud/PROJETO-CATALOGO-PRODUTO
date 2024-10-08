import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductForm({ productToEdit, onFormSubmit }) {
  const [product, setProduct] = useState({ name: '', price: '', quantity: '' });
  const [errorMessage, setErrorMessage] = useState(''); // Estado para controlar o erro

  useEffect(() => {
    if (productToEdit) {
      setProduct(productToEdit);
    } else {
      setProduct({ name: '', price: '', quantity: '' });
    }
  }, [productToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');  // Limpar a mensagem de erro antes de tentar enviar

    try {
      if (productToEdit) {
        // Atualizando o produto
        await axios.put(`http://localhost:5000/products/${productToEdit.id}`, product);
      } else {
        // Criando um novo produto
        await axios.post('http://localhost:5000/products', product);
      }
      onFormSubmit(); // Chama função para atualizar a lista de produtos
      setProduct({ name: '', price: '', quantity: '' });
    } catch (error) {
      // Captura o erro e define a mensagem a ser exibida
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message); // Exibe a mensagem de erro do backend
      } else {
        setErrorMessage('Erro ao salvar o produto.'); // Mensagem genérica
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({ ...prevProduct, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      {errorMessage && <div className="error-message">{errorMessage}</div>}  {/* Exibir mensagem de erro */}
      <input
        type="text"
        name="name"
        value={product.name}
        onChange={handleChange}
        placeholder="Nome do Produto"
        required
      />
      <input
        type="number"
        name="price"
        value={product.price}
        onChange={handleChange}
        placeholder="Preço"
        step="0.01"
        required
      />
      <input
        type="number"
        name="quantity"
        value={product.quantity}
        onChange={handleChange}
        placeholder="Quantidade"
        required
      />
      <button type="submit">{productToEdit ? 'Atualizar' : 'Adicionar'} Produto</button>
    </form>
  );
}

export default ProductForm;

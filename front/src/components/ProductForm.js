import React, { useState, useEffect } from 'react';
import { createProduct, updateProduct } from '../services/productService';

const ProductForm = ({ productToEdit, onFormSubmit }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || '');
      setPrice(productToEdit.price || '');
      setQuantity(productToEdit.quantity || '');
    } else {
      setName('');
      setPrice('');
      setQuantity('');
    }
  }, [productToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const product = { name, price, quantity };

    if (productToEdit) {
      await updateProduct(productToEdit.id, product);
    } else {
      await createProduct(product);
    }

    onFormSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nome do Produto"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Preço"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Quantidade"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />
      <button type="submit">{productToEdit ? 'Atualizar Produto' : 'Adicionar Produto'}</button>
    </form>
  );
};

export default ProductForm;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductDetails({ productId, onClose }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Erro ao buscar detalhes do produto:', error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (!product) {
    return <div className="product-details-modal"><div className="product-details-content">Carregando...</div></div>;
  }

  return (
    <div className="product-details-modal">
      <div className="product-details-content">
        <h2>{product.name}</h2>
        <p>ID: {product.id}</p>
        <p>Preço: R$ {parseFloat(product.price).toFixed(2)}</p>
        <p>Quantidade: {product.quantity}</p>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}

export default ProductDetails;

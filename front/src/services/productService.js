import axios from 'axios';

const API_URL = '/products';  

export const getProducts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};


// Criar novo produto
export const createProduct = async (product) => {
  const response = await axios.post(API_URL, product);
  return response.data;
};

// Atualizar produto existente
export const updateProduct = async (id, product) => {
  const response = await axios.put(`${API_URL}/${id}`, product);
  return response.data;
};

// Deletar produto
export const deleteProduct = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

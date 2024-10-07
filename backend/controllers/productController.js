const Product = require('../models/Product');

// Obter todos os produtos
const getProducts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;  // Limite de produtos por página
  const offset = parseInt(req.query.offset) || 0;  // Posição inicial
  try {
    const products = await Product.findAndCountAll({ limit, offset });
    res.status(200).json({
      total: products.count,
      data: products.rows,
      limit,
      offset,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter produtos', error: err.message });
  }
};

// Obter produto por ID
const getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter o produto', error: err.message });
  }
};

// Criar novo produto
const createProduct = async (req, res) => {
  try {
    const { name, price, quantity } = req.body;
    const product = await Product.create({ name, price, quantity });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao criar o produto', error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, price, quantity } = req.body;  // Certifique-se de que você está recebendo os dados certos
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    // Atualiza apenas se os valores forem fornecidos
    if (name) product.name = name;
    if (price) product.price = price;
    if (quantity !== undefined) product.quantity = quantity;

    await product.save();
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao atualizar o produto', error: err.message });
  }
};

// Deletar produto
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    await product.destroy();
    res.status(204).send();  // 204 significa que foi deletado com sucesso
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar o produto', error: err.message });
  }
};



module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };

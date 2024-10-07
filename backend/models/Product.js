const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Definir o modelo Product com validações
const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'O nome do produto é obrigatório' },
      len: [3, 255]  // O nome do produto deve ter entre 3 e 255 caracteres
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: true,  // Garantir que o preço seja um número decimal
      min: 0.01         // Preço mínimo de R$ 0.01
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,  // Garantir que a quantidade seja um número inteiro
      min: 0        // Quantidade mínima de 0
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at',
  }
}, {
  tableName: 'products',
  timestamps: true,
});

module.exports = Product;

import { DataTypes, Model, Sequelize } from 'sequelize';

// Define the Category model
export class Category extends Model {
  public id!: number;
  public userId!: number;
  public name!: string;
  public order!: number;
  public isPublic!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the Category model
export const initCategoryModel = (sequelize: Sequelize) => {
  Category.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'categories',
      timestamps: true,
      indexes: [
        {
          fields: ['userId'],
        },
        {
          fields: ['userId', 'order'],
        },
      ],
    }
  );
};

// Define associations
export const setupCategoryAssociations = () => {
  const { User } = require('./User');
  
  Category.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });
};
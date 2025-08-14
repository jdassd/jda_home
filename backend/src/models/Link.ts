import { DataTypes, Model, Sequelize } from 'sequelize';

// Define the Link model
export class Link extends Model {
  public id!: number;
  public userId!: number;
  public categoryId!: number;
  public title!: string;
  public url!: string;
  public description?: string;
  public icon?: string;
  public order!: number;
  public isPublic!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the Link model
export const initLinkModel = (sequelize: Sequelize) => {
  Link.init(
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
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      icon: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      modelName: 'Link',
      tableName: 'links',
      timestamps: true,
      indexes: [
        {
          fields: ['userId'],
        },
        {
          fields: ['categoryId'],
        },
        {
          fields: ['userId', 'categoryId', 'order'],
        },
      ],
    }
  );
};

// Define associations
export const setupLinkAssociations = () => {
  const { User } = require('./User');
  const { Category } = require('./Category');
  
  Link.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });
  
  Link.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category',
  });
  
  User.hasMany(Link, {
    foreignKey: 'userId',
    as: 'links',
  });
  
  Category.hasMany(Link, {
    foreignKey: 'categoryId',
    as: 'links',
  });
};
import { DataTypes, Model, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';

// Define the User model
export class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public securityQuestion!: string;
  public securityAnswer!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Hash the password before saving
  public async setPassword(password: string): Promise<void> {
    const saltRounds = 10;
    this.password = await bcrypt.hash(password, saltRounds);
  }

  // Validate password
  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  // Hash the security answer before saving
  public async setSecurityAnswer(answer: string): Promise<void> {
    const saltRounds = 10;
    this.securityAnswer = await bcrypt.hash(answer.toLowerCase().trim(), saltRounds);
  }

  // Validate security answer
  public async validateSecurityAnswer(answer: string): Promise<boolean> {
    return bcrypt.compare(answer.toLowerCase().trim(), this.securityAnswer);
  }
}

// Initialize the User model
export const initUserModel = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: '请输入有效的邮箱地址（例如：user@example.com）'
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      securityQuestion: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'security_question',
      },
      securityAnswer: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'security_answer',
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
    }
  );
};
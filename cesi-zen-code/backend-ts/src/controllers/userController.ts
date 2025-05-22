import { Request, Response } from 'express';
import User from '../models/User';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

export const createTestUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.create({
      email: 'test@test.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });
    
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// server/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { createError } from './errorHandler';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map((err) => ({
          path: err.path,
          message: err.message,
          code: err.code,
        }));
        const appError = createError('Validation error', 400);
        appError.code = 'VALIDATION_ERROR';
        appError.details = details;
        return next(appError);
      }
      next(error);
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map((err) => ({
          path: err.path,
          message: err.message,
          code: err.code,
        }));
        const appError = createError('Parameter validation error', 400);
        appError.code = 'PARAMS_VALIDATION_ERROR';
        appError.details = details;
        return next(appError);
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map((err) => ({
          path: err.path,
          message: err.message,
          code: err.code,
        }));
        const appError = createError('Query validation error', 400);
        appError.code = 'QUERY_VALIDATION_ERROR';
        appError.details = details;
        return next(appError);
      }
      next(error);
    }
  };
};

/**
 * Entity validation errors type.
 * Describes validation items for target entity.
 */
export type TEntityValidationErrors<T> = {
  /**
   * Error message for certain entity property.
   */
  [P in keyof T]?: PropValidationMessage<T[P]> | string;
};

/**
 * Validation message type for specific property type.
 * Could be a just error message for simple field or nested validation error for composite fields.
 */
export type PropValidationMessage<T> = T extends any[]
  ? string
  : T extends object
  ? TEntityValidationErrors<T>
  : string;

/**
 * Common API error.
 */
export interface ApiError extends Error {
  /**
   * Error message.
   */
  readonly message: string;

  /**
   * Response status.
   */
  readonly status: string;
}

/**
 * Api validation error for certain Entity.
 */
export interface ApiValidationError<TEntity extends object> extends ApiError {
  /**
   * Validation errors for entity fields.
   */
  readonly validationData: TEntityValidationErrors<TEntity>;
}

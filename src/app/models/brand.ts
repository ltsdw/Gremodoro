declare const brand: unique symbol;

/**
 * `Brand`
 *
 * Transforms primitive types in a distinct semantic type helping structural typing.
 *
 * @example
 * ```ts
 * type UserId = Brand<string, "UserId">;
 * type ProductId = Brand<string, "ProductId">;
 *
 * const userId = "123" as UserId;
 * const productId = "456" as ProductId;
 * ```
 *
 * @remarks
 * - No runtime overhead.
 * - Value must be casted explicitly.
 */
export type Brand<T, B> = T & { [brand]: B };

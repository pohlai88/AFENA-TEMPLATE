/**
 * Chains two event handlers together following the Radix UI convention:
 * the **external** handler runs first; if it calls `event.preventDefault()`,
 * the **internal** handler is skipped.
 *
 * This is the standard pattern used by Radix primitives to allow consumers
 * to intercept and cancel internal behavior.
 *
 * @param externalHandler - The consumer's handler (from props).
 * @param internalHandler - The component's internal handler.
 * @returns A composed handler.
 *
 * @example
 * ```tsx
 * function MenuItem({ onClick, ...props }: MenuItemProps) {
 *   return (
 *     <button
 *       onClick={composeEventHandlers(onClick, (e) => {
 *         // Internal logic — skipped if consumer calls e.preventDefault()
 *         closeMenu();
 *       })}
 *       {...props}
 *     />
 *   );
 * }
 * ```
 */
export function composeEventHandlers<E>(
  externalHandler: ((event: E) => void) | undefined,
  internalHandler: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
): (event: E) => void {
  return function handleEvent(event: E) {
    externalHandler?.(event);

    if (
      checkForDefaultPrevented === false ||
      !(event as unknown as Event).defaultPrevented
    ) {
      internalHandler(event);
    }
  };
}

/** A plain form post to /api/commerce/checkout (works without JavaScript). Server component. */
type Props = {
  offer: string
  returnTo: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}

export default function BuyButton({ offer, returnTo, children, variant = 'primary' }: Props) {
  const styles =
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : 'border border-gray-300 text-gray-900 hover:border-blue-600 hover:text-blue-600 dark:border-gray-600 dark:text-gray-100'
  return (
    <form action='/api/commerce/checkout' method='post'>
      <input type='hidden' name='offer' value={offer} />
      <input type='hidden' name='return_to' value={returnTo} />
      <button
        type='submit'
        className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 font-semibold transition ${styles}`}
      >
        {children}
      </button>
    </form>
  )
}

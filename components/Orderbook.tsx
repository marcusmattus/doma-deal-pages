interface OrderbookEntry {
  price: string;
  size: number;
  maker: `0x${string}`;
  timestamp: number;
}

interface OrderbookProps {
  asks: OrderbookEntry[];
  bids: OrderbookEntry[];
}

function OrderRow({ entry, type }: { entry: OrderbookEntry, type: 'ask' | 'bid' }) {
  const priceColor = type === 'ask' ? 'text-red-600' : 'text-green-600';
  
  return (
    <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          {entry.size}x
        </span>
        <span className="text-xs text-gray-400 font-mono" suppressHydrationWarning>
          {entry.maker.slice(0, 4)}...{entry.maker.slice(-4)}
        </span>
      </div>
      <div className="text-right">
        <div className={`font-bold ${priceColor}`}>
          ${entry.price}
        </div>
        <div className="text-xs text-gray-400">
          USDC
        </div>
      </div>
    </div>
  );
}

export default function Orderbook({ asks = [], bids = [] }: OrderbookProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Live Orderbook</h2>
        <div className="flex items-center gap-2 text-sm" suppressHydrationWarning>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-600">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Asks (Sell Orders) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-red-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Asks ({asks.length})
            </h3>
          </div>
          
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {asks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-sm">No sell orders</div>
              </div>
            ) : (
              asks.map((ask, i) => (
                <OrderRow key={i} entry={ask} type="ask" />
              ))
            )}
          </div>
        </div>

        {/* Bids (Buy Orders) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-green-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              Bids ({bids.length})
            </h3>
          </div>
          
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {bids.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-sm">No buy orders</div>
              </div>
            ) : (
              bids.map((bid, i) => (
                <OrderRow key={i} entry={bid} type="bid" />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Market Summary */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            Spread: {asks.length && bids.length 
              ? `$${(parseFloat(asks[0].price) - parseFloat(bids[0].price)).toFixed(2)}` 
              : 'N/A'
            }
          </div>
          <div className="text-gray-600">
            Total Orders: {asks.length + bids.length}
          </div>
        </div>
      </div>
    </div>
  );
}
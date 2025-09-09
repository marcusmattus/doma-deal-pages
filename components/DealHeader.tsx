interface DomainInfo {
  name: string;
  tld: string;
  label: string;
  owner: `0x${string}`;
  status: 'active' | 'tokenized' | 'bridged' | 'claimed';
  registrar: string;
  tokenizedChain?: string;
}

interface LastSale {
  price: string;
  timestamp: number;
  txHash: string;
}

interface DealHeaderProps {
  domain: DomainInfo;
  lastSale?: LastSale;
  owner: `0x${string}`;
}

function StatusBadge({ status }: { status: string }) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    tokenized: 'bg-blue-100 text-blue-800', 
    bridged: 'bg-purple-100 text-purple-800',
    claimed: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function DealHeader({ domain, lastSale, owner }: DealHeaderProps) {
  const dashboardUrl = process.env.NEXT_PUBLIC_DOMA_DASHBOARD_URL;
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{domain?.name}</h1>
          <div className="flex items-center gap-3">
            <StatusBadge status={domain?.status || 'active'} />
            {domain?.tokenizedChain && (
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                on {domain.tokenizedChain}
              </span>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-600 mb-1">Registrar</div>
          <div className="font-medium">{domain?.registrar || 'Unknown'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div>
          <div className="text-sm text-gray-600 mb-1">Owner</div>
          <div className="font-mono text-sm">
            {owner?.slice?.(0, 6)}...{owner?.slice?.(-4)}
          </div>
        </div>
        
        {lastSale && (
          <div>
            <div className="text-sm text-gray-600 mb-1">Last Sale</div>
            <div className="font-bold text-lg text-green-600">
              {lastSale.price} USDC
            </div>
            <div className="text-xs text-gray-500" suppressHydrationWarning>
              {new Date(lastSale.timestamp).toLocaleDateString()}
            </div>
          </div>
        )}
        
        <div className="flex justify-end items-center">
          {dashboardUrl && (
            <a 
              href={`${dashboardUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View on Doma
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
export function buildJsonLd({ 
  name, 
  price, 
  availability 
}: { 
  name: string; 
  price?: string; 
  availability?: string; 
}) {
  const offers = price ? { 
    "@type": "Offer", 
    priceCurrency: "USDC", 
    price, 
    availability 
  } : undefined;
  
  return { 
    "@context": "https://schema.org", 
    "@type": "Product", 
    name, 
    offers 
  };
}
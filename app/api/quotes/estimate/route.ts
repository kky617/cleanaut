import { NextResponse } from 'next/server';

type Req = {
  serviceType: 'STANDARD' | 'DEEP' | 'MOVE_IN_OUT';
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  pets?: boolean;
  addOns?: string[];
};

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<Req>;

  const serviceType = body.serviceType ?? 'STANDARD';
  const bedrooms = Math.max(0, Number(body.bedrooms ?? 0));
  const bathrooms = Math.max(0, Number(body.bathrooms ?? 0));
  const sqft = Math.max(0, Number(body.sqft ?? 0));
  const pets = Boolean(body.pets ?? false);
  const addOns = Array.isArray(body.addOns) ? body.addOns : [];

  let minutes =
    60 + bedrooms * 20 + bathrooms * 25 + Math.ceil(sqft / 500) * 10;

  if (serviceType === 'DEEP') minutes *= 1.3;
  if (serviceType === 'MOVE_IN_OUT') minutes *= 1.5;
  if (pets) minutes += 15;
  minutes += addOns.length * 15;

  const priceCents = Math.round((minutes / 60) * 6000); // $60/hr baseline

  return NextResponse.json({
    minutes: Math.round(minutes),
    priceCents,
    breakdown: { serviceType, bedrooms, bathrooms, sqft, pets, addOns },
  });
}

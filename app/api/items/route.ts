// import { NextRequest, NextResponse } from "next/server";
// import { sql } from "@/lib/db";

import { NextResponse } from "next/server";

// export const runtime = "nodejs";          // required for bcrypt; omit for pure SQL routes
// export const dynamic = "force-dynamic";   // never cache API routes

// type ItemRow = {
//   id: string;
//   business_id: string;
//   name: string;
//   unit: "G" | "KG" | "ML" | "L" | "UNIT";
//   current_stock: string;   // pg returns NUMERIC as string
//   unit_cost: string;
//   image_url: string | null;
//   created_at: string;
// };

// // GET /api/items?businessId=<uuid>
// export async function GET(req: NextRequest) {
//   const businessId = req.nextUrl.searchParams.get("businessId");
//   if (!businessId) {
//     return NextResponse.json({ error: "businessId is required" }, { status: 400 });
//   }

//   try {
//     const rows = await sql`
//       SELECT id, business_id, name, unit, current_stock, unit_cost, image_url, created_at
//       FROM items
//       WHERE business_id = ${businessId}
//       ORDER BY name ASC
//     `;
//     return NextResponse.json({ items: rows });
//   } catch (err) {
//     console.error("[GET /api/items]", err);
//     return NextResponse.json({ error: "Failed to load items" }, { status: 500 });
//   }
// }

// // POST /api/items
// // body: { businessId, name, unit, currentStock, unitCost, imageUrl? }
// export async function POST(req: NextRequest) {
//   let body: unknown;
//   try {
//     body = await req.json();
//   } catch {
//     return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
//   }

//   const { businessId, name, unit, currentStock, unitCost, imageUrl } =
//     (body ?? {}) as Record<string, unknown>;

//   if (typeof businessId !== "string" || typeof name !== "string" || !name.trim()) {
//     return NextResponse.json(
//       { error: "businessId and name are required" },
//       { status: 400 }
//     );
//   }

//   try {
//     const rows = await sql`
//       INSERT INTO items (business_id, name, unit, current_stock, unit_cost, image_url)
//       VALUES (
//         ${businessId},
//         ${name.trim()},
//         ${(unit as string) ?? "G"},
//         ${Number(currentStock) || 0},
//         ${Number(unitCost) || 0},
//         ${(imageUrl as string) ?? null}
//       )
//       RETURNING *
//     `;
//     return NextResponse.json({ item: rows[0] }, { status: 201 });
//   } catch (err) {
//     console.error("[POST /api/items]", err);
//     return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
//   }
// }

export async function GET() {
  return NextResponse.json({'message': 'endpoint working'})
}
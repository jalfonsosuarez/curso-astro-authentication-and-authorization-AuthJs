import type { ProductWithImages } from "@/interfaces";
import { defineAction, z } from "astro:actions";
import { Product, ProductImage, count, db, eq, sql } from "astro:db";

export const getProductsByPage = defineAction({
  accept: "json",
  input: z.object({
    page: z.number().optional().default(1),
    limit: z.number().optional().default(12),
  }),
  handler: async ({ page, limit }) => {
    page = page <= 0 ? 1 : page;

    const [totalRecords] = await db.select({ count: count() }).from(Product);

    const totalPages = Math.ceil(totalRecords.count / limit);

    if (page > totalPages) {
      // page = totalPages;
      return {
        products: [] as ProductWithImages[],
        totalPages: totalPages,
      };
    }

    // Esta forma no trae todos las imágenes relacionadas con el producto
    // Si usamos el ritghtJoin, entonces replica los datos de los productos por cada imagen.
    // const productos = await db
    //   .select()
    //   .from(Product)
    //   .innerJoin(ProductImage, eq(Product.id, ProductImage.productId))
    //   .limit(limit)
    //   .offset((page - 1) * limit);

    const productsQuery = sql`
        select a.*,
        ( select GROUP_CONCAT(image,',') from 
	        ( select * from ProductImage where productId = a.id limit 2 )
        ) as images
        from Product a
        LIMIT ${limit} OFFSET ${(page - 1) * limit};
    `;

    const { rows } = await db.run(productsQuery);

    return {
      products: rows as unknown as ProductWithImages[],
      totalPages: totalPages,
    };
  },
});
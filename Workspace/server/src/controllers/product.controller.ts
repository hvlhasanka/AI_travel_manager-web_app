import { Request, Response } from "express";
import { zodResponseFormat } from "openai/helpers/zod";
import * as productData from "../data/product.data";
import {
  aiSearchFiltersSchema,
  aiGenerateProductSchema,
} from "../schema/product.schema";
import openai from "../config/openai";
import cloudinary from "../config/cloudinary";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit-table";

export const createProductHandler = async (req: Request, res: Response) => {
  try {
    const product = await productData.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProductsHandler = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const searchValue = req.query.searchValue as string | undefined;

    const destination = req.query.destination as string | undefined;
    const category = req.query.category as string | undefined;
    const minPrice = req.query.minPrice
      ? parseFloat(req.query.minPrice as string)
      : undefined;
    const maxPrice = req.query.maxPrice
      ? parseFloat(req.query.maxPrice as string)
      : undefined;
    const status = req.query.status as string | undefined;

    const { products, totalCount } = await productData.getProducts(
      page,
      limit,
      searchValue,
      {
        destination,
        category,
        minPrice,
        maxPrice,
        status,
      },
    );

    res.status(200).json({
      data: products,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProductHandler = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const product = await productData.updateProduct(productId, req.body);
    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProductHandler = async (req: Request, res: Response) => {
  try {
    const { productIds } = req.body;
    await productData.deleteProducts(productIds);
    res.status(200).json({ message: "Product(s) deleted successfully" });
  } catch (error) {
    console.error("Error deleting product(s):", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const aiSearchHandler = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const aiResponse = await openai.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a specialised individual with over a decade of experience in identifying key filters off of natural language. Please extract the filter parameters for the travel products based on the user's search query.
              Example 1:
              User - "Show me dinner buffets in Colombo"
              Output - {"category": "Dinner Buffet", "destination": "Colombo"}

              Example 2:
              User - "Show active family packages"
              Output - {"category": "Family Package", "status": "Active"}

              Example 3:
              User - "Show products below LKR 10,000"
              Output - {"maxPrice": 10000}

              Example 4:
              User - "Show airport transfer services"
              Output - {"category": "Airport Transfer"}`,
        },
        { role: "user", content: prompt },
      ],
      response_format: zodResponseFormat(
        aiSearchFiltersSchema,
        "product_filters",
      ),
    });

    const extractedFilters = aiResponse.choices[0].message.parsed;

    if (!extractedFilters) {
      return res.status(500).json({ error: "Failed to parse filters from AI" });
    }

    const cleanedFilters = {
      destination: extractedFilters.destination || undefined,
      category: extractedFilters.category || undefined,
      minPrice: extractedFilters.minPrice || undefined,
      maxPrice: extractedFilters.maxPrice || undefined,
      status: extractedFilters.status || undefined,
    };

    const { products, totalCount } = await productData.getProducts(
      1,
      20,
      undefined,
      cleanedFilters,
    );

    res.status(200).json({
      data: products,
      appliedFilters: cleanedFilters,
      pagination: {
        total: totalCount,
        page: 1,
        limit: 10,
        totalPages: Math.ceil(totalCount / 20),
      },
    });
  } catch (error) {
    console.error("Error in AI search:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const aiGenerateProductHandler = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const aiResponse = await openai.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert travel product creator. Extract or generate travel product details based on the user's natural language description. Provide all fields for a product creation form. If a specific detail is missing, make a reasonable guess or leave it as an empty string (or 0 for numbers). Use ISO datetime for dates.`,
        },
        { role: "user", content: prompt },
      ],
      response_format: zodResponseFormat(
        aiGenerateProductSchema,
        "product_details",
      ),
    });

    const generatedProduct = aiResponse.choices[0].message.parsed;

    if (!generatedProduct) {
      return res
        .status(500)
        .json({ error: "Failed to generate product details from AI" });
    }

    res.status(200).json(generatedProduct);
  } catch (error) {
    console.error("Error in AI generate product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProductStatsHandler = async (req: Request, res: Response) => {
  try {
    const stats = await productData.getProductStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching product stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const aiGenerateImageHandler = async (req: Request, res: Response) => {
  try {
    const { productName, description, destination, category } = req.body;
    if (!productName || !description || !destination || !category) {
      return res.status(400).json({
        error:
          "Product name, description, destination, and category are required to generate an image",
      });
    }

    const prompt = `A high quality travel product image for "${productName}". Category: ${category}. Destination: ${destination}. Description: ${description}. No text or words in the image.`;

    const aiResponse = await openai.images.generate({
      model: "gpt-image-1-mini",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "low",
    });

    const imageObject = aiResponse.data?.[0];
    const uploadSource = `data:image/png;base64,${imageObject?.b64_json}`;

    if (!uploadSource) {
      return res
        .status(500)
        .json({ error: "Failed to extract image data from AI response" });
    }

    const uploadResponse = await cloudinary.uploader.upload(uploadSource, {
      folder: "AI Travel Manager/Products",
    });

    res.status(200).json({ imageUrl: uploadResponse.secure_url });
  } catch (error) {
    console.error("Error in AI generate image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const exportProductsHandler = async (req: Request, res: Response) => {
  try {
    const {
      productIds,
      searchValue,
      destination,
      category,
      minPrice,
      maxPrice,
      status,
    } = req.body;

    const filters = {
      destination,
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      status,
    };

    const products = await productData.getProductsForExport(
      productIds,
      searchValue,
      filters,
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Products");

    worksheet.columns = [
      { header: "Product ID", key: "productId", width: 15 },
      { header: "Product Image URL", key: "imageUrl", width: 40 },
      { header: "Product Name", key: "productName", width: 30 },
      { header: "Destination", key: "destination", width: 20 },
      { header: "Description", key: "description", width: 50 },
      { header: "Category", key: "category", width: 20 },
      { header: "Price", key: "price", width: 15 },
      { header: "Inventory Count", key: "inventoryCount", width: 15 },
      { header: "Valid From", key: "validFrom", width: 20 },
      { header: "Valid Until", key: "validUntil", width: 20 },
      { header: "Status", key: "status", width: 15 },
      { header: "Created At", key: "createdAt", width: 20 },
      { header: "Last Updated At", key: "updatedAt", width: 20 },
    ];

    // Header Row Styling
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    products.forEach((product) => {
      worksheet.addRow({
        ...product,
        imageUrl: product.imageUrl || "N/A",
        validFrom: product.validFrom.toISOString().split("T")[0],
        validUntil: product.validUntil.toISOString().split("T")[0],
        createdAt: product.createdAt
          .toISOString()
          .replace("T", " ")
          .substring(0, 19),
        updatedAt: product.updatedAt
          .toISOString()
          .replace("T", " ")
          .substring(0, 19),
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=products_export.xlsx",
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error exporting products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const exportProductsPdfHandler = async (req: Request, res: Response) => {
  try {
    const {
      productIds,
      searchValue,
      destination,
      category,
      minPrice,
      maxPrice,
      status,
    } = req.body;

    const filters = {
      destination,
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      status,
    };

    const products = await productData.getProductsForExport(
      productIds,
      searchValue,
      filters,
    );

    const doc = new PDFDocument({ margin: 40, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=products_export.pdf",
    );
    doc.pipe(res);

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      if (i > 0) doc.addPage();

      // Header
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#94a3b8")
        .text(`Product ID: ${product.productId}`, 40, 40);
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#94a3b8")
        .text(`Generated on ${new Date().toLocaleDateString()}`, 40, 40, {
          align: "right",
        });

      doc.moveDown(2);

      // Title & Subtitle
      doc
        .fontSize(28)
        .font("Helvetica-Bold")
        .fillColor("#0f172a")
        .text(product.productName, 40, doc.y);
      doc.moveDown(0.2);
      doc
        .fontSize(14)
        .font("Helvetica")
        .fillColor("#64748b")
        .text(
          `${product.category.toUpperCase()} | ${product.destination}`,
          40,
          doc.y,
        );
      doc.moveDown(1.5);

      // Image
      if (product.imageUrl) {
        try {
          const response = await fetch(product.imageUrl);
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const imageStartY = doc.y;

          doc.image(buffer, 40, imageStartY, {
            fit: [515, 280],
            align: "center",
          });
          doc.y = imageStartY + 300;
        } catch (imgError) {
          console.error("Failed to load image for PDF", imgError);
        }
      }

      // Divider
      doc
        .strokeColor("#e2e8f0")
        .lineWidth(1)
        .moveTo(40, doc.y)
        .lineTo(555, doc.y)
        .stroke();
      doc.moveDown(1.5);

      // Details Grid (3 columns)
      const detailsY = doc.y;
      const col1 = 40;
      const col2 = 220;
      const col3 = 400;

      // Row 1
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor("#475569")
        .text("Price", col1, detailsY);
      doc
        .fontSize(12)
        .font("Helvetica")
        .fillColor("#0f172a")
        .text(`LKR ${product.price}`, col1, detailsY + 15);

      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor("#475569")
        .text("Status", col2, detailsY);
      doc
        .fontSize(12)
        .font("Helvetica")
        .fillColor(product.status === "ACTIVE" ? "#16a34a" : "#dc2626")
        .text(product.status, col2, detailsY + 15);

      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor("#475569")
        .text("Inventory", col3, detailsY);
      doc
        .fontSize(12)
        .font("Helvetica")
        .fillColor("#0f172a")
        .text(product.inventoryCount.toString(), col3, detailsY + 15);

      // Row 2
      const row2Y = detailsY + 45;
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor("#475569")
        .text("Valid From", col1, row2Y);
      doc
        .fontSize(12)
        .font("Helvetica")
        .fillColor("#0f172a")
        .text(product.validFrom.toISOString().split("T")[0], col1, row2Y + 15);

      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor("#475569")
        .text("Valid Until", col2, row2Y);
      doc
        .fontSize(12)
        .font("Helvetica")
        .fillColor("#0f172a")
        .text(product.validUntil.toISOString().split("T")[0], col2, row2Y + 15);

      doc.y = row2Y + 50;
      doc.moveDown(1);
      doc
        .strokeColor("#e2e8f0")
        .lineWidth(1)
        .moveTo(40, doc.y)
        .lineTo(555, doc.y)
        .stroke();
      doc.moveDown(1.5);

      // Description
      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .fillColor("#0f172a")
        .text("Description", 40, doc.y);
      doc.moveDown(0.5);
      doc
        .fontSize(11)
        .font("Helvetica")
        .fillColor("#334155")
        .text(product.description || "No description provided.", 40, doc.y, {
          width: 515,
          lineGap: 4,
        });

      // Footer
      const formattedCreatedAt = product.createdAt
        .toISOString()
        .replace("T", " ")
        .substring(0, 16);
      const formattedUpdatedAt = product.updatedAt
        .toISOString()
        .replace("T", " ")
        .substring(0, 16);

      const footerY = 780;
      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#94a3b8")
        .text(`Created At: ${formattedCreatedAt}`, 40, footerY, {
          lineBreak: false,
        });
      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#94a3b8")
        .text(`Last Updated At: ${formattedUpdatedAt}`, 40, footerY, {
          align: "right",
          lineBreak: false,
          width: 515,
        });
    }

    doc.end();
  } catch (error) {
    console.error("Error exporting PDF:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

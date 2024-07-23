import Products from "../modals/Products.js";
import ApiError from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const addProduct = asyncHandler(async (req, res) => {
  const { cat_name, subCategories } = req.body;
  let category = await Products.findOne({ cat_name });
  if (category) {
    subCategories.forEach((subCat) => {
      const existingSubCat = category.subCategories.find(
        (sc) => sc.subCat_name === subCat.subCat_name
      );

      if (existingSubCat) {
        // Subcategory exists, check for products
        subCat.products.forEach((newProduct) => {
          const existingProduct = existingSubCat.products.find(
            (prod) => prod.prod_name === newProduct.prod_name
          );

          if (existingProduct) {
            // Product exists, update product options
            existingProduct.options.push(...newProduct.options);
          } else {
            // Add new product to existing subcategory
            existingSubCat.products.push(newProduct);
          }
        });
      } else {
        // Add new subcategory
        category.subCategories.push(subCat);
      }
    });
    await category.save();
    return res.status(201).json(new ApiResponse(200,"added to existing records"));
  } else {
    // Create new category with subcategories
    category = new Products({
      cat_name,
      subCategories,
    });
    await category.save();
    return res.status(201).json(new ApiResponse(200,"added new category of data"));
  }
});
const getProducts = asyncHandler(async (req, res) => {
    const categories = await Products.find({}, "cat_name subCategories");
    if (!categories) {
      return res.status(404).json(new ApiError(404,"No Products to show"));
    }
    res.status(200).json(categories);
})

export { addProduct,getProducts };

# Filament Admin Panel

## Access

The admin panel is accessible at: `http://localhost/admin`

## Login Credentials

- **Email**: admin@admin.com
- **Password**: password

## Features

### Products Management
- Add, edit, and delete products
- Upload multiple images per product (with drag-and-drop reordering)
- Set main image using sort_order (0 = main image)
- Assign categories and sizes to products
- Set product prices and descriptions
- Toggle product active/inactive status
- Auto-generate slugs from product names

### Categories Management
- Add, edit, and delete categories
- Auto-generate slugs from category names
- View product count per category

### Sizes Management
- Add, edit, and delete sizes
- View product count per size

## Image Upload

Images are stored in `storage/app/public/products/` and accessible via the public storage link at `/storage/products/`.

The Repeater field allows you to:
- Add multiple images per product
- Reorder images by dragging
- Set sort_order (0 for main image, 1+ for additional images)
- Use the built-in image editor
- Maximum file size: 2MB per image

## Database Structure

- **categories**: Product categories (Voilée, Non voilée, Enfant)
- **products**: Main product information
- **sizes**: Available sizes (36, 38, 40, 42, 44, 46, 48, 50)
- **product_images**: Multiple images per product with sort ordering
- **product_size**: Pivot table linking products to sizes with stock quantities

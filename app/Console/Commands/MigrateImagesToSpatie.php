<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class MigrateImagesToSpatie extends Command
{
    protected $signature = 'media:migrate-products';
    protected $description = 'Migrate existing ProductImage records to Spatie Media Library';

    public function handle()
    {
        $products = Product::with('images')->get();
        $bar = $this->output->createProgressBar($products->count());

        foreach ($products as $product) {
            foreach ($product->images as $img) {
                $fullPath = storage_path('app/public/' . $img->image_path);

                if (!file_exists($fullPath)) {
                    $this->warn("Missing file: {$img->image_path}");
                    continue;
                }

                // Add to Spatie — this triggers WebP conversion automatically
                $product->addMedia($fullPath)
                    ->preservingOriginal() // keep the original file safe
                    ->toMediaCollection('images');
            }
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Migration complete!');
    }
}
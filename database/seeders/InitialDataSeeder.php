<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Size;

class InitialDataSeeder extends Seeder
{
    public function run(): void
    {
        // Create categories
        $categories = [
            ['name' => 'Voilée', 'slug' => 'voilee'],
            ['name' => 'Non voilée', 'slug' => 'non-voilee'],
            ['name' => 'Enfant', 'slug' => 'enfant'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        // Create sizes
        $sizes = [36, 38, 40, 42, 44, 46, 48, 50];
        
        foreach ($sizes as $size) {
            Size::create(['name' => (string)$size]);
        }
    }
}

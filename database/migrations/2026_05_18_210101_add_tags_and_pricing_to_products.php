<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Tag badge: promo | bestseller | nouveaute | null
            $table->string('tag')->nullable()->after('is_active');
 
            // Promo pricing — only used when tag = 'promo'
            $table->decimal('original_price', 10, 2)->nullable()->after('price');
            // 'price' column already exists and will hold the discounted/sale price
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            //
        });
    }
};

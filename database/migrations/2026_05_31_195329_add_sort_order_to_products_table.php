<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedInteger('sort_order')->default(0)->after('front_page');
        });

        // PostgreSQL-compatible row numbering
        DB::statement('
        UPDATE products
        SET sort_order = subquery.row_num
        FROM (
            SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) AS row_num
            FROM products
        ) AS subquery
        WHERE products.id = subquery.id
    ');
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('sort_order');
        });
    }
};

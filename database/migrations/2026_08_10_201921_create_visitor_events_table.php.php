<?php
// database/migrations/2026_08_10_150000_create_visitor_events_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visitor_events', function (Blueprint $table) {
            $table->id();
            $table->uuid('visitor_id')->index();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('session_id', 128)->nullable();
            $table->string('event_type', 50);
            $table->foreignId('product_id')->nullable();
            $table->string('product_type', 50)->nullable(); // 'product', 'pack', etc.
            $table->foreignId('order_id')->nullable();
            $table->string('url', 500)->nullable();
            $table->string('referrer', 500)->nullable();
            $table->string('utm_source', 100)->nullable();
            $table->string('utm_medium', 100)->nullable();
            $table->string('utm_campaign', 100)->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->string('platform', 20)->nullable(); // 'desktop', 'mobile', 'tablet'
            $table->jsonb('meta')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visitor_events');
    }
};
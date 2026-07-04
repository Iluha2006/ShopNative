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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string("discount");
            $table->text('description')->nullable();
            $table->decimal('price',8,2);
            $table->integer( 'quantity');
            $table->string('imageUrl')->nullable();
            $table->json("size")->nullable();
            $table->json("images_product")->nullable();
            $table->foreignId('category_id')
            ->nullable()
            ->constrained('category_products');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

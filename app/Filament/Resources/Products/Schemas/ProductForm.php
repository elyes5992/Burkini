<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('category_id')
                    ->relationship('category', 'name')
                    ->required()
                    ->searchable()
                    ->preload(),

                TextInput::make('name')
                    ->required()
                    ->maxLength(255)
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn($state, callable $set) => $set('slug', Str::slug($state))),

                TextInput::make('slug')
                    ->required()
                    ->maxLength(255)
                    ->unique(ignoreRecord: true),

                Textarea::make('description')
                    ->required()
                    ->rows(4)
                    ->columnSpanFull(),

                // ── Pricing ──────────────────────────────────────────────
                TextInput::make('price')
                    ->label('Prix de vente (DT)')
                    ->required()
                    ->numeric()
                    ->prefix('DT')
                    ->minValue(0)
                    ->step(0.01)
                    ->helperText('Lors d\'une promo, mettez ici le prix réduit.'),

                TextInput::make('original_price')
                    ->label('Prix original / barré (DT)')
                    ->numeric()
                    ->prefix('DT')
                    ->minValue(0)
                    ->step(0.01)
                    ->nullable()
                    ->helperText('Remplissez uniquement pour les promos. Laissez vide sinon.')
                    ->visible(fn($get) => $get('tag') === 'promo'),

                // ── Tag badge ─────────────────────────────────────────────
                Select::make('tag')
                    ->label('Badge / Étiquette')
                    ->nullable()
                    ->options([
                        'promo'      => '🔥 Promo',
                        'bestseller' => '⭐ Best Seller',
                        'nouveaute'  => '🆕 Nouveauté',
                    ])
                    ->placeholder('Aucun badge')
                    ->native(false)
                    ->live()
                    ->helperText('Choisissez "Promo" pour afficher un prix barré.'),

                Toggle::make('is_active')
                    ->default(true),

                Select::make('sizes')
                    ->relationship('sizes', 'name')
                    ->multiple()
                    ->preload()
                    ->columnSpanFull(),

                Repeater::make('images')
                    ->relationship()
                    ->schema([
                        FileUpload::make('image_path')
                            ->image()
                            ->directory('products')
                            ->required()
                            ->maxSize(10240)
                            ->imageEditor()
                            // ->optimize('webp') // Converts to WebP automatically
                            // ->resize(1920, 1080) // Prevents ultra-massive resolutions
                            ->columnSpanFull(),

                        TextInput::make('sort_order')
                            ->numeric()
                            ->default(0)
                            ->minValue(0)
                            ->label('Sort Order (0 = main image)'),
                    ])
                    ->columnSpanFull()
                    ->defaultItems(1)
                    ->reorderable()
                    ->collapsible()
                    ->itemLabel(fn(array $state): ?string => $state['sort_order'] === 0 ? 'Main Image' : 'Image ' . ($state['sort_order'] ?? 'New'))
                    ->addActionLabel('Add Image'),
            ]);
    }
}

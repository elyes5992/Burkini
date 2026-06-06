<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
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

                Toggle::make('front_page')
                    ->label('Afficher sur la page d\'accueil (Pièces Maîtresses)')
                    ->default(false),

                Select::make('sizes')
                    ->relationship('sizes', 'name')
                    ->multiple()
                    ->preload()
                    ->columnSpanFull(),

                SpatieMediaLibraryFileUpload::make('images')
                    ->collection('images')
                    ->multiple()
                    ->reorderable()
                    ->image()
                    ->imageEditor()
                    ->maxFiles(10)
                    ->maxSize(10240)
                    ->directory('products')
                    ->imageResizeMode('cover')
                    ->imageResizeTargetWidth('1920')
                    ->imageResizeTargetHeight('1080')
                    ->columnSpanFull()
                    ->label('Product Images'),
            ]);
    }
}

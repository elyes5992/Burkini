<?php

namespace App\Filament\Resources\Products\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Table;
use Filament\Tables\Filters\SelectFilter;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('images.image_path')
                    ->label('Image')
                    ->circular()
                    ->stacked()
                    ->limit(3)
                    ->limitedRemainingText(),

                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('category.name')
                    ->sortable()
                    ->searchable(),

                // Show both prices when a promo is active
                TextColumn::make('price')
                    ->label('Prix')
                    ->money('TND')
                    ->sortable()
                    ->description(
                        fn($record) => $record->original_price
                            ? 'Barré: ' . number_format($record->original_price, 2) . ' DT'
                            : null
                    ),

                TextColumn::make('tag')
                    ->label('Badge')
                    ->badge()
                    ->formatStateUsing(fn(?string $state): string => match ($state) {
                        'promo'      => '🔥 Promo',
                        'bestseller' => '⭐ Best Seller',
                        'nouveaute'  => '🆕 Nouveauté',
                        default      => '—',
                    })
                    ->color(fn(?string $state): string => match ($state) {
                        'promo'      => 'danger',
                        'bestseller' => 'warning',
                        'nouveaute'  => 'success',
                        default      => 'gray',
                    }),

                IconColumn::make('is_active')
                    ->boolean()
                    ->sortable(),
                IconColumn::make('front_page')
                    ->label('Page d\'accueil')
                    ->boolean()
                    ->sortable(),

                TextColumn::make('sizes.name')
                    ->badge()
                    ->separator(','),

                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('category')
                    ->relationship('category', 'name'),

                SelectFilter::make('tag')
                    ->label('Badge')
                    ->options([
                        'promo'      => '🔥 Promo',
                        'bestseller' => '⭐ Best Seller',
                        'nouveaute'  => '🆕 Nouveauté',
                    ]),

                SelectFilter::make('is_active')
                    ->options([
                        1 => 'Active',
                        0 => 'Inactive',
                    ]),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}

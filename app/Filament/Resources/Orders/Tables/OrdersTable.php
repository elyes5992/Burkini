<?php

namespace App\Filament\Resources\Orders\Tables;

use Filament\Tables\Table;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Actions\EditAction;

class OrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('#')
                    ->sortable()
                    ->weight('bold'),

                TextColumn::make('customer_name')
                    ->label('Client')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('customer_phone')
                    ->label('Téléphone')
                    ->searchable(),

                TextColumn::make('customer_city')
                    ->label('Ville'),

                // Products with images — plain TextColumn with HTML
                TextColumn::make('id')
                    ->label('Produits')
                    ->html()
                    ->getStateUsing(function ($record) {
                        $record->loadMissing('items');
                        $html = '<div style="display:flex;flex-direction:column;gap:8px;padding:4px 0;">';
                        foreach ($record->items as $item) {
                            $imgUrl = $item->product_image ?? null;
                            $img = $imgUrl
                                ? '<img src="' . e($imgUrl) . '" style="width:38px;height:50px;object-fit:cover;border-radius:5px;flex-shrink:0;">'
                                : '<div style="width:38px;height:50px;background:#374151;border-radius:5px;flex-shrink:0;"></div>';
                            $html .= '
                                <div style="display:flex;align-items:center;gap:10px;">
                                    ' . $img . '
                                    <div style="line-height:1.4;">
                                        <div style="font-size:13px;font-weight:500;">' . e($item->product_name) . '</div>
                                        <div style="font-size:11px;color:#9ca3af;">Taille: ' . e($item->size) . ' · Qté: ' . $item->quantity . '</div>
                                        <div style="font-size:12px;font-weight:600;color:#38bdf8;">' . number_format($item->product_price, 2) . ' DT</div>
                                    </div>
                                </div>';
                        }
                        $html .= '</div>';
                        return $html;
                    }),

                TextColumn::make('total_price')
                    ->label('Total')
                    ->money('TND')
                    ->sortable()
                    ->weight('bold'),

                TextColumn::make('status')
                    ->label('Statut')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match($state) {
                        'pending'   => 'En attente',
                        'confirmed' => 'En cours',
                        'shipped'   => 'Expédié',
                        'delivered' => 'Terminé',
                        'cancelled' => 'Annulé',
                        default     => $state,
                    })
                    ->color(fn (string $state): string => match($state) {
                        'pending'   => 'warning',
                        'confirmed' => 'info',
                        'shipped'   => 'primary',
                        'delivered' => 'success',
                        'cancelled' => 'danger',
                        default     => 'gray',
                    }),

                TextColumn::make('created_at')
                    ->label('Date')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->label('Statut')
                    ->options([
                        'pending'   => 'En attente',
                        'confirmed' => 'En cours',
                        'shipped'   => 'Expédié',
                        'delivered' => 'Terminé',
                        'cancelled' => 'Annulé',
                    ]),
            ])
            ->actions([
                EditAction::make()->label('Modifier'),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
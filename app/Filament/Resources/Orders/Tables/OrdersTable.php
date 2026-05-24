<?php

namespace App\Filament\Resources\Orders\Tables;

use Filament\Tables\Table;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Actions\EditAction;

use Filament\Tables\Columns\SelectColumn;
use Filament\Actions\Action;


class OrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                // Products with images
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

                TextColumn::make('customer_name')
                    ->label('Client')
                    ->searchable()
                    ->sortable()
                    ->weight('medium'),

                TextColumn::make('customer_phone')
                    ->label('Téléphone')
                    ->searchable()
                    ->copyable()
                    ->copyMessage('Numéro copié!'),

                TextColumn::make('customer_city')
                    ->label('Ville')
                    ->searchable(),

                TextColumn::make('customer_address')
                    ->label('Adresse')
                    ->limit(30)
                    ->tooltip(fn ($record) => $record->customer_address)
                    ->searchable(),

                TextColumn::make('total_price')
                    ->label('Total')
                    ->money('TND')
                    ->sortable()
                    ->weight('bold'),

                SelectColumn::make('status')
                    ->label('Statut')
                    ->options([
                        'pending'   => '🕐 En attente',
                        'confirmed' => '⚙️ En cours',
                        'shipped'   => '🚚 Expédié',
                        'delivered' => '✅ Terminé',
                        'cancelled' => '❌ Annulé',
                    ])
                    ->selectablePlaceholder(false)
                    ->width('150px'),

                TextColumn::make('created_at')
                    ->label('Date')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->since()
                    ->tooltip(fn ($record) => $record->created_at->format('d/m/Y H:i')),
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
                // Image preview modal
                Action::make('preview')
                    ->label('Aperçu')
                    ->icon('heroicon-o-photo')
                    ->color('info')
                    ->modalHeading(fn ($record) => 'Commande #' . $record->id . ' — ' . $record->customer_name)
                    ->modalContent(function ($record) {
                        $record->loadMissing('items');
                        $html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:16px;padding:8px;">';
                        foreach ($record->items as $item) {
                            $imgUrl = $item->product_image ?? null;
                            $img = $imgUrl
                                ? '<img src="' . e($imgUrl) . '" style="width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:10px;margin-bottom:8px;">'
                                : '<div style="width:100%;aspect-ratio:3/4;background:#374151;border-radius:10px;margin-bottom:8px;display:flex;align-items:center;justify-content:center;color:#6b7280;font-size:12px;">Pas d\'image</div>';
                            $html .= '
                                <div style="background:#1f2937;border-radius:12px;padding:10px;text-align:center;">
                                    ' . $img . '
                                    <div style="font-size:13px;font-weight:600;color:#f9fafb;margin-bottom:4px;">' . e($item->product_name) . '</div>
                                    <div style="font-size:11px;color:#9ca3af;margin-bottom:4px;">Taille: ' . e($item->size) . '</div>
                                    <div style="font-size:11px;color:#9ca3af;margin-bottom:6px;">Qté: ' . $item->quantity . '</div>
                                    <div style="font-size:14px;font-weight:700;color:#38bdf8;">' . number_format($item->product_price, 2) . ' DT</div>
                                </div>';
                        }
                        $html .= '</div>';

                        // Order summary footer
                        $html .= '
                            <div style="margin-top:16px;padding:12px 8px;border-top:1px solid #374151;display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;font-size:13px;color:#9ca3af;">
                                <span>📞 ' . e($record->customer_phone) . '</span>
                                <span>📍 ' . e($record->customer_city) . ' — ' . e($record->customer_address) . '</span>
                                <span style="color:#34d399;font-weight:700;">Total: ' . number_format($record->total_price, 2) . ' DT</span>
                            </div>';

                        return new \Illuminate\Support\HtmlString($html);
                    })
                    ->modalSubmitAction(false)
                    ->modalCancelActionLabel('Fermer')
                    ->slideOver(), // slides in from the right — great on mobile

                EditAction::make()
                    ->label('Modifier')
                    ->icon('heroicon-o-pencil-square'),
            ])
            ->defaultSort('created_at', 'desc')
            ->striped()
            ->paginated([10, 25, 50]);
    }
}
<?php

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Schemas\Schema;

class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('customer_name')
                    ->label('Nom du client')
                    ->required(),

                TextInput::make('customer_phone')
                    ->label('Téléphone')
                    ->required(),

                TextInput::make('customer_city')
                    ->label('Ville'),

                Textarea::make('customer_address')
                    ->label('Adresse')
                    ->required()
                    ->rows(2)
                    ->columnSpanFull(),

                TextInput::make('total_price')
                    ->label('Total (DT)')
                    ->numeric()
                    ->disabled(), // read-only, calculated

                Select::make('status')
                    ->label('Statut')
                    ->required()
                    ->options([
                        'pending'   => 'En attente',
                        'confirmed' => 'En cours',
                        'shipped'   => 'Expédié',
                        'delivered' => 'Terminé',
                        'cancelled' => 'Annulé',
                    ])
                    ->native(false), // renders as styled dropdown, not browser default

                Textarea::make('notes')
                    ->label('Notes')
                    ->rows(2)
                    ->columnSpanFull(),
            ]);
    }
}
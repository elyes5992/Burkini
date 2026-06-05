<x-filament::page>

    {{-- Chart.js CDN --}}
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>

    {{-- ─── STATS CARDS ─── --}}
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;margin-bottom:32px;">

        {{-- Total commandes --}}
        <div style="background:#1f2937;border-radius:12px;padding:20px;border:1px solid #374151;">
            <div style="font-size:12px;color:#9ca3af;margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em;">Total Commandes</div>
            <div style="font-size:32px;font-weight:700;color:#f9fafb;">{{ $totalOrders }}</div>
            <div style="margin-top:8px;font-size:12px;color:#6b7280;">Toutes périodes</div>
        </div>

        {{-- Revenu --}}
        <div style="background:#1f2937;border-radius:12px;padding:20px;border:1px solid #374151;">
            <div style="font-size:12px;color:#9ca3af;margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em;">Chiffre d'Affaires</div>
            <div style="font-size:28px;font-weight:700;color:#34d399;">{{ number_format($totalRevenue, 2) }} DT</div>
            <div style="margin-top:8px;font-size:12px;color:#6b7280;">Expédiées + Terminées</div>
        </div>

        {{-- En attente --}}
        <div style="background:#1f2937;border-radius:12px;padding:20px;border-left:4px solid #f59e0b;">
            <div style="font-size:12px;color:#9ca3af;margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em;">En Attente</div>
            <div style="font-size:32px;font-weight:700;color:#fbbf24;">{{ $pendingOrders }}</div>
            <div style="margin-top:8px;font-size:12px;color:#6b7280;">À traiter</div>
        </div>

        {{-- En cours --}}
        <div style="background:#1f2937;border-radius:12px;padding:20px;border-left:4px solid #38bdf8;">
            <div style="font-size:12px;color:#9ca3af;margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em;">En Cours</div>
            <div style="font-size:32px;font-weight:700;color:#38bdf8;">{{ $confirmedOrders }}</div>
            <div style="margin-top:8px;font-size:12px;color:#6b7280;">Confirmées</div>
        </div>

        {{-- Terminé --}}
        <div style="background:#1f2937;border-radius:12px;padding:20px;border-left:4px solid #34d399;">
            <div style="font-size:12px;color:#9ca3af;margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em;">Terminées</div>
            <div style="font-size:32px;font-weight:700;color:#34d399;">{{ $deliveredOrders }}</div>
            <div style="margin-top:8px;font-size:12px;color:#6b7280;">Livrées</div>
        </div>

        {{-- Annulé --}}
        <div style="background:#1f2937;border-radius:12px;padding:20px;border-left:4px solid #f87171;">
            <div style="font-size:12px;color:#9ca3af;margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em;">Annulées</div>
            <div style="font-size:32px;font-weight:700;color:#f87171;">{{ $cancelledOrders }}</div>
            <div style="margin-top:8px;font-size:12px;color:#6b7280;">Commandes annulées</div>
        </div>

        {{-- Produits --}}
        <div style="background:#1f2937;border-radius:12px;padding:20px;border:1px solid #374151;">
            <div style="font-size:12px;color:#9ca3af;margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em;">Produits</div>
            <div style="font-size:32px;font-weight:700;color:#f9fafb;">{{ $totalProducts }}</div>
            <div style="margin-top:8px;font-size:12px;color:#6b7280;">Dans le catalogue</div>
        </div>

    </div>

    {{-- ─── INSIGHT BANNER ─── --}}
    <div style="background:linear-gradient(135deg, #1e3a5f 0%, #1f2937 100%);border-radius:12px;padding:16px 20px;margin-bottom:24px;border:1px solid #374151;display:flex;gap:24px;align-items:center;flex-wrap:wrap;">
        <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:20px;">📈</span>
            <div>
                <div style="font-size:12px;color:#9ca3af;">Croissance aujourd'hui</div>
                <div style="font-size:18px;font-weight:700;color:{{ $growthRate >= 0 ? '#34d399' : '#f87171' }};">
                    {{ $growthRate >= 0 ? '+' : '' }}{{ $growthRate }}%
                </div>
            </div>
        </div>
        <div style="width:1px;height:32px;background:#374151;"></div>
        <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:20px;">🔥</span>
            <div>
                <div style="font-size:12px;color:#9ca3af;">Jour record</div>
                <div style="font-size:18px;font-weight:700;color:#fbbf24;">{{ $peakDay }} <span style="font-size:13px;color:#9ca3af;">({{ $peakDayOrders }} cmd)</span></div>
            </div>
        </div>
        <div style="width:1px;height:32px;background:#374151;"></div>
        <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:20px;">📦</span>
            <div>
                <div style="font-size:12px;color:#9ca3af;">Commandes aujourd'hui</div>
                <div style="font-size:18px;font-weight:700;color:#38bdf8;">{{ $todayOrders }}</div>
            </div>
        </div>
    </div>

       {{-- ─── CHARTS GRID ─── --}}
    <div style="display:grid;grid-template-columns:repeat(12, 1fr);gap:20px;margin-bottom:24px;">

        {{-- MAIN: Orders over time (30 days) --}}
        <div style="grid-column:span 8;background:#1f2937;border-radius:12px;padding:20px;border:1px solid #374151;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                <h3 style="font-size:14px;font-weight:600;color:#f9fafb;margin:0;">📊 Évolution des commandes (30 jours)</h3>
                <div style="display:flex;gap:8px;">
                    <span style="font-size:11px;color:#9ca3af;background:#374151;padding:3px 10px;border-radius:6px;">Commandes</span>
                    <span style="font-size:11px;color:#34d399;background:#064e3b;padding:3px 10px;border-radius:6px;">Revenus (DT)</span>
                </div>
            </div>
            <div style="height:280px;">
                <canvas id="ordersChart"></canvas>
            </div>
        </div>

        {{-- SIDE: Hourly heatmap --}}
        <div style="grid-column:span 4;background:#1f2937;border-radius:12px;padding:20px;border:1px solid #374151;">
            <h3 style="font-size:14px;font-weight:600;color:#f9fafb;margin:0 0 16px 0;">⏰ Heures de pointe (7j)</h3>
            <div style="height:280px;">
                <canvas id="hourlyChart"></canvas>
            </div>
            <div style="margin-top:8px;font-size:11px;color:#6b7280;text-align:center;">
                Distribution horaire des commandes
            </div>
        </div>

        {{-- Status flow stacked area --}}
        <div style="grid-column:span 8;background:#1f2937;border-radius:12px;padding:20px;border:1px solid #374151;">
            <h3 style="font-size:14px;font-weight:600;color:#f9fafb;margin:0 0 16px 0;">🌊 Flux des statuts (14 jours)</h3>
            <div style="height:260px;">
                <canvas id="statusFlowChart"></canvas>
            </div>
        </div>

        {{-- Weekly pattern --}}
        <div style="grid-column:span 4;background:#1f2937;border-radius:12px;padding:20px;border:1px solid #374151;">
            <h3 style="font-size:14px;font-weight:600;color:#f9fafb;margin:0 0 16px 0;">📅 Jours de la semaine</h3>
            <div style="height:260px;">
                <canvas id="weeklyChart"></canvas>
            </div>
        </div>

        {{-- Avg Order Value trend --}}
        <div style="grid-column:span 6;background:#1f2937;border-radius:12px;padding:20px;border:1px solid #374151;">
            <h3 style="font-size:14px;font-weight:600;color:#f9fafb;margin:0 0 16px 0;">💰 Panier moyen (7 jours)</h3>
            <div style="height:240px;">
                <canvas id="aovChart"></canvas>
            </div>
        </div>

        {{-- Conversion funnel --}}
        <div style="grid-column:span 3;background:#1f2937;border-radius:12px;padding:20px;border:1px solid #374151;">
            <h3 style="font-size:14px;font-weight:600;color:#f9fafb;margin:0 0 16px 0;">🔄 Tunnel de conversion</h3>
            <div style="height:240px;">
                <canvas id="funnelChart"></canvas>
            </div>
        </div>

        {{-- Top cities --}}
        <div style="grid-column:span 3;background:#1f2937;border-radius:12px;padding:20px;border:1px solid #374151;">
            <h3 style="font-size:14px;font-weight:600;color:#f9fafb;margin:0 0 16px 0;">🏙️ Top Villes</h3>
            <div style="display:flex;flex-direction:column;gap:10px;height:240px;overflow-y:auto;">
                @foreach($topCities as $i => $city)
                <div style="display:flex;align-items:center;gap:10px;">
                    <div style="width:24px;height:24px;border-radius:6px;background:{{ ['#f59e0b','#38bdf8','#34d399','#a78bfa','#f87171'][$i] }};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#111;">{{ $i+1 }}</div>
                    <div style="flex:1;">
                        <div style="font-size:12px;color:#f9fafb;font-weight:500;">{{ $city['city'] }}</div>
                        <div style="font-size:11px;color:#6b7280;">{{ $city['count'] }} cmd · {{ number_format($city['revenue'], 0) }} DT</div>
                    </div>
                    <div style="font-size:12px;font-weight:600;color:#34d399;">{{ round(($city['count'] / $totalOrders) * 100, 1) }}%</div>
                </div>
                @endforeach
            </div>
        </div>

    </div>

    <script>
        Chart.defaults.color = '#9ca3af';
        Chart.defaults.font.family = 'Inter, system-ui, sans-serif';
        Chart.defaults.scale.grid.color = '#374151';
        Chart.defaults.scale.grid.borderColor = '#374151';

        const labels30 = @json($dailyOrdersLabels);
        const ordersData = @json($dailyOrdersData);
        const revenueData = @json($dailyRevenueData);

        // ── 1. Orders + Revenue dual axis ──
        new Chart(document.getElementById('ordersChart'), {
            type: 'line',
            data: {
                labels: labels30,
                datasets: [
                    {
                        label: 'Commandes',
                        data: ordersData,
                        borderColor: '#38bdf8',
                        backgroundColor: 'rgba(56, 189, 248, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Revenus (DT)',
                        data: revenueData,
                        borderColor: '#34d399',
                        backgroundColor: 'rgba(52, 211, 153, 0.05)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 2,
                        pointHoverRadius: 5,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        borderColor: '#374151',
                        borderWidth: 1,
                        titleColor: '#f9fafb',
                        bodyColor: '#e5e7eb',
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                if (context.dataset.yAxisID === 'y1') {
                                    return label + context.parsed.y.toFixed(2) + ' DT';
                                }
                                return label + context.parsed.y;
                            }
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: { color: 'rgba(55, 65, 81, 0.5)' },
                        ticks: { stepSize: 1 }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: { display: false },
                        ticks: {
                            callback: function(value) { return value + ' DT'; }
                        }
                    }
                }
            }
        });

        // ── 2. Hourly distribution (bar) ──
        new Chart(document.getElementById('hourlyChart'), {
            type: 'bar',
            data: {
                labels: Array.from({length: 24}, (_, i) => i + 'h'),
                datasets: [{
                    label: 'Commandes',
                    data: @json($hourlyDistribution),
                    backgroundColor: (ctx) => {
                        const v = ctx.raw;
                        const max = Math.max(...@json($hourlyDistribution));
                        const alpha = 0.3 + (v / max) * 0.7;
                        return `rgba(251, 191, 36, ${alpha})`;
                    },
                    borderColor: '#fbbf24',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { size: 10 }, maxTicksLimit: 12 } },
                    y: { display: false }
                }
            }
        });

        // ── 3. Status flow (stacked bar) ──
        const statusFlow = @json($statusFlowData);
        const flowLabels = @json($statusFlowLabels);
        const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        const statusColors = {
            pending: '#f59e0b',
            confirmed: '#38bdf8',
            shipped: '#818cf8',
            delivered: '#34d399',
            cancelled: '#f87171'
        };
        const statusLabels = {
            pending: 'En attente',
            confirmed: 'Confirmées',
            shipped: 'Expédiées',
            delivered: 'Livrées',
            cancelled: 'Annulées'
        };

        new Chart(document.getElementById('statusFlowChart'), {
            type: 'bar',
            data: {
                labels: flowLabels,
                datasets: statuses.map(s => ({
                    label: statusLabels[s],
                    data: flowLabels.map((_, i) => {
                        const keys = Object.keys(statusFlow);
                        return statusFlow[keys[i]]?.[s] || 0;
                    }),
                    backgroundColor: statusColors[s],
                    borderRadius: 3,
                    barPercentage: 0.7
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { boxWidth: 10, padding: 15, font: { size: 11 } }
                    }
                },
                scales: {
                    x: { grid: { display: false }, stacked: true },
                    y: { stacked: true, ticks: { stepSize: 1 } }
                }
            }
        });

        // ── 4. Weekly pattern (radar/polar) ──
        new Chart(document.getElementById('weeklyChart'), {
            type: 'polarArea',
            data: {
                labels: @json($weeklyPatternLabels),
                datasets: [{
                    data: @json($weeklyPatternData),
                    backgroundColor: [
                        'rgba(245, 158, 11, 0.7)',
                        'rgba(56, 189, 248, 0.7)',
                        'rgba(52, 211, 153, 0.7)',
                        'rgba(167, 139, 250, 0.7)',
                        'rgba(248, 113, 113, 0.7)',
                        'rgba(251, 191, 36, 0.7)',
                        'rgba(56, 189, 248, 0.7)'
                    ],
                    borderColor: '#1f2937',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    r: {
                        grid: { color: '#374151' },
                        ticks: { display: false, backdropColor: 'transparent' },
                        pointLabels: { font: { size: 11 }, color: '#9ca3af' }
                    }
                }
            }
        });

        // ── 5. AOV Trend ──
        new Chart(document.getElementById('aovChart'), {
            type: 'line',
            data: {
                labels: @json($avgOrderValueLabels),
                datasets: [{
                    label: 'Panier moyen (DT)',
                    data: @json($avgOrderValueData),
                    borderColor: '#a78bfa',
                    backgroundColor: 'rgba(167, 139, 250, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#a78bfa',
                    pointBorderColor: '#1f2937',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => 'Panier moyen: ' + ctx.parsed.y.toFixed(2) + ' DT'
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: {
                        ticks: { callback: (v) => v + ' DT' }
                    }
                }
            }
        });

        // ── 6. Conversion funnel (horizontal bar) ──
        const funnel = @json($funnelData);
        new Chart(document.getElementById('funnelChart'), {
            type: 'bar',
            data: {
                labels: ['Total', 'En attente', 'En cours', 'Livrées', 'Annulées'],
                datasets: [{
                    label: 'Commandes',
                    data: [funnel.total, funnel.pending, funnel.processing, funnel.delivered, funnel.cancelled],
                    backgroundColor: ['#6b7280', '#f59e0b', '#38bdf8', '#34d399', '#f87171'],
                    borderRadius: 6,
                    barPercentage: 0.6
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: { grid: { display: false }, ticks: { font: { size: 11 } } }
                }
            }
        });
    </script>

</x-filament::page>